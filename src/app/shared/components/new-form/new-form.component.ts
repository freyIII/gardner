import { ColumnSizes, Field, Section } from 'src/app/models/form.interface';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { debounce, map, startWith } from 'rxjs/operators';
import { interval } from 'rxjs';
import { UtilService } from 'src/app/services/util/util.service';
import { ApiService } from 'src/app/services/api/api.service';
@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss'],
})
export class NewFormComponent implements OnInit {
  form = new FormGroup({});
  css: any = {};
  gridCss: Array<ColumnSizes> = ['sm', 'md', 'lg', 'xl'];
  @Input() formfields: Array<Section>;
  @Input() object!: any;
  @Output() formListener = new EventEmitter<any>();
  @Output() formInitiated = new EventEmitter<any>();
  @Output() formEmitter = new EventEmitter<any>();
  @Output() autocompleteEmit = new EventEmitter<any>();

  constructor(
    public utilService: UtilService,
    private sb: MatSnackBar,
    private fb: FormBuilder,
    private api: ApiService,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.formInitiator();
  }

  formInitiator() {
    let formHolder: any = {};
    let formTypes: Array<string> = [
      'text',
      'number',
      'mobileNumber',
      'email',
      'select',
      'textarea',
      'date',
    ];
    this.formfields.forEach((section: Section) => {
      section.items.forEach((field: Field) => {
        field.disabled = field.disabled ? field.disabled : false;
        if (field.disabledIf) {
          field.disabled = this.utilService.evaluateStringV2(
            this.object,
            field.disabledIf
          );
        }
        let tempVal: any;
        if (this.object && field.path) {
          tempVal =
            field.type === 'mobileNumber' &&
            this.utilService.deepFind(this.object, field.path).length != 10
              ? this.utilService.deepFind(this.object, field.path).slice(3)
              : !['', null, undefined].includes(
                  this.utilService.deepFind(this.object, field.path)
                )
              ? this.utilService
                  .deepFind(this.object, field.subPath || field.path)
                  .toString()
              : field.default
              ? field.default
              : undefined;
        }

        let value = tempVal || field.default || undefined;
        // console.log(value, field.subPath, field.path);
        if (field.type === 'checkbox') {
          value = tempVal == 'false' || tempVal == '' ? false : tempVal;
        }
        if (field.type === 'date' && field.default) {
          value = field.default;
        }

        if (formTypes.includes(field.type)) {
          // console.log(value);
          formHolder[field.fcname] = new FormControl(
            { value: value, disabled: field.disabled },
            {
              updateOn: 'change',
              validators: this.assembleValidators(field),
            }
          );
        } else {
          formHolder[field.fcname] = new FormControl(
            { value: value, disabled: field.disabled },
            this.assembleValidators(field)
          );
        }
        //FORM ARRAY
        if (field.items) {
          formHolder[field.fcname] = new FormArray(this.setFormArray(field));
        } else {
          formHolder[field.fcname] = new FormControl(
            { value: value, disabled: field.disabled },
            this.assembleValidators(field)
          );
        }

        this.gridCss.forEach((g: ColumnSizes) => {
          if (!this.css[field.fcname]) {
            this.css[field.fcname] = ['col-12'];
          }
          this.css[field.fcname].push(g + ':col-' + field.colspan[g]);
        });
        this.css[field.fcname] = this.css[field.fcname].join(' ');
      });
    });
    this.form = new FormGroup(formHolder);
    // console.log(this.form);
    // console.log(formHolder);
    if (this.object) this.manipulateControls(this.form.value);

    this.form.valueChanges.subscribe((raw) => {
      this.manipulateControls(this.form.value);
      // console.log(raw);
      this.formfields.forEach((section: Section) => {
        section.items.forEach((i: Field) => {
          if (i.type === 'number' && raw[i.fcname])
            raw[i.fcname] = parseFloat(
              (raw[i.fcname] + '').split(',').join('')
            );
          if (section.replacers) {
            if (i.showIf) {
              section.replacers.forEach((r: any) => {
                i.show = formHolder[r.key]?.value;
              });
            }
          }
          if (i.type === 'autocomplete') {
            i.filteredChoices = this.form.get(i.fcname)?.valueChanges.pipe(
              startWith(''),
              debounce((_) => {
                return interval(200);
              }),
              map((value) => {
                const formValue = this.form.get(i.fcname)?.value;
                if (formValue) {
                  if (typeof formValue === 'string') {
                    return this._filter(formValue, i).splice(0, 10);
                  }

                  return this._filter(formValue, i, i.filterPath);
                }
                return [];
              })
            );
          }
        });
      });

      let rawValue = { ...raw };
      this.formfields.forEach((section: Section) => {
        section.items.forEach((i: Field) => {
          if (i.formula) {
            let tempFormula = i.formula;
            const regexp = /\/\/(.*?)\/\//g;
            const paths = tempFormula.match(regexp);

            if (paths) {
              for (const path of paths) {
                const objPath = path.split('//')[1];

                let value = this.util.deepFind(
                  this.form.getRawValue(),
                  objPath
                );
                if (value) {
                  value = parseInt(value);
                }

                tempFormula = tempFormula.replace(
                  path,
                  this.utilService.deepFind(rawValue, objPath) || value || 0
                );
              }

              try {
                let formula = eval(tempFormula);
                formula = ![NaN, Infinity].includes(formula) ? formula : 0;
                rawValue[i.fcname] = formula;
                this.form
                  .get(i.fcname)
                  ?.setValue(formula, { emitEvent: false });
              } catch {
                rawValue[i.fcname] = 0;
                this.form.get(i.fcname)?.setValue(0, { emitEvent: false });
              }
            }
          }
          if (
            i.type == 'number' &&
            raw[i.fcname] &&
            !i.isPercentage &&
            !i.noNumberCommaFormat
          )
            this.form
              .get(i.fcname)
              ?.setValue(
                (raw[i.fcname] + '').replace(/\d(?=(?:\d{3})+$)/g, '$&,'),
                { emitEvent: false }
              );
        });
      });
      if (this.object) this.manipulateControls(rawValue);

      setTimeout(() => {
        this.formListener.emit(rawValue);
        this.formEmitter.emit(this.form);
        // console.log(rawValue);
      }, 500);
    });

    setTimeout(() => {
      this.formInitiated.emit(this.form);
    }, 200);
  }

  private _filter(value: any, field: any, valuePath?: string) {
    // console.log(value);
    /**
     * valuePath: key of the value used in search/filtering if the $value is an object;
     */
    const isObject: boolean = typeof value === 'object';
    let filterValue: any = isObject && valuePath ? value[valuePath] : value;

    return field.choices.filter((choice: any) => {
      if (choice instanceof Object) {
        if (Array.isArray(field.choiceLabel)) {
          let newChoice = field.choiceLabel.reduce((prev: any, cur: any) => {
            if (prev) return prev + ' ' + choice[cur];
            else return choice[cur];
          }, '');

          return newChoice
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase());
        }
        return (
          choice[field.choiceLabel]
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase()) || ''
        );
      }

      return (
        choice.toLowerCase().includes(filterValue.trim().toLowerCase()) || ''
      );
    });
  }

  //SHOW AND HIDE FORM CONTROLS
  manipulateControls(value: any) {
    this.formfields.forEach((section: Section) => {
      section.items.forEach((i: Field) => {
        //HIDING AND SHOWING NORMAL FORMS
        if (i.showIf) {
          let tempResult = this.evaluate(i.showIf, value);
          if (tempResult) i.show = true;
          else i.show = false;
        }
      });
    });
  }

  evaluate(logic: string, value: any) {
    let or = logic.split('||');
    // console.log(or);
    let result: any;
    let replacer = /\/(.*?)\//g;
    let logicHolder: any;
    if (or.length) {
    }
    let findPath = logic.match(replacer);
    findPath?.forEach((el: any) => {
      logicHolder = logic?.replace(
        el,
        this.utilService.deepFind(value, el.split('/')[1])
      );
    });
    result = eval(logicHolder);
    // console.log(logicHolder, result);

    return result;
  }

  // Set Form Array
  setFormArray(field: any): any {
    // console.log(field);
    let tempHolder: any = {};
    let tempFormArr: any = [];
    let subFormArr: any = [];
    let tempSubObj: any = {};

    if (
      this.object &&
      this.object[field.fcname ? field.fcname : field] &&
      Object.keys(this.object).length
    ) {
      // console.log(this.object.allowances, field);
      this.object[field.fcname ? field.fcname : field].forEach((obj: any) => {
        // console.log(obj, field);
        field.items?.forEach((el: any) => {
          // if(obj)
          if (el.items) {
            // console.log(el.items, obj[el.path]);
            if (Array.isArray(obj[el.path])) {
              subFormArr = [];
              let subObj: any = {};
              // console.log(obj[el.path], 'LOCK');
              obj[el.path].forEach((sub: any) => {
                el.items.forEach((subItem: any) => {
                  for (let [key, value] of Object.entries(sub)) {
                    if (key === subItem.fcname) {
                      subObj[subItem.fcname] = value;
                    }
                  }
                });
                subFormArr.push(this.fb.group(subObj));
              });
            }
            // console.log(subFormArr);
            tempSubObj[el.path] = new FormArray(subFormArr);
            // tempSubObj[el.path] = this.fb.array(subFormArr);

            // if(obj[el.path])
            // console.log(obj[el.path]);
          } else {
            // console.log(el.fcname, 'FCNAME', obj[el.fcname]);
            tempHolder[el.fcname] = new FormControl(
              obj[el.fcname],
              this.assembleValidators(el)
            );
          }
          // tempSubObj[el.path] = this.fb.array(subFormArr);
        });
        // console.log(tempSubObj);
        let rawData = { ...tempHolder, ...tempSubObj };
        // console.log(rawData);
        tempFormArr.push(new FormGroup(rawData));
      });
    } else {
      // console.log('HEREEEEEEEEE!~EF');
      field.items.forEach((el: any) => {
        if (el.items) {
          tempHolder[el.fcname] = new FormArray(this.setFormArray(el));
        } else {
          tempHolder[el.fcname] = new FormControl(
            '',
            this.assembleValidators(el)
          );
        }
      });
      tempFormArr.push(new FormGroup(tempHolder));
    }
    // console.log(tempFormArr);
    return tempFormArr;
  }

  //FORM ARRAY - ADDING FORM CONTROLS
  addControls(field: any, items: any) {
    // console.log(field, items);
    // console.log('ADD FORM CONTROLS ARRAy 1');
    let tempForm: any = {};
    items.forEach((item: any) => {
      if (item.items) {
        // console.log('AddControl 1', item.items);
        tempForm[item.fcname] = new FormArray(this.setFormArray(item));
      } else {
        // console.log('AddControl 2', item);
        tempForm[item.fcname] = new FormControl(
          '',
          this.assembleValidators(item)
        );
      }
    });

    tempForm = new FormGroup(tempForm);

    (this.form.get(field) as FormArray).push(tempForm);
    // console.log(this.form.get(field));
  }

  addControls2(
    field: any,
    parentField: string,
    items: any,
    fieldIndex: number
  ) {
    // console.log('ADD FORM CONTROLS ARRAy 2');
    let tempForm: any = {};
    items.forEach((item: any) => {
      if (item?.items?.length) {
        item?.items.forEach((el: any) => {
          if (el.items)
            tempForm[el.fcname] = new FormArray(this.setFormArray(el));
          else tempForm[el.fcname] = new FormControl('');
        });
      }
    });

    let tempField: any = this.getControls(parentField);
    let tempHolder: any;
    // console.log(tempField.at(fieldIndex).controls[field] as FormArray);
    tempHolder = tempField.at(fieldIndex).controls[field] as FormArray;

    tempHolder.push(new FormGroup(tempForm));
  }

  //FORM ARRAY - REMOVING FORM CONTROLS
  deleteControl(field: any, i: any) {
    (this.form.get(field) as FormArray).removeAt(i);
  }

  deleteControl2(
    field: any,
    fieldIndex: number,
    parentField: string,
    i: number
  ) {
    let form: any = this.getControls(parentField);
    (form.at(i).get(field) as FormArray).removeAt(fieldIndex);
  }

  getControls(field: string) {
    // console.log((this.form.get(field) as FormArray).controls);
    return (this.form.get(field) as FormArray).controls;
  }

  getControls2(field: string, parentField: string, fieldIndex: number) {
    let form: any = this.getControls(parentField);
    // console.log(form.at(fieldIndex).get(field).controls);
    // console.log((form.at(fieldIndex).get(field) as FormArray).controls);
    return (form.at(fieldIndex).get(field) as FormArray).controls;
  }

  assembleValidators(field: any) {
    // console.log(field);
    let validators: Array<any> = [];

    if (!['checkbox'].includes(field.type) && !field.optional) {
      validators.push(Validators.required);
    }
    if (['email'].includes(field.type)) {
      validators.push(
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      );
      validators.push(Validators.email);
    } else if (['mobileNumber'].includes(field.type)) {
      validators.push(Validators.minLength(10));
      validators.push(Validators.maxLength(10));
      validators.push(Validators.pattern(/^9\d{9}$/));
    }

    if (field.min) {
      validators.push(Validators.min(field.min));
    }

    if (field.max) {
      validators.push(Validators.max(field.max));
    }

    if (['autocomplete'].includes(field.type)) {
      validators.push(Validators.required);
      validators.push(this.autocompleteError);
    }

    if (field.minLength || field.maxlength) {
      validators.push(Validators.minLength(field.minLength));
      validators.push(Validators.maxLength(field.maxLength));
      // console.log(validators);
    }

    return validators;
  }

  autocompleteOnClick(event: any, field: any) {
    this.autocompleteEmit.emit({ data: event, field });
  }
  numberInputOnly(event: any, withZero?: boolean) {
    //block "0" on first input
    if (!withZero) {
      if (event.target.value.length === 0 && event.key === '0') return false;
    }
    return (
      //backspace
      (event.charCode > 7 && event.charCode < 9) ||
      //period(.)
      (event.charCode > 45 && event.charCode < 47) ||
      //0-9
      (event.charCode > 47 && event.charCode < 58) ||
      //delete
      (event.charCode > 126 && event.charCode < 128)
    );
  }

  autocompleteError(control: AbstractControl) {
    // console.log(control);
    if (control) {
    }
  }

  autoCompleteDisplay(fcname: any, item: any): any {
    // console.log(item, fcname);

    if (item && fcname) {
      if (item instanceof Object) {
        for (let section of this.formfields) {
          for (let i of section.items) {
            if (
              i.type === 'autocomplete' &&
              i.fcname === fcname &&
              i.choices &&
              i.choiceLabel &&
              i.choiceValue
            ) {
              let index: number = i.choices?.findIndex(
                (el: any) =>
                  el[i.choiceValue || ''] === item[i.choiceValue || '']
              );

              // console.log(i.choices);

              if (typeof i.choiceLabel === 'string') {
                // console.log(i.choices[index][i.choiceLabel]);
                return i.choices[index][i.choiceLabel] || item;
              } else {
                return i.choices[index][i.choiceLabel[0]] || item;
              }
            }
          }
        }
      } else {
        for (let section of this.formfields) {
          for (let i of section.items) {
            if (
              i.type === 'autocomplete' &&
              i.fcname === fcname &&
              i.choices &&
              i.choiceLabel &&
              i.choiceValue &&
              i.displayValue
            ) {
              let choice = i.choices.find((el: any) => {
                return el[i.choiceValue || ''] === item;
              });

              if (Array.isArray(i.displayValue)) {
                let display = i.displayValue.reduce((prev, cur) => {
                  let value = choice[cur];
                  if (cur === 'mobileNumber') value = '(+63)' + value;
                  return prev ? prev + '   ' + value : value;
                }, '');

                return display;
              } else if (typeof i.displayValue === 'string') {
                return choice[i.displayValue];
              }
            }
          }
        }

        return item;
      }
    }

    // return item;
  }

  copyMessage(toCopy?: any) {
    this.utilService.copyToClipboard(toCopy);
    this.sb.open('Copied', 'Okay', { duration: 3500 });
  }

  compareFn(op1: any, op2: any) {
    return op1 === op2;
  }

  checkIfArray(value: any) {
    return Array.isArray(value);
  }

  setSmallValue(item: any, choicelabel: any) {
    return choicelabel.reduce((prev: any, cur: any, i: any) => {
      if (i > 0) {
        if (prev) return prev + ' ' + this.util.deepFind(item, cur);
        else return this.util.deepFind(item, cur);
      } else return '';
    }, '');
  }
  setChoiceLabel(item: any, choiceLabel: any) {
    if (Array.isArray(choiceLabel)) {
      return this.utilService.deepFind(item, choiceLabel[0]);
    } else {
      return this.utilService.deepFind(item, choiceLabel);
    }
  }
}

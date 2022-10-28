import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  filter,
} from 'rxjs/operators';
import { Field } from 'src/app/models/form.interface';
import { Find, Populate } from 'src/app/models/queryparams.interface';
import { HttpService } from 'src/app/services/http/http.service';
import { QueryParams } from 'src/app/models/queryparams.interface';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UtilService } from 'src/app/services/util/util.service';
import { I } from '@angular/cdk/keycodes';
import { ApiResponse } from 'src/app/models/api.interface';

export interface AutocompleteApi {
  query: {
    find?: Array<Find>;
    filterFields: Array<string>;
    excludedPath?: string;
    populates?: Array<Populate>;
    endpoint: string;
    method: string;
    responsePath: string;
  };
  maxResults?: number;
  returnPath?: string;
  attributes: {
    label?: string;
    value?: string;
    displayedText?: Array<string>;
    altPath?: string;
  };
  subtitles?: Array<any>;
}

@Component({
  selector: 'app-autocomplete-api',
  templateUrl: './autocomplete-api.component.html',
  styleUrls: ['./autocomplete-api.component.scss'],
})
export class AutocompleteApiComponent implements OnInit {
  @ViewChild('inputRef') inputRef: ElementRef<HTMLInputElement>;
  @Input() config?: AutocompleteApi;
  @Input() readonly: boolean = false;
  @Input() field!: Field;
  @Output() onControlChange: EventEmitter<any> = new EventEmitter();

  loading: Observable<boolean>;

  selectedOption: any;

  cloneOptions: Array<any> = [];
  searching: boolean = false;
  autocompleteControl!: FormControl;

  filteredOptions!: Observable<Array<any>>;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private util: UtilService
  ) {
    this.loading = this.http.loading;
  }

  ngOnInit(): void {
    this.autocompleteControl = new FormControl(
      {
        value: this.field?.default || '',
        disabled: this.field.disabled,
      },
      this.field.optional ? [] : Validators.required
    );

    this.filteredOptions = this.autocompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword) => this._filter(keyword))
    );
  }

  onBlur() {
    if (!this.selectedOption) return;
    setTimeout(() => {
      let value = '';
      if (this.config.attributes.displayedText) {
        let temp = [];
        this.config.attributes.displayedText.forEach((label) => {
          temp.push(this.selectedOption[label]);
        });
        value = temp.join(' ');
      } else {
        value =
          this.selectedOption[this.config.attributes.label] ||
          this.selectedOption[this.config.attributes.altPath];
      }

      if (this.inputRef.nativeElement.value !== value) {
        this.inputRef.nativeElement.value = value;
        this.autocompleteControl.setValue(value);
        this.onControlChange.emit(
          this.config.returnPath
            ? this.util.deepFind(this.selectedOption, this.config.returnPath)
            : this.selectedOption
        );
      }
    }, 200);
  }

  onOptionSelect(event: MatAutocompleteSelectedEvent) {
    const objectValue = event.option.value;
    if (this.config.attributes.displayedText) {
      let temp = [];
      this.config.attributes.displayedText.forEach((label) => {
        temp.push(objectValue[label]);
      });
      this.inputRef.nativeElement.value = temp.join(' ');
    } else {
      this.inputRef.nativeElement.value =
        objectValue[this.config.attributes.label] ||
        objectValue[this.config.attributes.altPath];
    }

    this.selectedOption = objectValue;
    this.onControlChange.emit(
      this.config.returnPath
        ? this.util.deepFind(objectValue, this.config.returnPath)
        : objectValue
    );
  }

  public _filter(keyword: string) {
    if (!this.util.hasValue(keyword)) keyword = '';
    if (typeof keyword === 'object') return of([]);

    const { find, filterFields, populates, endpoint, method, responsePath } =
      this.config.query;

    let query: QueryParams = {
      find,
      filter: {
        value: keyword,
        fields: filterFields,
      },
      limit: '10',
    };

    if (populates) query['populates'] = populates;

    return this.http
      .start<ApiResponse<any>>(method as any, endpoint, {}, query)
      .pipe(map((response) => response.env[responsePath]));
  }
}

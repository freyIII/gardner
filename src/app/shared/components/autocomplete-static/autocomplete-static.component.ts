import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import { Field } from 'src/app/models/form.interface';

export interface AutocompleteStatic {
  options: Array<any>;
  type: 'object' | 'string';
  maxResults?: number;
  attributes: {
    label: string;
    value?: string;
  };
  subtitles?: Array<any>;
}

@Component({
  selector: 'app-autocomplete-static',
  templateUrl: './autocomplete-static.component.html',
  styleUrls: ['./autocomplete-static.component.scss'],
})
export class AutocompleteStaticComponent implements OnInit {
  @Input() config?: AutocompleteStatic;
  @Input() readonly: boolean = false;
  @Input() field!: Field;
  @Output() onControlChange: EventEmitter<any> = new EventEmitter();

  cloneOptions: Array<any> = [];
  searching: boolean = false;
  autocompleteControl!: FormControl;

  filteredOptions!: Observable<Array<any>>;

  constructor() {}

  ngOnInit() {
    this.cloneOptions = JSON.parse(JSON.stringify(this.config?.options));
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
      map((keyword) =>
        keyword
          ? this._filter(keyword)
          : this.cloneOptions.slice(0, this.config?.maxResults || 10)
      )
    );
  }

  private _filter(keyword: any): Array<any> {
    if (typeof keyword === 'object') return [];
    const toLowerKeyword = keyword.trim().toLowerCase();
    let result = this.cloneOptions.filter((option) => {
      if (!option[this.config!.attributes.label]) return false;
      const lowerCaseOpt =
        this.config!.type === 'object'
          ? option[this.config!.attributes.label].toLowerCase()
          : option.toLowerCase();

      return lowerCaseOpt.includes(toLowerKeyword);
    });

    let labelPath = this.config!.attributes.label;
    result =
      this.config!.type === 'object'
        ? result.sort((a: any, b: any) => {
            let regex = new RegExp('^' + keyword, 'i');
            return regex.test(a[labelPath])
              ? regex.test(b[labelPath])
                ? a[labelPath]?.localeCompare(b[labelPath])
                : -1
              : 1;
          })
        : result.sort();
    return result.slice(0, this.config!.maxResults || 10);
  }

  onOptionSelect(
    event: MatAutocompleteSelectedEvent,
    elementRef: HTMLInputElement
  ) {
    const objectValue = event.option.value;
    elementRef.value =
      this.config!.type === 'object'
        ? objectValue[this.config!.attributes.label]
        : objectValue;

    this.onControlChange.emit(objectValue);
  }
}

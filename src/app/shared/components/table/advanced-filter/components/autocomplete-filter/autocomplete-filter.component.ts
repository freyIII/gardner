import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/api.interface';

import { QueryParams } from 'src/app/models/queryparams.interface';
import { HttpService } from 'src/app/services/http/http.service';
import { UtilService } from 'src/app/services/util/util.service';
import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';

@Component({
  selector: 'app-table-autocomplete-filter',
  templateUrl: './autocomplete-filter.component.html',
  styleUrls: ['./autocomplete-filter.component.scss'],
})
export class AutocompleteFilterComponent implements OnInit {
  @ViewChild('inputRef') inputRef: ElementRef<HTMLInputElement>;
  @Input() config?: AutocompleteApi;
  @Input() label: string;
  @Output() onControlChange: EventEmitter<any> = new EventEmitter();

  loading: Observable<boolean>;

  cloneOptions: Array<any> = [];
  searching: boolean = false;
  autocompleteControl: FormControl;
  selectedOption: any;

  panelOpened: boolean = false;

  filteredOptions: Observable<Array<any>>;

  constructor(private http: HttpService, private util: UtilService) {
    this.loading = this.http.loading;
  }

  ngOnInit(): void {
    this.autocompleteControl = new FormControl('');

    this.filteredOptions = this.autocompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((keyword) =>
        keyword !== null || keyword === '' ? this._filter(keyword) : of([])
      )
    );
  }

  onBlur() {
    if (!this.selectedOption) return;

    setTimeout(() => {
      if (!this.selectedOption) return;
      let value = '';
      if (this.config.attributes.displayedText) {
        let temp = [];
        this.config.attributes.displayedText.forEach((label) => {
          temp.push(this.selectedOption[label]);
        });
        value = temp.join(' ');
      } else {
        value = this.selectedOption[this.config.attributes.label];
      }

      if (this.inputRef.nativeElement.value !== value) {
        this.inputRef.nativeElement.value = value;
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
        objectValue[this.config.attributes.label];
    }
    this.selectedOption = objectValue;

    this.onControlChange.emit(
      this.config.returnPath
        ? this.util.deepFind(objectValue, this.config.returnPath)
        : objectValue
    );
  }

  private _filter(keyword: string) {
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

  reset() {
    this.autocompleteControl.setValue(null);
    this.selectedOption = null;
    this.onControlChange.emit(null);
  }
}

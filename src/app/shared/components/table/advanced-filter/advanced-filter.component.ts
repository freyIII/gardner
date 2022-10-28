import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Find } from 'src/app/models/queryparams.interface';
import { FilterInput } from 'src/app/models/table.interface';
import { AutocompleteFilterComponent } from './components/autocomplete-filter/autocomplete-filter.component';
import { DateRangeFilterComponent } from './components/date-range-filter/date-range-filter.component';

@Component({
  selector: 'app-table-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss'],
})
export class AdvancedFilterComponent implements OnInit, OnChanges {
  @ViewChildren(DateRangeFilterComponent)
  dateRangeFilters?: QueryList<DateRangeFilterComponent>;
  @ViewChildren(AutocompleteFilterComponent)
  autocompleteFilters?: QueryList<AutocompleteFilterComponent>;
  @Input() filters: Array<FilterInput> = [];
  @Input() loading: boolean;
  @Output() onFilter: EventEmitter<Array<Find>> = new EventEmitter();

  filterFormGroup: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    let tempFormGroup = {};

    for (const field of this.filters) {
      tempFormGroup[field.fcName || field.name] = new FormControl('');
    }

    this.filterFormGroup = this.fb.group(tempFormGroup);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters && !changes.filters.firstChange) {
      this.ngOnInit();
    }
  }

  onFilterClick() {
    let findArray = [];
    const filterValues = this.filterFormGroup.getRawValue();
    const filterFields = [];
    console.log(filterValues);
    for (const filter of this.filters) {
      if (!filterValues[filter.fcName || filter.name]) continue;
      filterFields.push(filter.name);
      if (filter.type === 'select') {
        const filterOption = filter.options.find(
          (option) =>
            (option.value ? option.value : option.label) ===
              filterValues[filter.name] && option.find
        );

        if (filterOption) {
          findArray = [...findArray, ...filterOption.find];
          continue;
        }
      } else if (filter.type === 'date-range') {
        let { start, end } = filterValues[filter.name];

        if (start) {
          findArray.push({
            field: filter.name,
            operator: '[gte]=',
            value: start,
          });
        }

        if (end) {
          findArray.push({
            field: filter.fcName || filter.name,
            operator: '[lte]=',
            value: end,
          });
        }

        continue;
      }

      findArray.push({
        field: filter.name,
        operator: '[eq]=',
        value: filterValues[filter.fcName || filter.name],
      });
    }

    //DUPLICATE FILTER NAME CHECKER
    let duplicateFields: Array<string> = _.uniq(
      _.filter(filterFields, (v, i, a: any) => a.indexOf(v) !== i)
    );

    let newFindArray = [];
    if (duplicateFields.length !== 0) {
      for (let field of duplicateFields) {
        let duplicateValues = [];
        for (let find of findArray) {
          if (find.field === field) {
            duplicateValues.push(find.value);
          }
        }

        newFindArray.push({
          field,
          operator: '[in]=',
          value: duplicateValues.join(','),
        });
      }

      for (let find of findArray) {
        if (!duplicateFields.includes(find.field)) newFindArray.push(find);
      }
    } else {
      newFindArray = findArray;
    }

    this.onFilter.emit(newFindArray);
  }

  onClearClick() {
    if (this.autocompleteFilters) {
      this.autocompleteFilters.forEach((filter) => {
        filter.reset();
      });
    }

    if (this.dateRangeFilters) {
      this.dateRangeFilters.forEach((filter) => {
        filter.reset();
      });
    }

    this.filterFormGroup.reset();

    this.onFilter.emit([]);
  }

  onFilterChange(filter: FilterInput, value: any) {
    this.filterFormGroup.controls[filter.fcName || filter.name].setValue(value);
    this.filterFormGroup.markAsDirty();
  }

  numberInputOnly(event: any) {
    //block "0" on first input
    if (event.target.value.length === 0 && event.key === '0') return false;
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
}

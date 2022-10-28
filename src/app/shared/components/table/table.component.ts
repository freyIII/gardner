import { UtilService } from './../../../services/util/util.service';
import {
  Component,
  HostListener,
  Input,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { SelectionModel } from '@angular/cdk/collections';

import { Find, QueryParams } from 'src/app/models/queryparams.interface';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import {
  PAGE_SIZE_OPTIONS,
  SEARCHABLE_COLUMN_TYPES,
  SORTABLE_COLUMN_TYPES,
  TABLE_BREAKPOINT_ABBRV,
  TABLE_BREAKPOINT_WIDTH,
  TABLE_DEFAULT,
  TABLE_EMIT,
} from './configs';
import {
  Column,
  ColumnCondition,
  FilterButton,
  FilterInput,
  SharedTableConfig,
  TablePagination,
} from 'src/app/models/table.interface';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { HttpService } from 'src/app/services/http/http.service';

import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'src/app/models/api.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('filtAnimation', [
      transition(':enter', [
        style({
          transform: 'translateY(-100%) scaleY(0%)',
          opacity: 0,
        }),
        animate(
          '200ms ease-in-out',
          style({
            transform: 'translateY(0) scaleY(100%)',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({
          transform: 'translateY(0) scaleY(100%)',
          opacity: 1,
        }),
        animate(
          '200ms ease-in-out',
          style({
            transform: 'translateY(-100%) scaleY(0%)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() config: SharedTableConfig;
  @Input() dataSource: any = [];
  @Input() dataLength: number = 0;
  @Input() loading: boolean = false;

  @Output() onTableChange: EventEmitter<QueryParams> = new EventEmitter();
  @Output() onFilterButtonChange: EventEmitter<FilterButton> =
    new EventEmitter();
  @Output() onCheckBoxSelect = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();

  //INITIAL CONFIGS
  sortableColumns: Array<string> = SORTABLE_COLUMN_TYPES;
  pageSizeOptions: Array<number> = PAGE_SIZE_OPTIONS;
  pagination: TablePagination = {
    pageIndex: TABLE_DEFAULT.PAGE_INDEX,
    pageSize: TABLE_DEFAULT.PAGE_SIZE,
  };
  lastEmit: TABLE_EMIT;

  //FILTER BUTTON
  selectedFilterButton: FilterButton;
  filterButtons: Array<FilterButton> = [];

  //ADVANCED FILTERS
  openFilter: boolean = false;
  advancedFilters: Array<Find> = [];
  filterInputs: Array<FilterInput> = [];

  //COLUMNS
  displayedColumns: Array<string> = [];
  duplicateColumns: Array<Column> = [];
  filterableColumns: Array<string> = [];
  columns: Array<Column> = [];

  //SEARCH MODEL
  keyword: string = '';

  //CHECKBOX MODEL
  checkedRows = new SelectionModel<any>(true, []);

  recentQuery: QueryParams;
  sort: Sort;
  exporting: boolean = false;

  constructor(
    public util: UtilService,
    private excel: ExcelService,
    private http: HttpService,
    private sb: MatSnackBar
  ) {}

  ngOnInit(): void {
    const { columns, filterButtons, filterInputs } = this.config;

    this.duplicateColumns = this.util.deepCopy(columns);

    //INIT FILTER BUTTON
    this.filterButtons = filterButtons;
    if (this.filterButtons && this.filterButtons.length !== 0) {
      this.filterButtons = this.util.deepCopy(this.filterButtons);
      this.selectedFilterButton = this.filterButtons.find(
        (button) => button.selected
      );

      if (!this.selectedFilterButton)
        this.selectedFilterButton = this.filterButtons[0];

      this.onFilterButtonChange.emit(this.selectedFilterButton);

      //INIT FILTER BUTTON - FILTER ADV FILTER
      if (this.selectedFilterButton.filters) {
        this.filterInputs = this.selectedFilterButton.filters;
      }
    }

    //INIT DEFAULT ADV FILTER
    if (this.filterInputs.length === 0) this.filterInputs = filterInputs;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._emitQuery(TABLE_EMIT.INIT);
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.dataSource?.firstChange) {
      this.updateBreakpoint();
      if (this.lastEmit !== TABLE_EMIT.PAGINATION) this._clearCheckedRows();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateBreakpoint();
  }

  updateBreakpoint() {
    this.displayedColumns = [];
    this.columns = [];
    let width = window.innerWidth;
    let breakPoints: Array<string> = [];

    breakPoints.push(TABLE_BREAKPOINT_ABBRV.XS);

    if (width > TABLE_BREAKPOINT_WIDTH.SM) {
      breakPoints.push(TABLE_BREAKPOINT_ABBRV.SM);
    }

    if (width > TABLE_BREAKPOINT_WIDTH.MD) {
      breakPoints.push(TABLE_BREAKPOINT_ABBRV.MD);
    }

    if (width > TABLE_BREAKPOINT_WIDTH.LG) {
      breakPoints.push(TABLE_BREAKPOINT_ABBRV.LG);
    }

    if (width > TABLE_BREAKPOINT_WIDTH.XL) {
      breakPoints.push(TABLE_BREAKPOINT_ABBRV.XL);
    }

    let tempColumns = [];
    this.filterableColumns = [];
    for (let column of this.duplicateColumns) {
      //HIDE COLUMNS
      if (
        this.selectedFilterButton &&
        this.selectedFilterButton.hiddenColumns &&
        this.selectedFilterButton.hiddenColumns.includes(column.path)
      ) {
        column.selected = false;
      }

      if (column.selected) {
        //FILTER SEARCHABLE COLUMNS
        this.displayedColumns.push(column.path);
        if (column.path && SEARCHABLE_COLUMN_TYPES.includes(column.type)) {
          this.filterableColumns.push(column.path);
        }
      }

      if (breakPoints.includes(column.breakpoint)) {
        tempColumns.push(column);
      }
    }

    if (this.selectedFilterButton?.checkbox || this.config.checkbox) {
      this.displayedColumns.unshift('select');
    }

    this.columns = tempColumns;
  }

  onFilter(filters: Array<Find>) {
    this.pagination.pageIndex = TABLE_DEFAULT.PAGE_INDEX;
    this.advancedFilters = filters;
    console.log(filters);

    this._emitQuery(TABLE_EMIT.ADVANCED_FILTER);
  }

  onFilterButtonClick(filterButton: FilterButton) {
    this.selectedFilterButton.selected = false;

    if (this.selectedFilterButton.checkbox) {
      this._clearCheckedRows();
    }

    //FILTER BUTTON - ADV FILTERS
    if (
      (this.selectedFilterButton.filters && filterButton.filters) ||
      (this.config.filterInputs && filterButton.filters)
    ) {
      this.filterInputs = filterButton.filters;
      this.advancedFilters = [];
    } else if (this.config.filterInputs && this.selectedFilterButton.filters) {
      this.filterInputs = this.config.filterInputs;
      this.advancedFilters = [];
    }

    //HIDDEN COLUMNS
    if (this.selectedFilterButton.hiddenColumns) {
      this.duplicateColumns.forEach((column) => {
        if (this.selectedFilterButton.hiddenColumns.includes(column.path)) {
          column.selected = true;
        }
      });
    }

    this.selectedFilterButton = filterButton;
    this.selectedFilterButton.selected = true;
    this.onFilterButtonChange.emit(filterButton);

    this.pagination.pageIndex = TABLE_DEFAULT.PAGE_INDEX;

    this.updateBreakpoint();
    this._emitQuery(TABLE_EMIT.FILTER_BUTTON);
  }

  onSort(sort: Sort) {
    this.sort = sort;
    this._emitQuery(TABLE_EMIT.SORT);
  }

  onPaginationChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    this.pagination = {
      pageIndex: pageIndex + 1,
      pageSize,
    };
    console.log(this.checkedRows.selected);
    this._emitQuery(TABLE_EMIT.SORT);
  }

  onSearch() {
    this.pagination.pageIndex = TABLE_DEFAULT.PAGE_INDEX;

    this._emitQuery(TABLE_EMIT.SEARCH);
  }

  triggerRefresh() {
    this.dataSource = [];
    this.keyword = '';
    this.pagination = {
      pageIndex: 1,
      pageSize: 10,
    };

    this._emitQuery(TABLE_EMIT.REFRESH);
  }

  //QUERY EMITTER
  private _emitQuery(tableEmit: TABLE_EMIT) {
    let queryParams: QueryParams = {
      find: [],
    };

    if (tableEmit !== TABLE_EMIT.PAGINATION) {
      this._clearCheckedRows();
    }

    this.lastEmit = tableEmit;

    //Default Query
    if (this.config.defaultQuery) {
      const { find, populates } = this.config.defaultQuery;
      if (find) queryParams.find = [...queryParams.find, ...find];
      if (populates) queryParams.populates = populates;
    }

    //Search Query
    if (this.keyword) {
      queryParams.filter = {
        value: this.keyword ? this.keyword : '',
        fields: this.filterableColumns,
      };
    }

    //Sorting
    if (this.sort) {
      const { active, direction } = this.sort;
      queryParams.sort = (direction === 'desc' ? '-' : '') + active;
    }

    //Pagination
    queryParams.page = this.pagination.pageIndex;
    queryParams.limit = this.pagination.pageSize;

    //Filter Button Query
    if (this.selectedFilterButton && this.selectedFilterButton.find) {
      queryParams.find.push(...this.selectedFilterButton.find);
    }

    //Advanced Filter Query
    if (this.advancedFilters.length !== 0 && this.openFilter) {
      queryParams.find = [...queryParams.find, ...this.advancedFilters];
    }

    this.recentQuery = queryParams;
    console.log(queryParams);

    this.onTableChange.emit(queryParams);
  }

  onExportClick(type: string) {
    this.exporting = true;
    const sbRef = this.sb.open('Exporting table, please wait...', undefined);
    const { fileName, endpoint, responsePath } = this.config.exportConfig;
    switch (type) {
      case 'page':
        this.excel.startExporting(
          fileName,
          this.dataSource,
          this.duplicateColumns
        );
        sbRef.dismiss();
        this.exporting = false;
        break;
      case 'all':
        let recentQueryDuplicate: QueryParams = this.util.deepCopy(
          this.recentQuery
        );
        delete recentQueryDuplicate.page;
        delete recentQueryDuplicate.limit;

        this.http
          .start<ApiResponse<Array<any>>>(
            'get',
            endpoint,
            {},
            recentQueryDuplicate
          )
          .pipe(map((response) => response.env[responsePath]))
          .subscribe(
            (dataSource) => {
              this.excel.startExporting(
                fileName,
                dataSource,
                this.duplicateColumns
              );
              this.exporting = false;
              sbRef.dismiss();
            },
            (err) => {
              console.log(err);
              this.exporting = false;
              this.sb.open(
                'Error: ' + (err.error.message || 'Something went wrong'),
                'Okay',
                {
                  duration: 3500,
                  panelClass: ['failed'],
                }
              );
            }
          );
        break;
    }
  }

  toggleAdvancedFilter() {
    this.openFilter = !this.openFilter;
    if (!this.openFilter && this.advancedFilters.length !== 0) {
      this.advancedFilters = [];
      this._emitQuery(TABLE_EMIT.ADVANCED_FILTER);
    }
  }

  displayLogical(row: any, conditions: Array<ColumnCondition>) {
    for (let condition of conditions) {
      if (this.util.evaluateString(row, condition.logic)) {
        if (condition.path) return this.util.deepFind(row, condition.path);
        else return condition.value;
      }
    }
    return '-';
  }

  onCheckBoxChange(row: any) {
    this.checkedRows.toggle(row);
    this.onCheckBoxSelect.emit(this.checkedRows.selected);
  }

  checkAll() {
    if (this.checkedRows.selected.length === this.dataSource.length) {
      this._clearCheckedRows();
      return;
    }

    this.checkedRows.select(
      ...this.util.traverseArray(this.dataSource, '_id').split(', ')
    );
    this.onCheckBoxSelect.emit(this.checkedRows.selected);
  }

  private _clearCheckedRows() {
    this.checkedRows.clear();
    this.onCheckBoxSelect.emit([]);
  }
}

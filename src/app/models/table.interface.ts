import { AutocompleteApi } from '../shared/components/autocomplete-api/autocomplete-api.component';
import { Find, QueryParams } from './queryparams.interface';
interface SPECIAL_CONDITION {
  pathToCompare: string;
  operator: string;
  valueToCompare: any[];
}

export interface SPECIAL_TYPE_CONDITONS {
  conds: SPECIAL_CONDITION[];
  truePath: string[];
  falsePath: string[];
  truePathPrefix?: string;
  truePathSuffix?: string;
  falsePathPrefix?: string;
  falsePathSuffix?: string;
}
type Breakpoint = 'xs' | 'sm' | 'lg' | 'xl' | 'md';
type ColumnType =
  | 'date'
  | 'text'
  | 'number'
  | 'percentage'
  | 'logical'
  | 'array'
  | 'special'
  | 'checkbox'
  | 'fileSize'
  | 'currency'
  | 'idRef';

type FilterInputType =
  | 'text'
  | 'autocomplete'
  | 'select'
  | 'number'
  | 'date-range';

export interface SharedTableConfig {
  columns: Array<Column>;
  defaultQuery?: QueryParams;
  filterButtons?: Array<FilterButton>;
  filterInputs?: Array<FilterInput>;
  checkbox?: boolean;
  exportConfig?: ExportConfig;
}

export interface TablePagination {
  pageIndex: number;
  pageSize: number;
}

export interface ExportConfig {
  fileName: string;
  endpoint: string;
  responsePath: string;
}

export interface Column {
  title: string;
  breakpoint: Breakpoint;
  path: string;
  altPath?: string;
  paths?: Array<string>;
  type: ColumnType;
  ifNull?: string;
  dateFormat?: string;
  selected: boolean;
  conditions?: Array<ColumnCondition>;
}

export interface ColumnCondition {
  logic: string;
  value?: string;
  path?: string;
}

export interface FilterButton {
  label: string;
  breakpoint: Breakpoint;
  selected?: boolean;
  hiddenColumns?: Array<string>;
  find?: Array<Find>;
  filters?: Array<FilterInput>;
  checkbox?: boolean;
  badge?: string;
}

export interface FilterInput {
  type: FilterInputType;
  label: string;
  name: string;
  fcName?: string;
  config?: AutocompleteApi;
  options?: Array<FilterSelectOption>;
  maxLength?: number;
}

export interface FilterSelectOption {
  label: string;
  value?: string;
  find?: Array<Find>;
}

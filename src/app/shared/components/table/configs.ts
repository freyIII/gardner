export const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50];

export enum TABLE_DEFAULT {
  PAGE_INDEX = 1,
  PAGE_SIZE = 10,
}

export enum TABLE_EMIT {
  INIT = 'init',
  ADVANCED_FILTER = 'advancedFilter',
  PAGINATION = 'pagination',
  SORT = 'sort',
  SEARCH = 'search',
  FILTER_BUTTON = 'filterButton',
  REFRESH = 'refresh',
}

export enum TABLE_BREAKPOINT_ABBRV {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

export enum TABLE_BREAKPOINT_WIDTH {
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
}

export const SORTABLE_COLUMN_TYPES: Array<string> = [
  'text',
  'date',
  'number',
  'currency',
];

export const SEARCHABLE_COLUMN_TYPES: Array<string> = [
  'text',
  'date',
  'number',
  'currency',
];

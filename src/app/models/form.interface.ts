import { Observable } from 'rxjs';

export interface KeyPath {
  key: String;
  path: String;
}

type FieldType =
  | 'img'
  | 'text'
  | 'number'
  | 'date'
  | 'date-range'
  | 'email'
  | 'mobileNumber'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'autocomplete';

type Collection = 'users';

type Appearance = 'fill' | 'outline' | 'standard' | 'legacy';

export type ColumnSizes = 'sm' | 'md' | 'lg' | 'xl';

export interface Field {
  //required
  type: FieldType;
  colspan: { xs: number; sm: number; md: number; lg: number; xl: number };
  fcname: string;
  show: boolean;
  label: string;
  appearance: Appearance;
  //optional
  showIf?: string;
  placeholder?: string;
  hint?: string;
  minLength?: number;
  maxLength?: number;
  default?: any;
  min?: number;
  max?: number;
  range?: { startDate: Date; endDate: Date };
  rowspan?: number;
  choices?: Array<any>;
  filteredChoices?: Observable<any> | undefined;
  choiceLabel?: string | Array<any>;
  subLabel?: string;
  choiceValue?: string;
  displayValue?: string | Array<any>;
  addCopyText?: boolean;
  checkboxValue?: Array<any>;
  path?: string;
  disabled?: boolean;
  readonly?: boolean;
  buttonicon?: string;
  optional?: boolean;
  suffix?: string;
  prefix?: string;
  collection?: Collection;
  isPercentage?: boolean;
  clearBtn?: boolean;
  items?: Array<any>;
  // value?: any; USE default FOR DEFAULT VALUE
  isFormArray?: boolean;
  formula?: string;
  noFormat?: boolean;
  withZero?: boolean;
  noNumberCommaFormat?: boolean;
  formatUppercase?: boolean;
  filterPath?: string; // Used in FieldType = 'autocomplete' where selected option is object. To bypass/band-aid fix _filter() in component.ts. MUST ONLY CONTAIN ONE KEY. Much as possible, this should contain concat value of different fields. ex.'${firstName}${lastName}'
  expand?: boolean;
  sliderConfig?: any;
  multipleSelect?: boolean;
  css?: string;
  subPath?: string;
  disabledIf?: string;
}

export interface Section {
  id?: string;
  label?: string;
  section: string;
  show: boolean;
  showIf?: string;
  db?: Collection | string;
  items: Array<Field>;
  replacers?: Array<KeyPath>;
  disabled?: boolean;
  sectionTooltip?: Array<string>;
}

export interface StaticAutoComplete {
  label: string;
  colspan: { xs: number; sm: number; md: number; lg: number; xl: number };
  choices: Array<any>;
  show: boolean;
  fcname: string;
  placeholder?: string;
  disabled?: string;
  readonly?: string;
  optional?: boolean;
}

export interface SharedFormOutput {
  dirty: boolean;
  valid: boolean;
  touched?: boolean;
  data: any;
}

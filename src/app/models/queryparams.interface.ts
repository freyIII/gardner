export interface Find {
  field: string;
  operator: string;
  value: string | number | boolean | Date | null;
}

export interface Populate {
  field: string;
  select?: string;
}

export interface QueryParams {
  limit?: number | string;
  sort?: string;
  fields?: string;
  page?: number;
  find?: Array<Find>;
  populates?: Array<Populate>;
  filter?: {
    value: string | boolean | number;
    fields: Array<string>;
  };
}

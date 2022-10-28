export interface Strand {
  _id: string;
  name: string;
  code: string;

  // REF IDS
  _subjects: any;
  _tenantId?: string;
  _createdBy?: string;
}

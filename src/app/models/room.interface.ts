export interface Room {
  _id: string;
  name: string;
  type: string;
  // REF IDS
  _tenantId?: string;
  _createdBy?: string;
}

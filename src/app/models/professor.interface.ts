export interface Professor {
  _id: string;
  email: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  _subjects: any;
  // REF IDS
  _tenantId?: string;
  _createdBy?: string;
}

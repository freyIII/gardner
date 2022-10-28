export interface User {
  _id: string;
  email: string;
  mobileNumber: string;
  password?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  isNewUser: boolean;
  // REF IDS
  _tenantId?: string;
  _createdBy?: string;
}

export enum USER_REDUCER_ACTIONS {
  SetUser = 'SET_USER',
  ResetUser = 'RESET_USER',
}

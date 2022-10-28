import { NavNode } from './treesidenav.interface';

export interface Role {
  _id: String;
  name: String;
  description: String;
  accesses: NavNode[];
  status: String;
  _tenantId: String;
  _createdBy?: String;
  createdAt: String;
  updatedAt?: String;
  nUsers?: Number;
  hasMobileAppAccess: Boolean;
}

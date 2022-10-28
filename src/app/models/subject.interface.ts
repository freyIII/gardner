type SubjectType = 'Core' | 'Contextualized' | 'Specialized';
export type Ordinal = '1st' | '2nd';

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
  type: SubjectType;
  lastName: string;
  yearLevel: Ordinal;
  semester: Ordinal;
  // REF IDS
  _tenantId?: string;
  _createdBy?: string;
}

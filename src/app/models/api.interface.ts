import { User } from './user.interface';

export type AnswerType = 'Yes' | 'No';
type ResponseStatus = 'success';
export type StatusType = 'Active' | 'Deleted' | 'Inactive';

export interface ApiResponse<T> {
  status: ResponseStatus;
  msg?: string;
  total_docs?: number;
  total_roles?: number;
  total_subjects?: number;
  results?: number;
  env?: {
    [key: string]: T;
  };
}

export interface LoginResponse extends ApiResponse<User> {
  session_token: string;
  token: string;
}

export interface CbmsResponse<T> {
  type: number;
  count: number;
  data: Array<T>;
}

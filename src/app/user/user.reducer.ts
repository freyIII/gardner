import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../models/user.interface';

import { resetUser, setUser } from './user.action';

const userInitialState: any = {
  _id: '',
  email: '',
  mobileNumber: '',
};

const setUserReducer = on(
  setUser,
  (state: User | unknown, props: { user: User }) => {
    return { ...(state as User), ...props.user };
  }
);

const resetUserReducer = on(resetUser, (state: User | unknown) => {
  return { ...(userInitialState as User) };
});

const _userReducer = createReducer(
  userInitialState,
  setUserReducer,
  resetUserReducer
);

export const userReducer = (state: User | unknown, action: Action) =>
  _userReducer(state, action);

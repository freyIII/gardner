import { createAction, props } from '@ngrx/store';
import { User, USER_REDUCER_ACTIONS } from '../models/user.interface';

export const setUser = createAction(
  USER_REDUCER_ACTIONS.SetUser,
  props<{ user: User }>()
);

export const resetUser = createAction(USER_REDUCER_ACTIONS.ResetUser);

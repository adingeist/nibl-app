import { createContext, Dispatch, Reducer, useReducer } from 'react';

import { JWTUserPayload } from '@shared/types/UserJWT';

type StateType = { user?: JWTUserPayload; isWelcomingUser: boolean };

type ActionType =
  | { type: 'LOGIN_NEW_USER'; user: StateType['user'] }
  | { type: 'LOGIN_EXISTING_USER'; user: StateType['user'] }
  | { type: 'STOP_WELCOMING_USER' }
  | { type: 'LOGOUT' };

const reducer: Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case 'LOGIN_NEW_USER':
      return { ...state, user: action.user, isWelcomingUser: true };
    case 'LOGIN_EXISTING_USER':
      return { ...state, user: action.user, isWelcomingUser: false };
    case 'STOP_WELCOMING_USER':
      return { ...state, isWelcomingUser: false };
    case 'LOGOUT':
      return { ...state, user: undefined };
    default:
      return state;
  }
};

export const useAuthReducer = () =>
  useReducer(reducer, {
    user: undefined,
    isWelcomingUser: false,
  });

export const AuthContext = createContext<
  StateType & { dispatch: Dispatch<ActionType> }
>({
  user: undefined,
  isWelcomingUser: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});

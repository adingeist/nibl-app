import { useContext } from 'react';
import jwtDecode from 'jwt-decode';

import { AuthContext } from '@src/auth/AuthContext';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { authStorage } from '@src/auth/authStorage';

// Hook for child components to access the UserContext values
export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  const logIn = async (authToken: string, newUser = false) => {
    const user = jwtDecode<JWTUserPayload>(authToken);

    authContext.dispatch({
      type: newUser ? 'LOGIN_NEW_USER' : 'LOGIN_EXISTING_USER',
      user,
    });

    await authStorage.storeToken(authToken);
  };

  const logOut = async () => {
    authContext.dispatch({ type: 'LOGOUT' });

    await authStorage.removeToken();
  };

  return { logIn, logOut, ...authContext };
};

type SignInAuthReturn =
  | ReturnType<typeof useAuthContext> & { user: JWTUserPayload };

export const useSignedInAuth = useAuthContext as () => SignInAuthReturn;

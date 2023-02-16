import { JWTUserPayload } from '@shared/types/UserJWT';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

/**
 * Expo Secure Store Documentation:
 *  https://docs.expo.io/versions/latest/sdk/securestore/s
 */

const key = 'authToken'; // not a secret. "key" refers to an object *key*:value

const storeToken = async (authToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    console.error('Error storing the auth token', error);
  }
};

const getToken = async (): Promise<string | null | undefined> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error getting the auth token', error);
  }
};

const getUser = async (): Promise<JWTUserPayload | null> => {
  const token = await getToken();
  return token ? jwtDecode<JWTUserPayload>(token) : null;
};

const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error removing the auth token', error);
  }
};

export const authStorage = { getToken, getUser, removeToken, storeToken };

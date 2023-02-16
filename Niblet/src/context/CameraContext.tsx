import React, { Dispatch, useContext } from 'react';
import { CameraCapturedPicture } from 'expo-camera';
import { createContext, useReducer } from 'react';

type State = {
  profilePhoto?: CameraCapturedPicture;
};

type Actions =
  | {
      type: 'SAVE_PROFILE_PHOTO';
      payload: { photo: CameraCapturedPicture };
    }
  | { type: 'CLEAR__PROFILE_PHOTO' };

const CameraContext = createContext<Context>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
  state: {},
});

type Context = {
  state: State;
  dispatch: Dispatch<Actions>;
};

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'SAVE_PROFILE_PHOTO':
      return { ...state, profilePhoto: action.payload.photo };
    case 'CLEAR__PROFILE_PHOTO':
      return { ...state, profilePhoto: undefined };
    default:
      throw new Error();
  }
};

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <CameraContext.Provider value={{ state, dispatch }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const { state, dispatch } = useContext(CameraContext);

  const saveProfilePhoto = (photo: CameraCapturedPicture) => {
    dispatch({ type: 'SAVE_PROFILE_PHOTO', payload: { photo } });
  };

  const clearProfilePhoto = () => {
    dispatch({ type: 'CLEAR__PROFILE_PHOTO' });
  };

  return {
    ...state,
    clearProfilePhoto,
    saveProfilePhoto,
  };
};

/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'react';
import { CameraType, FlashMode } from 'expo-camera';

import { EditorContextType } from '@src/screens/camera/VideoEditorScreen';

const editorContextDefault = {
  state: {
    clips: [],
    isCameraReady: false,
    isRecording: false,
    editingClipUri: undefined,
    flash: FlashMode.off,
    cameraType: CameraType.back,
  },
  dispatch: () => {},
  takeVideo: () => Promise.resolve(),
  stopVideo: () => Promise.resolve(),
};

const EditorContext = createContext<EditorContextType>(editorContextDefault);
export const useEditorContext = () => useContext(EditorContext);

export const EditorProvider = EditorContext.Provider;

import React, { createRef, useEffect, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';

import { CameraIcons } from '@src/components/camera/CameraIcons';
import { GrantCameraPermissionScreen } from '@src/screens/camera/GrantCameraPermissionScreen';
import { UploadScreenProp } from '@src/types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@src/hooks/useTheme';
import { EditingFooter } from '@src/components/camera/EditingFooter';
import { EditorProvider } from '@src/components/camera/EditorContext';
import { ResizeMode, Video } from 'expo-av';
import { DoubleTap } from '@src/components/DoubleTap';

type StateType = {
  clips: string[];
  editingClipUri?: string;
  isCameraReady: boolean;
  isRecording: boolean;
  flash: FlashMode;
  cameraType: CameraType;
};

type ActionType =
  | {
      type: 'EDIT_CLIP_AT_INDEX';
      editingClipUri: StateType['editingClipUri'];
    }
  | { type: 'TOGGLE_FLASH' }
  | { type: 'SET_CAMERA_READY' }
  | { type: 'STARTED_RECORDING' }
  | {
      type: 'STOPPED_RECORDING';
      uriToSave: string;
    }
  | { type: 'TOGGLE_CAMERA_TYPE' }
  | { type: 'FINISHED_EDITING' }
  | { type: 'DELETE_CLIP' }
  | { type: 'SWAP_CLIP_LEFT' }
  | { type: 'SWAP_CLIP_RIGHT' }
  | { type: 'PUSH_CLIP'; uri: string };

export type EditorContextType = {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
  takeVideo: () => Promise<void>;
  stopVideo: () => Promise<void>;
};

const swapClips = (state: StateType, swap: 'left' | 'right') => {
  const arr = [...state.clips];

  const index = state.clips.findIndex((uri) => uri === state.editingClipUri);

  const swapIndex = swap === 'left' ? index - 1 : index + 1;

  if (swapIndex < 0 || swapIndex > arr.length - 1) {
    return state;
  }

  [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];

  return {
    ...state,
    clips: arr,
  };
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'EDIT_CLIP_AT_INDEX': {
      return { ...state, editingClipUri: action.editingClipUri };
    }

    case 'TOGGLE_FLASH':
      return {
        ...state,
        flash: state.flash === FlashMode.off ? FlashMode.torch : FlashMode.off,
      };

    case 'STOPPED_RECORDING':
      return {
        ...state,
        isRecording: false,
        clips: [...state.clips, action.uriToSave],
      };

    case 'STARTED_RECORDING':
      return { ...state, isRecording: true };

    case 'SET_CAMERA_READY':
      return { ...state, isCameraReady: true };

    case 'TOGGLE_CAMERA_TYPE':
      return {
        ...state,
        isRecording: false, // camera stops recording when flipped
        cameraType:
          state.cameraType === CameraType.back
            ? CameraType.front
            : CameraType.back,
      };

    case 'FINISHED_EDITING':
      return { ...state, editingClipUri: undefined };

    case 'DELETE_CLIP':
      return {
        ...state,
        clips: state.clips.filter((uri) => uri !== state.editingClipUri),
        editingClipUri: undefined,
      };

    case 'SWAP_CLIP_LEFT':
      return swapClips(state, 'left');

    case 'SWAP_CLIP_RIGHT':
      return swapClips(state, 'right');

    case 'PUSH_CLIP':
      return { ...state, clips: [...state.clips, action.uri] };

    default:
      return state;
  }
};

export const VideoEditorScreen = ({
  navigation,
}: UploadScreenProp<'VideoEditor'>) => {
  const [cameraPerm, requestCameraPerm] = Camera.useCameraPermissions();
  const [micPerm, requestMicPerm] = Camera.useMicrophonePermissions();
  const cameraRef = createRef<Camera>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, {
    clips: [],
    isCameraReady: false,
    isRecording: false,
    editingClipUri: undefined,
    flash: FlashMode.off,
    cameraType: CameraType.back,
  });

  useEffect(() => {
    requestCameraPerm();
    requestMicPerm();
  }, [requestCameraPerm, requestMicPerm]);

  function toggleCameraType() {
    dispatch({ type: 'TOGGLE_CAMERA_TYPE' });
  }

  const takeVideo = async () => {
    if (state.isCameraReady && !state.isRecording && cameraRef.current) {
      dispatch({ type: 'STARTED_RECORDING' });

      const { uri } = await cameraRef.current.recordAsync();

      dispatch({ type: 'STOPPED_RECORDING', uriToSave: uri });
    }
  };

  const stopVideo = async () => {
    if (state.isRecording && cameraRef.current) {
      await cameraRef.current.stopRecording();
    }
  };

  if (!cameraPerm || !micPerm) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!cameraPerm.granted || !micPerm.granted) {
    // User denied camera/mic permission
    return <GrantCameraPermissionScreen />;
  }

  return (
    <EditorProvider value={{ state, dispatch, takeVideo, stopVideo }}>
      {(state.editingClipUri && (
        <>
          <Video
            source={{ uri: state.editingClipUri }}
            shouldPlay
            isLooping
            style={styles.playback}
            resizeMode={ResizeMode.COVER}
          />
          <View style={styles.playbackOverlay}>
            <EditingFooter />
          </View>
        </>
      )) || (
        <Camera
          onCameraReady={() => dispatch({ type: 'SET_CAMERA_READY' })}
          ref={cameraRef}
          flashMode={state.flash}
          type={state.cameraType}
          style={styles.camera}
        >
          <DoubleTap onDoubleTap={toggleCameraType}>
            <View style={[styles.safeArea, { marginTop: insets.top }]}>
              <View
                style={[
                  styles.headerContainer,
                  { paddingHorizontal: theme.screenMargin },
                ]}
              >
                <View style={styles.header}>
                  <View>
                    <CameraIcons
                      name="close"
                      onPress={() => navigation.popToTop()}
                    />
                  </View>
                  <View>
                    <CameraIcons
                      disabled={!state.isCameraReady}
                      name="camera-flip-outline"
                      onPress={toggleCameraType}
                    />
                    <CameraIcons
                      size={30}
                      disabled={!state.isCameraReady}
                      name={
                        state.flash === FlashMode.on ? 'flash' : 'flash-off'
                      }
                      style={styles.flashIcon}
                      onPress={() => dispatch({ type: 'TOGGLE_FLASH' })}
                    />
                  </View>
                </View>
              </View>
              <EditingFooter />
            </View>
          </DoubleTap>
        </Camera>
      )}
    </EditorProvider>
  );
};

const styles = StyleSheet.create({
  camera: {
    alignItems: 'center',
    flex: 1,
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerContainer: {
    flexDirection: 'row',
    flex: 1,
  },

  flashIcon: {
    paddingTop: 3,
    paddingLeft: 2,
    marginTop: 6,
  },

  safeArea: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  playback: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },

  playbackOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
});

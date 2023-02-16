import React, { ComponentProps, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { MediaTypeOptions } from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TakePhotoButton } from '@src/components/camera/TakePhotoButton';
import { Timeline } from '@src/components/camera/Timeline';
import {
  RecipeBeingNibbed,
  UploadNavigationProp,
  UploadNavigatorParamList,
} from '@src/types/navigation';
import { useEditorContext } from '@src/components/camera/EditorContext';
import { useMediaLibrary } from '@src/hooks/useMediaLibrary';

const EditingFooterContainer = ({
  children,
  ...props
}: ComponentProps<typeof View>) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.footerContainer, { paddingBottom: insets.bottom }]}
      {...props}
    >
      {children}
    </View>
  );
};

export const EditingFooter = () => {
  const { state, dispatch, stopVideo, takeVideo } = useEditorContext();
  const { promptSelectMedia } = useMediaLibrary();
  const navigation = useNavigation<UploadNavigationProp>();
  const route = useRoute<RouteProp<UploadNavigatorParamList, 'VideoEditor'>>();

  const handleMediaLibraryPress = useCallback(async () => {
    const video = await promptSelectMedia({
      quality: 1,
      selectionLimit: 1,
      videoMaxDuration: 60,
      mediaTypes: MediaTypeOptions.Videos,
      allowsEditing: true,
    });

    if (!video) {
      return;
    }

    dispatch({ type: 'PUSH_CLIP', uri: video.uri });
  }, [dispatch, promptSelectMedia]);

  const theresAClip = useMemo(
    () => state.clips.length > 0,
    [state.clips.length]
  );

  const navigateTo = route.params.navigateNextTo;

  const recipe = navigateTo === 'CreateNib' ? route.params.recipe : undefined;

  const handleDonePress = useCallback(() => {
    if (theresAClip) {
      if (navigateTo === 'CreateRecipe') {
        navigation.navigate('CreateRecipe', {
          clipUris: state.clips,
        });
      } else if (navigateTo === 'CreateNib') {
        navigation.navigate('CreateNib', {
          clipUris: state.clips,
          recipe: recipe as RecipeBeingNibbed,
        });
      }
    }
  }, [navigateTo, navigation, recipe, state.clips, theresAClip]);

  if (state.editingClipUri) {
    return (
      <EditingFooterContainer>
        <Timeline />
        <View style={styles.controlsContainer}>
          <IconButton
            iconColor="#fff"
            containerColor="rgba(255,255,255,0.5)"
            underlayColor="#ddd"
            onPress={() => dispatch({ type: 'SWAP_CLIP_LEFT' })}
            icon="swap-horizontal"
            size={40}
          />
          <IconButton
            onPress={() => dispatch({ type: 'FINISHED_EDITING' })}
            icon="check"
            mode="contained"
            iconColor="#fff"
            containerColor="rgba(0,255,0,0.5)"
            underlayColor="#0d0"
            size={70}
          />
          <IconButton
            iconColor="#fff"
            containerColor="rgba(255,0,0,0.5)"
            underlayColor="#d00"
            onPress={() => dispatch({ type: 'DELETE_CLIP' })}
            icon="trash-can-outline"
            size={30}
            style={styles.trashButton}
          />
          <IconButton
            iconColor="#fff"
            containerColor="rgba(255,255,255,0.5)"
            underlayColor="#ddd"
            onPress={() => dispatch({ type: 'SWAP_CLIP_RIGHT' })}
            icon="swap-horizontal"
            size={40}
          />
        </View>
      </EditingFooterContainer>
    );
  }

  return (
    <EditingFooterContainer>
      <Timeline />
      <View style={styles.mediaActionsContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleMediaLibraryPress}>
            <IconButton icon="image-multiple" iconColor="#fff" size={35} />
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TakePhotoButton
            onPress={state.isRecording ? stopVideo : takeVideo}
          />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleDonePress}>
            <IconButton
              icon="check-circle"
              underlayColor="red"
              disabled={!theresAClip}
              iconColor="#fff"
              size={35}
            />
          </TouchableOpacity>
        </View>
      </View>
    </EditingFooterContainer>
  );
};

const styles = StyleSheet.create({
  mediaActionsContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerContainer: {
    height: 240,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },

  trashButton: {
    width: 50,
    height: 50,
  },
});

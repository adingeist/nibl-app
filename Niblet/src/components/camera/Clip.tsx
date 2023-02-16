import React, { memo, useEffect, useRef, useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { View, Animated, TouchableOpacity, StyleSheet } from 'react-native';

import { useEditorContext } from '@src/components/camera/EditorContext';

const BORDER_WIDTH = 2;
const HEIGHT = 50;
const BACKGROUND_COLOR = '#000';
const REFRESH_RATE = 50;
const BORDER_COLOR = '#fff';

type ClipProps = {
  isEditing: boolean;
  uri: string;
  timelineScale: number;
  onPress?: (index: number) => void;
};

const ClipComponent = ({ uri, isEditing, timelineScale }: ClipProps) => {
  const [width, setWidth] = useState(0);
  const { dispatch } = useEditorContext();

  const handleClipPress = () => {
    dispatch({ type: 'EDIT_CLIP_AT_INDEX', editingClipUri: uri });
  };

  return (
    <TouchableOpacity
      onPress={handleClipPress}
      style={[
        {
          width: width,
          height: HEIGHT,
          backgroundColor: BACKGROUND_COLOR,
          borderColor: BORDER_COLOR,
          borderWidth: BORDER_WIDTH,
        },
        styles.container,
      ]}
    >
      <Video
        resizeMode={ResizeMode.COVER}
        source={{ uri }}
        positionMillis={1000}
        onLoad={(props) => {
          if (props.isLoaded) {
            setWidth(((props.durationMillis || 0) / 1000) * timelineScale);
          }
        }}
        shouldPlay={false}
        style={{
          width: width - BORDER_WIDTH * 2,
          height: HEIGHT - BORDER_WIDTH * 2,
        }}
      />
      {isEditing && (
        <View style={[{ width, height: HEIGHT }, styles.editingOverlay]} />
      )}
    </TouchableOpacity>
  );
};

const arePropsSame = (prev: Readonly<ClipProps>, next: Readonly<ClipProps>) => {
  return prev.isEditing === next.isEditing;
};

export const Clip = memo(ClipComponent, arePropsSame);

type AnimatedClipProps = {
  timelineScale: number;
};

export const AnimatedClip = ({ timelineScale }: AnimatedClipProps) => {
  const animatedCurrentClipWidth = useRef(new Animated.Value(0)).current;
  const width = useRef(0);
  const id = useRef<NodeJS.Timer | null>(null);
  const { state } = useEditorContext();

  useEffect(() => {
    if (state.isRecording) {
      id.current = setInterval(async () => {
        const added = timelineScale * (REFRESH_RATE / 1000);

        Animated.timing(animatedCurrentClipWidth, {
          duration: REFRESH_RATE, // 1 s
          toValue: Animated.add(
            new Animated.Value(width.current),
            new Animated.Value(added)
          ),
          useNativeDriver: false,
        }).start();
        width.current = width.current + added;
      }, REFRESH_RATE);
    } else {
      if (id.current) {
        clearInterval(id.current);
        id.current = null;
        width.current = 0;
        animatedCurrentClipWidth.setValue(0);
      }
    }
  }, [animatedCurrentClipWidth, state.isRecording, timelineScale]);

  if (!state.isRecording) return null;

  return (
    <Animated.View
      style={{
        width: animatedCurrentClipWidth,
        height: HEIGHT,
        borderColor: BORDER_COLOR,
        borderWidth: BORDER_WIDTH,
        backgroundColor: BACKGROUND_COLOR,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  editingOverlay: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
});

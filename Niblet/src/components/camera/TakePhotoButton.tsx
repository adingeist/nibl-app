import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useEditorContext } from '@src/components/camera/EditorContext';

const DIAMETER = 80;
const INNER_DIAMETER = DIAMETER * 0.88;

interface TakePhotoButtonProps {
  onPress: TouchableOpacity['props']['onPress'];
}

export const TakePhotoButton = ({ onPress }: TakePhotoButtonProps) => {
  const { state } = useEditorContext();

  const color = useMemo(() => {
    if (state.isRecording) {
      return `rgba(255,50,50,1)`;
    } else if (state.isCameraReady) {
      return `#fff`;
    } else {
      return `#777`;
    }
  }, [state.isCameraReady, state.isRecording]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.takePhotoCircle, { borderColor: color }]}
      >
        <View
          style={[styles.innerTakePhotoCircle, { backgroundColor: color }]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },

  takePhotoCircle: {
    width: DIAMETER,
    height: DIAMETER,
    borderRadius: DIAMETER / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerTakePhotoCircle: {
    width: INNER_DIAMETER,
    height: INNER_DIAMETER,
    borderRadius: INNER_DIAMETER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

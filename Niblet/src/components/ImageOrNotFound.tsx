import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@src/hooks/useTheme';

type ImageOrNotFoundProps = {
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  imageUri?: string;
  width: number;
  height: number;
};

export const ImageOrNotFound = ({
  onPress,
  width,
  height,
  style,
  imageUri,
}: ImageOrNotFoundProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.imageContainer,
        {
          width,
          height,
          backgroundColor: theme.colors.light,
          borderRadius: theme.roundness,
        },
        style,
      ]}
    >
      {(imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )) || (
        <MaterialCommunityIcons
          name="image"
          size={Math.min(width, height) / 2}
          color={theme.colors.background}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  image: {
    flex: 1,
    width: '100%',
  },
});

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ImageInfo } from 'expo-image-picker';

import { AppIconButton } from '@src/components/AppIconButton';
import { ImageOrNotFound } from '@src/components/ImageOrNotFound';
import { TakeOrSelectPhotoModal } from '@src/components/TakeOrSelectPhotoModal';
import { useTheme } from '@src/hooks/useTheme';

type PickImageType = {
  style?: StyleProp<ViewStyle>;
  size: number;
  deleteIconSize?: number;
  onGetImageSuccess?: (image: ImageInfo) => void;
  imageUri: string | undefined;
  setImageUri: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const PickImage = ({
  deleteIconSize,
  onGetImageSuccess,
  size,
  style,
  imageUri,
  setImageUri,
}: PickImageType) => {
  const theme = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleGetImageSuccess = (image: ImageInfo) => {
    if (onGetImageSuccess) {
      onGetImageSuccess(image);
    }
    setImageUri(image.uri);
    setIsModalVisible(false);
  };

  const deleteSize = useMemo(
    () => (deleteIconSize ? deleteIconSize : size * 0.25),
    [deleteIconSize, size]
  );

  return (
    <>
      <TakeOrSelectPhotoModal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onGetImageSuccess={handleGetImageSuccess}
      />
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
          },
          style,
        ]}
      >
        <ImageOrNotFound
          onPress={() => setIsModalVisible(true)}
          width={size - deleteSize}
          height={size - deleteSize}
          imageUri={imageUri}
        />
        <AppIconButton
          onPress={
            imageUri
              ? () => setImageUri(undefined)
              : () => setIsModalVisible(true)
          }
          name={imageUri ? 'trash-can-outline' : 'plus'}
          size={deleteSize / 1.5}
          color={theme.colors.background}
          containerStyle={[
            styles.iconContainer,
            {
              width: deleteSize,
              height: deleteSize,
              left: size - deleteSize,
              bottom: size - deleteSize,
              borderRadius: size / 2,
              backgroundColor: imageUri
                ? theme.colors.error
                : theme.colors.primary,
            },
          ]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    flex: 1,
    width: '100%',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});

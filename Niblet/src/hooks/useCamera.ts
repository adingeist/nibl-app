import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useCamera = () => {
  const promptTakePhoto = useCallback(
    async (options?: ImagePicker.ImagePickerOptions) => {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) alert(`You need to allow Niblet to access your camera`);
      const image = await ImagePicker.launchCameraAsync(options);
      if (!image.cancelled) {
        return image;
      }
    },
    []
  );

  return { promptTakePhoto };
};

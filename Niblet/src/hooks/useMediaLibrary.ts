import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useMediaLibrary = () => {
  const promptSelectMedia = useCallback(
    async (options?: ImagePicker.ImagePickerOptions) => {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted)
        alert(`You need to allow Niblet to access your media library`);
      const image = await ImagePicker.launchImageLibraryAsync(options);
      if (!image.cancelled) {
        return image;
      }
    },
    []
  );

  return { promptSelectMedia };
};

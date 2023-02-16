import React, { ComponentProps, ForwardedRef, useCallback } from 'react';
import Modal from 'react-native-modal';

import { AppModal } from '@src/components/modal/AppModal';
import { ListItem } from '@src/components/modal/ListItem';
import { useCamera } from '@src/hooks/useCamera';
import { useMediaLibrary } from '@src/hooks/useMediaLibrary';
import { ImageInfo, ImagePickerOptions } from 'expo-image-picker';

type TakeOrSelectPhotoModalComponentProps = {
  onGetImageSuccess: (image: ImageInfo) => void;
  selectPhotoOptions?: ImagePickerOptions;
  takePhotoOptions?: ImagePickerOptions;
} & ComponentProps<typeof AppModal>;

const TakeOrSelectPhotoModalComponent = (
  {
    onGetImageSuccess,
    selectPhotoOptions,
    takePhotoOptions,
    ...props
  }: TakeOrSelectPhotoModalComponentProps,
  ref: ForwardedRef<Modal>
) => {
  const { promptSelectMedia } = useMediaLibrary();
  const { promptTakePhoto } = useCamera();

  const selectImage = useCallback(async () => {
    const image = await promptSelectMedia(selectPhotoOptions);
    if (image) {
      onGetImageSuccess(image);
    }
  }, [onGetImageSuccess, promptSelectMedia, selectPhotoOptions]);

  const takePhoto = useCallback(async () => {
    const image = await promptTakePhoto(takePhotoOptions);
    if (image) {
      onGetImageSuccess(image);
    }
  }, [onGetImageSuccess, promptTakePhoto, takePhotoOptions]);

  return (
    <AppModal ref={ref} {...props}>
      <ListItem text="Take photo" iconName="camera" onPress={takePhoto} />
      <ListItem
        text="Choose from camera roll"
        iconName="image"
        onPress={selectImage}
      />
    </AppModal>
  );
};

export const TakeOrSelectPhotoModal = React.forwardRef(
  TakeOrSelectPhotoModalComponent
);

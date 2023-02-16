import React, { createRef, memo, useCallback, useMemo, useState } from 'react';
import {
  TextInput,
  StyleSheet,
  Image,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useFormikContext } from 'formik';
import { Swipeable } from 'react-native-gesture-handler';

import { useTheme } from '@src/hooks/useTheme';
import { SwipeableIconButton } from '@src/components/SwipeableIconButton';
import { CreateRecipeFormValues } from '@src/screens/CreateRecipe';
import { TakeOrSelectPhotoModal } from '@src/components/TakeOrSelectPhotoModal';
import {
  ImageInfo,
  ImagePickerOptions,
  MediaTypeOptions,
} from 'expo-image-picker';
import { PostRecipeDirectionType } from '@shared/types/routes/recipe.controller';

const MARGIN_VERTICAL = 10;

type DirectionProps = {
  index: number;
  direction: PostRecipeDirectionType;
  directionImageUri: string;
};

const EditableDirectionComponent = ({
  direction,
  directionImageUri,
  index,
}: DirectionProps) => {
  const theme = useTheme();
  const formik = useFormikContext<CreateRecipeFormValues>();
  const swipeableRef = createRef<Swipeable>();

  const name = useMemo(() => `directions[${index}].body`, [index]);

  const deleteIndexInField = useCallback(
    (field: 'directions' | 'directionImageUris', index: number) => {
      const newArray = [...formik.values[field]];
      newArray.splice(index, 1);
      formik.setFieldValue(field, newArray, false);
    },
    [formik]
  );

  const handleDeleteDirection = useCallback(() => {
    const directionImageIndex = direction.directionImagesIndexPtr;

    if (directionImageIndex) {
      deleteIndexInField('directionImageUris', directionImageIndex);
    }

    deleteIndexInField('directions', index);

    swipeableRef.current?.close();
  }, [
    deleteIndexInField,
    direction.directionImagesIndexPtr,
    index,
    swipeableRef,
  ]);

  const showImagePickerModal = useCallback(() => {
    setIsPhotoModalVisible(true);
    swipeableRef.current?.close();
  }, [swipeableRef]);

  const RightActions = useCallback(
    () => (
      <>
        <SwipeableIconButton
          containerColor={theme.colors.error}
          onPress={handleDeleteDirection}
          name="trash-can-outline"
        />
        <SwipeableIconButton
          containerColor={theme.colors.secondary}
          name="image"
          onPress={showImagePickerModal}
        />
      </>
    ),
    [
      handleDeleteDirection,
      showImagePickerModal,
      theme.colors.error,
      theme.colors.secondary,
    ]
  );

  const [color, setColor] = useState(theme.colors.dark);

  const setFocusColor = () => setColor(theme.colors.oppositeBackground);

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (index !== 0 && !e.nativeEvent.text) {
      handleDeleteDirection();
    }

    formik.handleBlur(name);
    setColor(theme.colors.dark);
  };

  const step = useMemo(() => index + 1, [index]);

  const selectPhotoOptions: ImagePickerOptions = {
    allowsEditing: true,
    mediaTypes: MediaTypeOptions.Images,
    quality: 1,
  };

  const closePhotoModal = useCallback(() => {
    setIsPhotoModalVisible(false);
  }, []);

  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  const handleGetImageSuccess = useCallback(
    (image: ImageInfo) => {
      const newDirectionImageUris = [
        ...formik.values.directionImageUris,
        image.uri,
      ];

      formik.setFieldValue(`directionImageUris`, newDirectionImageUris);

      formik.setFieldValue(
        `directions[${index}].directionImagesIndexPtr`,
        newDirectionImageUris.length - 1
      );

      closePhotoModal();
    },
    [closePhotoModal, formik, index]
  );

  return (
    <>
      <TakeOrSelectPhotoModal
        isVisible={isPhotoModalVisible}
        onBackdropPress={closePhotoModal}
        onGetImageSuccess={handleGetImageSuccess}
        takePhotoOptions={selectPhotoOptions}
        selectPhotoOptions={selectPhotoOptions}
      />

      <Swipeable
        ref={swipeableRef}
        containerStyle={styles.container}
        renderRightActions={RightActions}
        childrenContainerStyle={[
          styles.childrenContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text
          style={[
            styles.stepNumberText,
            { paddingLeft: theme.screenMargin, color },
          ]}
          variant="titleLarge"
        >
          {step}
        </Text>
        <TextInput
          autoFocus={step !== 1}
          placeholder="Direction"
          multiline
          maxLength={500}
          scrollEnabled={false}
          selectionColor={theme.colors.primary}
          onFocus={setFocusColor}
          onBlur={handleBlur}
          hitSlop={{
            left: 0,
            bottom: MARGIN_VERTICAL,
            top: MARGIN_VERTICAL,
            right: 0,
          }}
          onChangeText={(text) => formik.setFieldValue(name, text)}
          style={[
            theme.typescale.bodyMedium,
            styles.text,
            { paddingRight: theme.screenMargin, color },
          ]}
        >
          {direction.body}
        </TextInput>
        {directionImageUri && (
          <Image style={styles.stepImage} source={{ uri: directionImageUri }} />
        )}
      </Swipeable>
    </>
  );
};

const arePropsSame = (
  prev: Readonly<DirectionProps>,
  next: Readonly<DirectionProps>
) => {
  return (
    prev.direction === next.direction &&
    prev.directionImageUri === next.directionImageUri &&
    prev.index === next.index
  );
};

export const EditableDirection = memo(EditableDirectionComponent, arePropsSame);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },

  childrenContainer: {
    flexDirection: 'row',
  },

  stepImage: {
    width: 50,
    height: 50,
  },

  text: {
    alignSelf: 'center',
    paddingTop: 0,
    marginVertical: MARGIN_VERTICAL,
    flex: 1,
  },

  stepNumberText: {
    marginTop: 6,
    paddingRight: 15,
  },
});

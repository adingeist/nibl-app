import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Formik, FormikProps } from 'formik';
import Modal from 'react-native-modal';

import { AppAvatar } from '@src/components/AppAvatar';
import { AppTextInput } from '@src/components/form/AppTextInput';
import { FormikSubmitHandler } from '@src/types/formik';
import { IGetUser } from '@shared/types/routes/users.controller';
import { LinkText } from '@src/components/LinkText';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { MainAppScreenProps } from '@src/types/navigation';
import { Screen } from '@src/components/Screen';
import { TakeOrSelectPhotoModal } from '@src/components/TakeOrSelectPhotoModal';
import { useApi } from '@src/hooks/useApi';
import { useCancelHeader } from '@src/hooks/useCancelHeader';
import { usersApi } from '@src/api/users';
import { useSignedInAuth } from '@src/auth/useAuthContext';
import { useOnMount } from '@src/hooks/useOnMount';

export const EditProfileScreen = ({
  navigation,
}: MainAppScreenProps<'EditProfile'>) => {
  const { user } = useSignedInAuth();
  const formRef = createRef<FormikProps<FormValues>>();
  const modalRef = createRef<Modal>();
  const [modalVisible, setModalVisible] = useState(false);
  const updateUserApi = useApi(usersApi.update);
  const getUserApi = useApi(usersApi.getUser);
  const [profileImageUri, setProfileImageUri] = useState<string>();
  const [profileInfo, setProfileInfo] = useState<IGetUser['res']>();

  const initialValues = useMemo(
    () => ({
      username: profileInfo ? profileInfo.username : '',
      bio: profileInfo?.bio ? profileInfo.bio : null,
      link: profileInfo?.link ? profileInfo.link : null,
    }),
    [profileInfo],
  );

  const isProfilePhotoChanged = (): boolean => {
    // Not loaded -- can't be changed
    if (!profileInfo || !profileImageUri) {
      return false;
      // There's a URI, but it's not from the server, so it must've changed
    } else if (!profileInfo.profileImageKey) {
      return true;
      // The URI includes the key from the server, so it isn't changed
    } else if (profileImageUri.includes(profileInfo.profileImageKey)) {
      return false;
    } else {
      return true;
    }
  };

  const isFieldChanged = (field: keyof FormValues): boolean => {
    if (!formRef.current) return false;

    const values = formRef.current.values;

    return initialValues[field] !== values[field];
  };

  const isFormChanged = () => {
    if (
      isProfilePhotoChanged() ||
      isFieldChanged('username') ||
      isFieldChanged('bio') ||
      isFieldChanged('link')
    ) {
      return true;
    }
    return false;
  };

  const saveChanges = useCallback(() => {
    formRef.current?.submitForm();
  }, [formRef]);

  useCancelHeader({ navigation, isFormChanged, onDone: saveChanges });

  const handleSubmit: FormikSubmitHandler<FormValues> = async (values) => {
    if (!isFormChanged()) return;

    const attachments = {
      profilePicture:
        isProfilePhotoChanged() && profileImageUri
          ? {
              name: 'profilePicture.jpg',
              type: 'image/jpg',
              uri: profileImageUri,
            }
          : undefined,
    };

    const res = await updateUserApi.request({
      params: { id: user.id },
      body: {
        username: isFieldChanged('username') ? values.username : '',
        bio: isFieldChanged('bio') && values.bio ? values.bio : undefined,
        link: isFieldChanged('link') && values.link ? values.link : undefined,
      },
      attachments,
    });

    if (res.ok) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (profileInfo) {
      setProfileImageUri(profileInfo.profileImageKey);
      if (formRef.current) {
        formRef.current.setFieldValue('username', profileInfo.username);
        formRef.current.setFieldValue('bio', profileInfo.bio);
        formRef.current.setFieldValue('link', profileInfo.link);
      }
    }
  }, [formRef, profileInfo]);

  useOnMount(() => {
    const getProfileInfo = async () => {
      const res = await getUserApi.request({ params: { id: user.id } });
      if (!res.ok) return;
      setProfileInfo(res.data);
    };

    getProfileInfo();
  });

  type FormValues = typeof initialValues;

  const showModal = useCallback(() => setModalVisible(true), []);

  const closeModal = () => {
    modalRef.current?.close();
    setModalVisible(false);
  };

  const handleGetProfileImageSuccess = (image: ImagePicker.ImageInfo) => {
    setProfileImageUri(image.uri);
  };

  const imagePickerOptions: ImagePicker.ImagePickerOptions = {
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  };

  return (
    <>
      <LoadingOverlay isVisible={updateUserApi.isLoading} />
      <Screen addPadding style={styles.screen}>
        <TakeOrSelectPhotoModal
          onBackdropPress={closeModal}
          onGetImageSuccess={handleGetProfileImageSuccess}
          ref={modalRef}
          selectPhotoOptions={imagePickerOptions}
          takePhotoOptions={imagePickerOptions}
          isVisible={modalVisible}
        />

        <AppAvatar size={100} uri={profileImageUri} />
        <LinkText style={styles.changePhotoText} onPress={showModal}>
          Change Profile Photo
        </LinkText>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <View style={styles.form}>
              <AppTextInput
                formik={formik}
                name="username"
                inputModifier="username"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={
                  Platform.OS === 'ios' ? 'ascii-capable' : 'default'
                }
                label="Username"
                left={<TextInput.Icon name="account" />}
                style={styles.textInput}
                textContentType="username"
              />
              <AppTextInput
                formik={formik}
                name="bio"
                label="Bio"
                multiline
                numberOfLines={3}
                maxLength={100}
                left={<TextInput.Icon name="information-outline" />}
                style={styles.textInput}
              />
              <AppTextInput
                formik={formik}
                name="link"
                autoCapitalize="none"
                autoCorrect={false}
                label="Link"
                left={<TextInput.Icon name="link" />}
                style={styles.textInput}
                textContentType="username"
              />
            </View>
          )}
        </Formik>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  changePhotoText: {
    marginTop: 6,
  },

  textInput: {
    width: '100%',
    marginVertical: 6,
  },

  screen: {
    alignItems: 'center',
  },

  form: {
    width: '100%',
  },
});

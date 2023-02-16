import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ResizeMode, Video } from 'expo-av';

import { FormikSubmitHandler } from '@src/types/formik';
import { postYupSchema } from '@shared/schemas/post.joi';
import { RootStackAndUploadScreenProps } from '@src/types/navigation';
import { Screen } from '@src/components/Screen';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { Text } from 'react-native-paper';
import { useApi } from '@src/hooks/useApi';
import { nibsApi } from '@src/api/nibs';
import { CaptionTextBox } from '@src/components/form/CaptionTextBox';
import {
  postThumbnailHeight,
  postThumbnailWidth,
} from '@src/components/profile/PostThumbnail';
import { Headline } from '@src/components/Headline';
import { Bold } from '@src/components/Bold';
import { AppAvatar } from '@src/components/AppAvatar';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { FormErrorMessage } from '@src/components/FormErrorMessage';

const initialValues = {
  caption: '',
};

type FormValues = typeof initialValues;

export const CreateNibScreen = ({
  route,
  navigation,
}: RootStackAndUploadScreenProps<'CreateNib'>) => {
  const recipe = route.params.recipe;

  const createNibApi = useApi(nibsApi.postNib);

  const handleSubmit: FormikSubmitHandler<FormValues> = useCallback(
    async ({ caption }) => {
      const res = await createNibApi.request({
        body: { recipeId: recipe.id, caption },
        attachments: { video: route.params.clipUris },
      });

      if (res.ok) {
        navigation.navigate('MainTabNavigator', { screen: 'Feed' });
      }
    },
    [createNibApi, navigation, recipe.id, route.params.clipUris]
  );

  return (
    <>
      <LoadingOverlay isVisible={createNibApi.isLoading} />
      <Screen addPadding>
        <Video
          style={styles.videoPreview}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          source={{ uri: route.params.clipUris[0] }}
        />
        <FormErrorMessage
          isVisible={createNibApi.error !== undefined}
          error={createNibApi.error}
        />
        <Headline>Recipe</Headline>
        <View style={styles.recipeContainer}>
          <View style={styles.recipeTextContainer}>
            <Bold style={styles.title} variant="bodyMedium">
              {recipe.title}
            </Bold>
            <View style={styles.avatarContainer}>
              <AppAvatar
                style={styles.avatar}
                size={30}
                uri={recipe.post.postedBy.profileImage}
              />
              <Text variant="bodyMedium">{recipe.post.postedBy.username}</Text>
            </View>
          </View>
          <Image
            style={styles.recipeImage}
            source={{ uri: recipe.post.thumbnail }}
          />
        </View>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            caption: postYupSchema.caption,
          })}
        >
          {(formik) => (
            <>
              <CaptionTextBox
                style={styles.caption}
                formik={formik}
                name="caption"
              />
              <SubmitButton alwaysEnabled>Post Nib</SubmitButton>
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: { marginRight: 8 },

  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  caption: {
    marginVertical: 20,
  },

  recipeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  recipeTextContainer: {
    flex: 1,
  },

  recipeImage: {
    width: postThumbnailWidth * 0.75,
    height: postThumbnailHeight * 0.75,
    resizeMode: 'cover',
  },

  videoPreview: {
    alignSelf: 'center',
    backgroundColor: '#bbb',
    height: 150,
    marginVertical: 12,
    width: 125,
  },

  title: { marginBottom: 8 },
});

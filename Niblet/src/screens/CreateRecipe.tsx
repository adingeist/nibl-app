import React, { createRef, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { AppTextInput } from '@src/components/form/AppTextInput';
import { CreateRecipeNutrition } from '@src/components/CreateRecipeNutrition';
import { DataHelper } from '@src/util/DataHelper';
import { DirectionList } from '@src/components/recipe/DirectionList';
import { EditableIngredientList } from '@src/components/recipe/EditableIngredientList';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { Formik, FormikProps } from 'formik';
import { FormikSubmitHandler } from '@src/types/formik';
import { Headline } from '@src/components/Headline';
import { IPostRecipe } from '@shared/types/routes/recipe.controller';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { recipesApi } from '@src/api/recipes';
import { ResizeMode, Video } from 'expo-av';
import { RootStackAndUploadScreenProps } from '@src/types/navigation';
import { RouteSchemas } from '@shared/schemas/routes';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { useApi } from '@src/hooks/useApi';
import { useTheme } from '@src/hooks/useTheme';
import { CaptionTextBox } from '@src/components/form/CaptionTextBox';
import { NutrientsJSONBody } from '@shared/types/nutrients';
import { FoodDtoType } from '@shared/types/dto/Food.entity';
import { TextInput } from 'react-native-paper';
import { Columns } from '@src/components/Columns';
import { NumericInput } from '@src/components/form/NumericInput';

export type CreateRecipeFormIngredient = {
  food?: FoodDtoType;
  quantity: number;
  unit: string;
  note: string;
  isEditing: boolean;
};

const initialValues = {
  title: '',
  minuteDuration: '',
  directions: [{ body: '' }],
  directionImageUris: [],
  ingredients: [],
  servingSizeQuantity: '',
  servingSizeUnit: '',
  recipeNote: '',
  hashtags: [],
  warnings: [],
  caption: '',
  servingsPerRecipe: '',
  nutrients: DataHelper.ZEROED_NUTRIENTS,
} as CreateRecipeFormValues;

export type CreateRecipeFormValues = {
  title: string;
  minuteDuration: string;
  directions: IPostRecipe['body']['directions'];
  directionImageUris: string[];
  ingredients: CreateRecipeFormIngredient[];
  servingSizeQuantity: string;
  servingSizeUnit: string;
  servingsPerRecipe: string;
  nutrients: NutrientsJSONBody;
  recipeNote: string;
  hashtags: string[];
  warnings: string[];
  caption: string;
};

export const CreateRecipe = ({
  route,
  navigation,
}: RootStackAndUploadScreenProps<'CreateRecipe'>) => {
  const formRef = createRef<FormikProps<CreateRecipeFormValues>>();
  const theme = useTheme();
  const postRecipeApi = useApi(recipesApi.postRecipe);

  const scrollViewRef = useRef<KeyboardAwareScrollView>();

  const handleSubmit: FormikSubmitHandler<CreateRecipeFormValues> = async (
    values,
  ) => {
    const res = await postRecipeApi.request({
      body: {
        directions: values.directions,
        hashtags: values.hashtags,
        ingredients: values.ingredients.map((ingredient) => ({
          ingredientNote: ingredient.note,
          foodId: ingredient.food ? ingredient.food.id : 'invalid',
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
        minuteDuration: values.minuteDuration.toString(),
        nutrients: JSON.stringify(
          values.nutrients,
        ) as unknown as typeof values.nutrients,
        servingSizeQuantity: values.servingSizeQuantity,
        servingSizeUnit: values.servingSizeUnit,
        servingsPerRecipe: values.servingsPerRecipe,
        recipeNote: values.recipeNote,
        title: values.title,
        warnings: values.warnings,
        caption: values.caption,
      },
      attachments: {
        directionImages: values.directionImageUris,
        video: route.params.clipUris,
      },
    });

    if (res.ok) {
      navigation.navigate('MainTabNavigator', { screen: 'Feed' });
    }
  };

  console.log(formRef.current?.errors);

  return (
    <>
      <LoadingOverlay isVisible={postRecipeApi.isLoading} />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        extraHeight={300}
        enableOnAndroid
        innerRef={(ref) => {
          scrollViewRef.current = ref as unknown as KeyboardAwareScrollView;
        }}
      >
        <View style={styles.scrollViewContainer}>
          <Video
            style={styles.videoPreview}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            source={{ uri: route.params.clipUris[0] }}
          />

          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={RouteSchemas.postRecipe.body}
          >
            {(formik) => (
              <>
                <View style={{ paddingHorizontal: theme.screenMargin }}>
                  <FormErrorMessage
                    style={styles.formError}
                    error={postRecipeApi.error}
                    isVisible
                  />

                  <AppTextInput
                    maxLength={30}
                    formik={formik}
                    name="title"
                    label="Title"
                  />
                  <CaptionTextBox formik={formik} name="caption" />
                </View>

                <Headline
                  style={[{ marginLeft: theme.screenMargin }, styles.headline]}
                >
                  Ingredients
                </Headline>
                <EditableIngredientList formik={formik} />
                <Headline
                  style={[{ marginLeft: theme.screenMargin }, styles.headline]}
                >
                  Directions
                </Headline>
                <DirectionList />
                <Columns style={{ marginHorizontal: theme.screenMargin }}>
                  <NumericInput
                    formik={formik}
                    label="Duration"
                    name="minuteDuration"
                    suffix="minutes"
                    right={<TextInput.Icon name="clock" />}
                  />
                  <></>
                </Columns>
                <Headline
                  style={[{ marginLeft: theme.screenMargin }, styles.headline]}
                >
                  Nutrition
                </Headline>
                <CreateRecipeNutrition formik={formik} />

                <SubmitButton
                  style={[
                    { marginHorizontal: theme.screenMargin },
                    styles.submitButton,
                  ]}
                >
                  Post
                </SubmitButton>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  videoPreview: {
    alignSelf: 'center',
    backgroundColor: '#bbb',
    height: 150,
    marginVertical: 12,
    width: 125,
  },

  scrollViewContainer: {
    width: '100%',
  },

  title: {
    fontSize: 30,
    flex: 1,
    marginRight: 'auto',
  },

  headline: {
    marginTop: 14,
  },

  submitButton: {
    marginTop: 20,
    marginBottom: 150,
  },

  textInput: {
    width: '100%',
  },

  formError: {
    marginBottom: 6,
  },
});

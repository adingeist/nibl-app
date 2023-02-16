import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import { Text, TextInput } from 'react-native-paper';
import { AllMassTypes, AllVolumeTypes, EasyCook, Nutrients } from 'easy-cook';

import { AppDivider } from '@src/components/AppDivider';
import { AppTextInput } from '@src/components/form/AppTextInput';
import { Bold } from '@src/components/Bold';
import { Columns } from '@src/components/Columns';
import { CustomUnitDtoType } from '@shared/types/dto/Food.entity';
import { foodApi } from '@src/api/food';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { FormikSubmitHandler } from '@src/types/formik';
import { Headline } from '@src/components/Headline';
import { HeadlineSmall } from '@src/components/HeadlineSmall';
import { HeadlineSmallCollapsible } from '@src/components/HeadlineSmallCollapsible';
import { IPostFood } from '@shared/types/routes/food.controller';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { NumericInput } from '@src/components/form/NumericInput';
import { PercentInput } from '@src/components/form/PercentInput';
import { PickImage } from '@src/components/PickImage';
import { RouteSchemas } from '@shared/schemas/routes';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { SupportedUnitsListForm } from '@src/components/SupportedUnitsListForm';
import { ToggleButton } from '@src/components/ToggleButton';
import { UploadScreenProp } from '@src/types/navigation';
import { useApi } from '@src/hooks/useApi';
import { useFormError } from '@src/hooks/useFormError';
import { useTheme } from '@src/hooks/useTheme';
import { NutritionMetricUnitString } from '@shared/types/nutrients';

export type CreateFoodFormValues =
  | Omit<IPostFood['body'], 'nutrients'> & {
      nutrients: Record<keyof IPostFood['body']['nutrients'], string>;
    };

const initialValues: CreateFoodFormValues = {
  name: '',
  brand: '',
  servingSizeQuantity: '',
  servingSizeUnit: '',
  servingSizeMetricQuantity: '',
  servingSizeMetricUnit: undefined as unknown as NutritionMetricUnitString,
  supportedUnits: [],
  density: undefined,
  nutrients: {
    calories: '',
    totalFat: '',
    saturatedFat: '',
    polyunsaturatedFat: '',
    monounsaturatedFat: '',
    cholesterol: '',
    sodium: '',
    totalCarbohydrates: '',
    dietaryFiber: '',
    sugars: '',
    addedSugars: '',
    sugarAlcohol: '',
    protein: '',
    calcium: '',
    iron: '',
    vitaminD: '',
    potassium: '',
    vitaminA: '',
    vitaminC: '',
    vitaminK: '',
    thiamin: '',
    riboflavin: '',
    niacin: '',
    vitaminB6: '',
    folicAcid: '',
    vitaminB12: '',
    biotin: '',
    pantothenicAcid: '',
    phosphorus: '',
    iodine: '',
    magnesium: '',
    zinc: '',
    selenium: '',
    copper: '',
    manganese: '',
    chromium: '',
    molybdenum: '',
    chloride: '',
    caffeine: '',
  },
};

export const CreateIngredientScreen = ({
  navigation,
}: UploadScreenProp<'CreateIngredient'>) => {
  const theme = useTheme();
  const [showOptional, setShowOptional] = useState(false);
  const [imageUri, setImageUri] = useState<string>();
  const createFoodApi = useApi(foodApi.createFood);
  const { isFormError, setFieldOrFormError } = useFormError();

  const handleSubmit: FormikSubmitHandler<CreateFoodFormValues> = async (
    values,
    { setFieldError },
  ) => {
    const attachments = {
      image: imageUri
        ? {
            name: 'ingredient.jpg',
            type: 'image/jpg',
            uri: imageUri,
          }
        : undefined,
    };

    /**
     * To grams per metric quantity. This is the how the API expects to
     * receive nutrient data: (g nutrient / g item) or (g nutrient / mL item)
     * @param qty
     * @param nutrient
     * @returns grams per metric quantity (as a string)
     */
    const toG = (qty?: string, nutrient?: Nutrients): number => {
      if (!qty || !nutrient) return 0;
      const grams = EasyCook.change(Number.parseInt(qty))
        .labelUnit(nutrient)
        .toGrams();

      const metricQty = Number.parseFloat(values.servingSizeMetricQuantity);

      const gramsPerMetricQty = grams / metricQty;

      return gramsPerMetricQty;
    };

    const nu = values.nutrients;

    const nutrients = {
      calories: toG(nu.calories, 'Calories'),
      totalFat: toG(nu.totalFat, 'Fat'),
      saturatedFat: toG(nu.saturatedFat, 'Saturated Fat'),
      polyunsaturatedFat: toG(nu.polyunsaturatedFat, 'Polyunsaturated Fat'),
      monounsaturatedFat: toG(nu.monounsaturatedFat, 'Monounsaturated Fat'),
      cholesterol: toG(nu.cholesterol, 'Cholesterol'),
      sodium: toG(nu.sodium, 'Sodium'),
      totalCarbohydrates: toG(nu.totalCarbohydrates, 'Total Carbohydrates'),
      dietaryFiber: toG(nu.dietaryFiber, 'Dietary Fiber'),
      sugars: toG(nu.sugars, 'Total Sugars'),
      addedSugars: toG(nu.addedSugars, 'Added Sugars'),
      sugarAlcohol: toG(nu.sugarAlcohol, 'Sugar Alcohols'),
      protein: toG(nu.protein, 'Protein'),
      calcium: toG(nu.calcium, 'Calcium'),
      iron: toG(nu.iron, 'Iron'),
      vitaminD: toG(nu.vitaminD, 'Vitamin D'),
      potassium: toG(nu.potassium, 'Potassium'),
      vitaminA: toG(nu.vitaminA, 'Vitamin A'),
      vitaminC: toG(nu.vitaminC, 'Vitamin C'),
      vitaminK: toG(nu.vitaminK, 'Vitamin K'),
      thiamin: toG(nu.thiamin, 'Thiamin'),
      riboflavin: toG(nu.riboflavin, 'Riboflavin'),
      niacin: toG(nu.niacin, 'Niacin'),
      vitaminB6: toG(nu.vitaminB6, 'Vitamin B6'),
      folicAcid: toG(nu.folicAcid, 'Folic Acid'),
      vitaminB12: toG(nu.vitaminB12, 'Vitamin B12'),
      biotin: toG(nu.biotin, 'Biotin'),
      pantothenicAcid: toG(nu.pantothenicAcid, 'Pantothenic Acid'),
      phosphorus: toG(nu.phosphorus, 'Phosphorus'),
      iodine: toG(nu.iodine, 'Iodine'),
      magnesium: toG(nu.magnesium, 'Magnesium'),
      zinc: toG(nu.zinc, 'Zinc'),
      selenium: toG(nu.selenium, 'Selenium'),
      copper: toG(nu.copper, 'Copper'),
      manganese: toG(nu.manganese, 'Magnesium'),
      chromium: toG(nu.chromium, 'Chromium'),
      molybdenum: toG(nu.molybdenum, 'Molybdenum'),
      chloride: toG(nu.chloride, 'Chloride'),
      caffeine: toG(nu.caffeine, 'Caffeine'),
    };

    const res = await createFoodApi.request({
      body: {
        ...values,
        nutrients: JSON.stringify(nutrients) as unknown as typeof nutrients,
        supportedUnits: JSON.stringify(values.supportedUnits) as unknown as (
          | AllVolumeTypes
          | AllMassTypes
          | CustomUnitDtoType
        )[],
      },
      attachments,
    });

    if (res.ok) {
      navigation.goBack();
    } else {
      setFieldOrFormError(res.data, setFieldError).ifErrContains();
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={createFoodApi.isLoading} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{ paddingHorizontal: theme.screenMargin }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={RouteSchemas.postFood.body}
        >
          {(formik) => {
            const hasMetricUnit =
              formik.values.servingSizeMetricUnit !== undefined;

            return (
              <>
                <FormErrorMessage
                  error={createFoodApi.error}
                  isVisible={isFormError}
                />

                <View style={styles.recipeInfoContainer}>
                  <View style={styles.titleContainer}>
                    <Headline>Title</Headline>
                    <AppTextInput
                      dense
                      formik={formik}
                      label="Ingredient name"
                      name="name"
                      placeholder="ex: 'Sugar'"
                    />
                    <AppTextInput
                      dense
                      formik={formik}
                      label="Brand name (optional)"
                      name="brand"
                    />
                  </View>
                  <View style={styles.imageContainer}>
                    <Headline style={styles.headlineImage}>Image</Headline>
                    <HeadlineSmall>(optional)</HeadlineSmall>
                    <PickImage
                      imageUri={imageUri}
                      setImageUri={setImageUri}
                      size={90}
                      style={styles.imagePicker}
                    />
                  </View>
                </View>

                <Headline>Nutrition</Headline>
                <>
                  <View style={styles.elevation5}>
                    <HeadlineSmallCollapsible headline="Serving info">
                      <SupportedUnitsListForm
                        formik={formik}
                        supportedUnits={formik.values.supportedUnits}
                        servingSizeMetricUnit={
                          formik.values.servingSizeMetricUnit
                        }
                      />

                      {formik.values.servingSizeMetricQuantity && (
                        <Text variant="bodyMedium">
                          <Bold>Serving size </Bold>
                          {`${formik.values.servingSizeQuantity} ${formik.values.servingSizeUnit} (${formik.values.servingSizeMetricQuantity}${formik.values.servingSizeMetricUnit})`}
                        </Text>
                      )}
                    </HeadlineSmallCollapsible>
                  </View>

                  <View style={styles.elevation3}>
                    <HeadlineSmallCollapsible headline="Nutrients">
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="lightning-bolt"
                          />
                        }
                        label="Calories"
                        name="nutrients.calories"
                        suffix="kcal"
                      />
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="water-opacity"
                          />
                        }
                        label="Total fat"
                        name="nutrients.totalFat"
                        suffix="g"
                      />
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="square-medium"
                          />
                        }
                        label="Saturated fat"
                        name="nutrients.saturatedFat"
                        suffix="g"
                      />
                      {showOptional && (
                        <>
                          <NumericInput
                            formik={formik}
                            disabled={!hasMetricUnit}
                            right={
                              <TextInput.Icon
                                disabled={!hasMetricUnit}
                                name="square-medium"
                              />
                            }
                            label="Polyunsaturated fat (optional)"
                            name="nutrients.polyunsaturatedFat"
                            suffix="g"
                          />
                          <NumericInput
                            formik={formik}
                            disabled={!hasMetricUnit}
                            right={
                              <TextInput.Icon
                                disabled={!hasMetricUnit}
                                name="square-medium"
                              />
                            }
                            label="Monounsaturated fat (optional)"
                            name="nutrients.monounsaturatedFat"
                            suffix="g"
                          />
                        </>
                      )}
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="dots-hexagon"
                          />
                        }
                        label="Cholesterol"
                        name="nutrients.cholesterol"
                        suffix="mg"
                      />
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="shaker-outline"
                          />
                        }
                        label="Sodium"
                        name="nutrients.sodium"
                        suffix="mg"
                      />
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="barley"
                          />
                        }
                        label="Total carbohydrates"
                        name="nutrients.totalCarbohydrates"
                        suffix="g"
                      />
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="grass"
                          />
                        }
                        label="Dietary fiber"
                        name="nutrients.dietaryFiber"
                        suffix="g"
                      />
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="cube-outline"
                          />
                        }
                        label="Sugars"
                        name="nutrients.sugars"
                        suffix="g"
                      />
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="cube-outline"
                          />
                        }
                        label="Added sugars"
                        name="nutrients.addedSugars"
                        suffix="g"
                      />
                      {showOptional && (
                        <NumericInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          right={
                            <TextInput.Icon
                              disabled={!hasMetricUnit}
                              name="cube-outline"
                            />
                          }
                          label="Sugar alcohols (optional)"
                          name="nutrients.sugarAlcohols"
                          suffix="g"
                        />
                      )}
                      <NumericInput
                        formik={formik}
                        disabled={!hasMetricUnit}
                        right={
                          <TextInput.Icon
                            disabled={!hasMetricUnit}
                            name="cube-unfolded"
                          />
                        }
                        label="Protein"
                        name="nutrients.protein"
                        suffix="g"
                      />
                      <ToggleButton
                        toggledLabel="Hide optional nutrients"
                        notToggledLabel="Show all nutrients"
                        isToggled={showOptional}
                        onPress={() => setShowOptional((state) => !state)}
                      />
                    </HeadlineSmallCollapsible>
                  </View>

                  <HeadlineSmallCollapsible
                    collapsed
                    headline="Vitamins and Minerals (optional)"
                  >
                    <Columns>
                      <>
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Calcium"
                          name="nutrients.calcium"
                        />

                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Vitamin D"
                          name="nutrients.vitaminD"
                        />
                      </>
                      <>
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Iron"
                          name="nutrients.iron"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Potassium"
                          name="nutrients.potassium"
                        />
                      </>
                    </Columns>

                    <AppDivider />

                    <Columns>
                      <>
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Vitamin A"
                          name="nutrients.vitaminA"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Vitamin K"
                          name="nutrients.vitaminK"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Thiamin"
                          name="nutrients.thiamin"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Niacin"
                          name="nutrients.niacin"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Vitamin B6"
                          name="nutrients.vitaminB6"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Folic Acid"
                          name="nutrients.folicAcid"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Phosphorus"
                          name="nutrients.phosphorus"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Magnesium"
                          name="nutrients.magnesium"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Zinc"
                          name="nutrients.zinc"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Manganese"
                          name="nutrients.manganese"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Chloride"
                          name="nutrients.chloride"
                        />
                      </>

                      <>
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Vitamin C"
                          name="nutrients.vitaminC"
                        />

                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          suffix="mg"
                          nutrient="Caffeine"
                          name="nutrients.caffeine"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Riboflavin"
                          name="nutrients.riboflavin"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Pantothenic Acid"
                          name="nutrients.pantothenicAcid"
                        />

                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Biotin"
                          name="nutrients.biotin"
                        />

                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Vitamin B12"
                          name="nutrients.vitaminB12"
                        />

                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Iodine"
                          name="nutrients.iodine"
                        />

                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Selenium"
                          name="nutrients.selenium"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Copper"
                          name="nutrients.copper"
                        />

                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Chromium"
                          name="nutrients.chromium"
                        />
                        <PercentInput
                          formik={formik}
                          disabled={!hasMetricUnit}
                          nutrient="Molybdenum"
                          name="nutrients.molybdenum"
                        />
                      </>
                    </Columns>
                  </HeadlineSmallCollapsible>
                </>
                <SubmitButton>Create</SubmitButton>
              </>
            );
          }}
        </Formik>

        <View style={styles.endSpacer} />
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  collapsible: {
    marginVertical: 20,
  },
  tinyInput: {
    width: 250,
  },
  inputColumnLeft: {
    flex: 1,
    marginRight: 10,
  },
  inputColumnRight: {
    flex: 1,
    marginLeft: 10,
  },

  smallText: {
    fontSize: 13,
  },

  extraSmallText: {
    fontSize: 12,
  },

  endSpacer: {
    width: '100%',
    height: 300,
  },

  elevation5: {
    elevation: 5,
    zIndex: 5,
  },

  elevation4: {
    elevation: 4,
    zIndex: 4,
  },

  elevation3: {
    elevation: 3,
    zIndex: 3,
  },

  spaceFiller: {
    flex: 1,
  },

  imagePicker: {
    alignSelf: 'center',
  },

  headlineImage: {
    marginBottom: 0,
  },

  recipeInfoContainer: {
    flexDirection: 'row',
  },

  titleContainer: {
    flex: 1,
  },

  imageContainer: {
    marginLeft: 20,
  },
});

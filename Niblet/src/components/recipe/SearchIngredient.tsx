import React, { useCallback, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
  View,
} from 'react-native';

import { SearchBox } from '@src/components/form/SearchBox';
import { useNavigation } from '@react-navigation/native';
import { UploadNavigationProp } from '@src/types/navigation';
import { useTheme } from '@src/hooks/useTheme';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useApi } from '@src/hooks/useApi';
import { foodApi } from '@src/api/food';
import { NoResults } from '@src/components/NoResults';
import { FoodDtoType } from '@shared/types/dto/Food.entity';
import { IngredientSearchResult } from '@src/components/IngredientSearchResult';
import { Formik, FormikProps } from 'formik';
import {
  CreateRecipeFormIngredient,
  CreateRecipeFormValues,
} from '@src/screens/CreateRecipe';
import { ArrElement } from '@src/types/util';
import { NumericInput } from '@src/components/form/NumericInput';
import { AppDropDownPicker } from '@src/components/form/AppDropDownPicker';
import { AppTextInput } from '@src/components/form/AppTextInput';
import * as Yup from 'yup';
import { YupErrors } from '@shared/schemas/yupErrors';
import { FormikSubmitHandler } from '@src/types/formik';
import { DeleteOrConfirmButtons } from '@src/components/DeleteOrConfirmButtons';

type EditIngredientProps = {
  index: number;
  formik: FormikProps<CreateRecipeFormValues>;
};

export const SearchIngredient = ({ index, formik }: EditIngredientProps) => {
  const navigation = useNavigation<UploadNavigationProp>();
  const theme = useTheme();
  const foodSearchApi = useApi(foodApi.searchFoods);
  const [foods, setFoods] = useState<FoodDtoType[]>([]);

  const ingredients = useMemo(
    () => formik.values.ingredients,
    [formik.values.ingredients],
  );

  const ingredient = useMemo(() => ingredients[index], [index, ingredients]);

  const addIngredientInitialValues = useMemo(
    () => ({
      quantity: ingredient.quantity,
      note: ingredient.note,
      unit: ingredient.unit,
    }),
    [ingredient.note, ingredient.quantity, ingredient.unit],
  );

  type FormValues = typeof addIngredientInitialValues;

  const supportedUnits = useMemo(() => {
    if (!ingredient.food) {
      return [];
    }

    return ingredient.food.supportedUnits.map((unit) =>
      typeof unit === 'string' ? unit : unit.unit,
    );
  }, [ingredient.food]);

  const handleCreateIngredient = () => {
    navigation.navigate('CreateIngredient');
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    formik.setFieldValue(`ingredients`, newIngredients, false);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!e.nativeEvent.text && !ingredient.food) {
      removeIngredient(index);
    }
  };

  const handleSearch = async (text: string) => {
    const res = await foodSearchApi.request({ query: { str: text } });
    if (res.ok && res.data) {
      setFoods(res.data.foods);
    }
  };

  const setSelectedFood = (food: FoodDtoType) => {
    const ingredient: ArrElement<CreateRecipeFormValues['ingredients']> = {
      isEditing: true,
      note: '',
      quantity: 0,
      unit: '',
      food: food,
    };

    formik.setFieldValue(`ingredients[${index}]`, ingredient, false);
  };

  const deleteIngredient = useCallback(() => {
    const newIngredients = [...formik.values.ingredients];
    newIngredients.splice(index, 1);
    formik.setFieldValue(`ingredients`, newIngredients);
  }, [formik, index]);

  const handleSubmit: FormikSubmitHandler<FormValues> = async (values) => {
    const newIngredient: CreateRecipeFormIngredient = {
      ...formik.values.ingredients[index],
      quantity: values.quantity,
      unit: values.unit,
      note: values.note,
      isEditing: false,
    };

    formik.setFieldValue(`ingredients[${index}]`, newIngredient, false);
  };

  const selectNewFood = useCallback(() => {
    formik.setFieldValue(`ingredients[${index}].foodId`, undefined);
  }, [formik, index]);

  if (ingredient.food) {
    return (
      <>
        <IngredientSearchResult
          onPress={selectNewFood}
          food={ingredient.food}
        />

        <Formik
          onSubmit={handleSubmit}
          validationSchema={() =>
            Yup.object().shape({
              quantity: Yup.number()
                .positive(YupErrors.number.positive('Quantity'))
                .required(YupErrors.required('Quantity')),
              note: Yup.string(),
              unit: Yup.string()
                .oneOf(supportedUnits)
                .required(YupErrors.required('Unit')),
            })
          }
          initialValues={addIngredientInitialValues}
        >
          {(subFormik) => (
            <View style={{ paddingHorizontal: theme.screenMargin }}>
              <View style={styles.editIngredientTopRow}>
                <View style={styles.editTextInputContainer}>
                  <NumericInput
                    dense={false}
                    name={`quantity`}
                    label="Quantity"
                    formik={subFormik}
                  />
                </View>
                <View style={styles.editTextInputContainer}>
                  <AppDropDownPicker
                    name={`unit`}
                    label="Unit"
                    formik={subFormik}
                    items={supportedUnits}
                    containerStyle={styles.elevation5}
                  />
                </View>
              </View>

              <View style={styles.editIngredientBottomRow}>
                <View style={styles.editTextInputContainer}>
                  <AppTextInput
                    style={styles.elevation4}
                    name={`note`}
                    label="Note"
                    autoCapitalize="none"
                    formik={subFormik}
                    placeholder="ex: 'melted', 'frozen'..."
                  />
                </View>
                <DeleteOrConfirmButtons
                  onDeletePress={deleteIngredient}
                  onConfirmPress={() => subFormik.handleSubmit()}
                />
              </View>
            </View>
          )}
        </Formik>
      </>
    );
  }

  return (
    <>
      <View
        style={[{ paddingHorizontal: theme.screenMargin }, styles.searchBox]}
      >
        <SearchBox autoFocus onChangeText={handleSearch} onBlur={handleBlur} />
      </View>

      {foods.map((food) => (
        <IngredientSearchResult
          food={food}
          onPress={setSelectedFood}
          key={food.id}
        />
      ))}

      <View
        style={[{ paddingHorizontal: theme.screenMargin }, styles.createButton]}
      >
        <View style={styles.searchResultsAndCreateContainer}>
          <View style={styles.resultsContainer}>
            {foodSearchApi.isLoading && <ActivityIndicator animating={true} />}

            {!foodSearchApi.isLoading && foods.length === 0 && (
              <NoResults>No ingredients found</NoResults>
            )}
          </View>

          <Button
            onPress={handleCreateIngredient}
            mode="outlined"
          >{`Can't find it? Create it!`}</Button>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  addIngredientText: {
    flex: 1,
    textAlign: 'center',
    marginVertical: 20,
  },

  createButton: {
    marginVertical: 12,
  },

  searchBox: {
    overflow: 'hidden',
  },

  image: {
    width: 25,
    height: 25,
  },

  resultsContainer: {
    height: 200,
    alignItems: 'center',
  },

  brandText: {
    marginLeft: 10,
    fontStyle: 'italic',
  },

  searchResultsAndCreateContainer: {
    width: '100%',
    overflow: 'hidden',
  },

  elevation5: {
    zIndex: 5,
    elevation: 5,
  },

  elevation4: {
    zIndex: 4,
    elevation: 4,
  },

  editTextInputContainer: {
    flex: 0.48,
  },

  editIngredientTopRow: {
    zIndex: 5,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  editIngredientBottomRow: {
    zIndex: 4,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

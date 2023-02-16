import React, { useMemo } from 'react';

import {
  CreateRecipeFormIngredient,
  CreateRecipeFormValues,
} from '@src/screens/CreateRecipe';
import { EditableIngredientListing } from '@src/components/recipe/EditableIngredientListing';
import { ListAddButton } from '@src/components/recipe/ListAddButton';
import { SearchIngredient } from '@src/components/recipe/SearchIngredient';
import { useTheme } from '@src/hooks/useTheme';
import { FormikProps } from 'formik';

type IngredientListProps = {
  formik: FormikProps<CreateRecipeFormValues>;
};

export const EditableIngredientList = ({ formik }: IngredientListProps) => {
  const theme = useTheme();

  const ingredients = useMemo(
    () => formik.values.ingredients,
    [formik.values.ingredients],
  );

  const handleAddIngredient = () => {
    const newIngredients: CreateRecipeFormIngredient[] = [
      ...ingredients,
      {
        isEditing: true,
        note: '',
        quantity: 0,
        unit: '',
        food: undefined,
      },
    ];

    formik.setFieldValue('ingredients', newIngredients, false);
  };

  const ingredientIsBeingModified = useMemo(
    () => ingredients.find((ingredient) => ingredient.isEditing) !== undefined,
    [ingredients],
  );

  return (
    <>
      {ingredients.map((ingredient, index) => {
        if (ingredient.isEditing) {
          return <SearchIngredient key={index} formik={formik} index={index} />;
        } else if (ingredient.food) {
          return (
            <EditableIngredientListing
              foodName={ingredient.food.name}
              formik={formik}
              key={index}
              index={index}
              note={ingredient.note}
              quantity={ingredient.quantity}
              unit={ingredient.unit}
              imageUri={ingredient.food.name}
            />
          );
        }
      })}
      <ListAddButton
        disabled={ingredientIsBeingModified}
        onPress={handleAddIngredient}
        iconStyle={{ marginLeft: theme.screenMargin }}
        label="Add ingredient"
      />
    </>
  );
};

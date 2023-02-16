import { IngredientListing } from '@src/components/recipe/IngredientListing';
import { SwipeableIconButton } from '@src/components/SwipeableIconButton';
import { useTheme } from '@src/hooks/useTheme';
import { CreateRecipeFormValues } from '@src/screens/CreateRecipe';
import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { Swipeable } from 'react-native-gesture-handler';

type IngredientProps = {
  quantity: number;
  unit: string;
  foodName: string;
  note?: string;
  index: number;
  brand?: string;
  formik: FormikProps<CreateRecipeFormValues>;
  imageUri?: string | null;
};

export const EditableIngredientListing = ({
  foodName,
  unit,
  quantity,
  index,
  note,
  brand,
  imageUri,
  formik,
}: IngredientProps) => {
  const theme = useTheme();

  const handleDeleteIngredient = useCallback(() => {
    const newIngredients = [...formik.values.ingredients];
    newIngredients.splice(index, 1);
    formik.setFieldValue('ingredients', newIngredients);
  }, [formik, index]);

  const rightActions = useCallback(() => {
    return (
      <>
        <SwipeableIconButton
          onPress={handleDeleteIngredient}
          containerColor={theme.colors.error}
          name="trash-can-outline"
          size={30}
        />
      </>
    );
  }, [handleDeleteIngredient, theme.colors.error]);

  const handleIngredientPress = useCallback(() => {
    formik.setFieldValue(`ingredients[${index}].isEditing`, true);
  }, [formik, index]);

  return (
    <Swipeable
      renderRightActions={rightActions}
      containerStyle={{
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.light,
      }}
    >
      <IngredientListing
        note={note}
        quantity={quantity}
        unit={unit}
        foodName={foodName}
        brand={brand}
        imageUri={imageUri}
        onPress={handleIngredientPress}
      />
    </Swipeable>
  );
};

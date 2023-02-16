import React, { useMemo } from 'react';
import { useFormikContext } from 'formik';

import { CreateRecipeFormValues } from '@src/screens/CreateRecipe';
import { EditableDirection } from '@src/components/recipe/EditableDirection';
import { ListAddButton } from '@src/components/recipe/ListAddButton';
import { useTheme } from '@src/hooks/useTheme';

export const DirectionList = () => {
  const formik = useFormikContext<CreateRecipeFormValues>();
  const theme = useTheme();

  const directions = useMemo(
    () => formik.values.directions,
    [formik.values.directions]
  );

  const lastDirectionIsBlank = useMemo(
    () => directions.length && directions[directions.length - 1].body === '',
    [directions]
  );

  const handleAddDirection = () => {
    formik.setFieldValue(
      'directions',
      [...formik.values.directions, ''],
      false
    );
  };

  return (
    <>
      {formik.values.directions.map((direction, index) => (
        <EditableDirection
          direction={direction}
          directionImageUri={formik.values.directionImageUris[index]}
          index={index}
          key={index}
        />
      ))}
      <ListAddButton
        disabled={lastDirectionIsBlank || directions.length === 20}
        onPress={handleAddDirection}
        label="Add direction"
        iconStyle={{ marginLeft: theme.screenMargin }}
      />
    </>
  );
};

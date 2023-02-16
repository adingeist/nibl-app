import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Columns } from '@src/components/Columns';
import { NumericInput } from '@src/components/form/NumericInput';
import { NutritionDisplay } from '@src/components/NutritionDisplay';
import { useTheme } from '@src/hooks/useTheme';
import { FormikProps } from 'formik';
import { CreateRecipeFormValues } from '@src/screens/CreateRecipe';
import { NutrientsDtoType } from '@shared/types/dto/Nutrients.entity';
import { EasyCook } from 'easy-cook';
import { AllMassTypes, AllVolumeTypes } from 'easy-cook/dist/convert';
import { DataHelper } from '@src/util/DataHelper';
import { CustomUnitDtoType } from '@shared/types/dto/Food.entity';
import { AppTextInput } from '@src/components/form/AppTextInput';

type CreateRecipeNutritionProps = {
  formik: FormikProps<CreateRecipeFormValues>;
};

const CreateRecipeNutritionComponent = ({
  formik,
}: CreateRecipeNutritionProps) => {
  const theme = useTheme();

  const nutrients: NutrientsDtoType = useMemo(() => {
    const ingredients = formik.values.ingredients;

    const recipeNutrients = { ...DataHelper.ZEROED_NUTRIENTS };

    if (ingredients && ingredients.length > 0) {
      for (const ingredient of ingredients) {
        if (!ingredient.food) {
          continue;
        }

        const nutrients = ingredient.food.nutrients;

        const unit = ingredient.unit;
        const density = ingredient.food.density;
        const conversionUnit = ingredient.food.servingSizeMetricUnit;
        const qtyUnit = ingredient.quantity;

        const unitType = EasyCook.getUnitMeasuringType(unit);

        let customUnit: CustomUnitDtoType | undefined;
        if (unitType === 'unknown') {
          customUnit = ingredient.food.supportedUnits.find<CustomUnitDtoType>(
            (custom): custom is CustomUnitDtoType =>
              typeof custom !== 'string' && custom.unit === unit,
          );
        }

        Object.entries(nutrients).forEach(([k, nutrientValueGOrMl]) => {
          const key = k as keyof typeof nutrients;

          let qtyGOrMl = 0;

          if (conversionUnit === 'g' && unitType === 'mass') {
            qtyGOrMl = EasyCook.convert(qtyUnit, unit as AllMassTypes).to('g');
          } else if (conversionUnit === 'mL' && unitType === 'volume') {
            qtyGOrMl = EasyCook.convert(qtyUnit, unit as AllVolumeTypes).to(
              'mL',
            );
          } else if (
            conversionUnit === 'g' &&
            unitType === 'volume' &&
            density
          ) {
            qtyGOrMl = EasyCook.convert(qtyUnit, unit as AllVolumeTypes)
              .withDensity(density, 'g', 1, 'mL')
              .to('g');
          } else if (
            conversionUnit === 'mL' &&
            unitType === 'mass' &&
            density
          ) {
            qtyGOrMl = EasyCook.convert(qtyUnit, unit as AllMassTypes)
              .withDensity(density, 'g', 1, 'mL')
              .to('g');
          } else if (unitType === 'unknown') {
            if (!customUnit) return;
            qtyGOrMl =
              (qtyUnit / customUnit.quantity) *
              customUnit.metricQuantityPerUnit;
          }

          recipeNutrients[key] +=
            (nutrientValueGOrMl === null ? 0 : nutrientValueGOrMl) * qtyGOrMl;
        });
      }
    }

    return recipeNutrients;
  }, [formik.values.ingredients]);

  return (
    <>
      <Columns style={[{ paddingHorizontal: theme.screenMargin }]}>
        <NumericInput
          formik={formik}
          name="servingsPerRecipe"
          label="Servings per recipe"
        />
        <View />
      </Columns>

      <Columns
        style={[
          { paddingHorizontal: theme.screenMargin },
          styles.servingInputContainer,
        ]}
      >
        <NumericInput
          formik={formik}
          name="servingSizeQuantity"
          label="Serving quantity"
        />
        <AppTextInput
          dense
          formik={formik}
          autoCapitalize="none"
          name="servingSizeUnit"
          label="Serving unit"
          placeholder='"cookies", "slices"'
        />
      </Columns>

      <NutritionDisplay
        servings={Number.parseInt(formik.values.servingsPerRecipe)}
        nutrients={nutrients}
        style={{ marginHorizontal: theme.screenMargin }}
      />
    </>
  );
};

export const CreateRecipeNutrition = React.memo(CreateRecipeNutritionComponent);

const styles = StyleSheet.create({
  servingInputContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
});

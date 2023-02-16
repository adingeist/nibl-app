import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Nutrients } from 'easy-cook';

import { AppDivider } from '@src/components/AppDivider';
import { NutrientsDtoType } from '@shared/types/dto/Nutrients.entity';
import { NutrientText } from '@src/components/NutrientText';

type ExtraNutrientsProps = {
  nutrients: NutrientsDtoType;
  servings?: number;
};

type ItemProps = {
  grams: number;
  label: Nutrients;
  servings?: number;
};

export const Item = ({ label, grams, servings }: ItemProps) => (
  <View style={styles.item}>
    <NutrientText
      doNotShow0
      showPercentDV
      label={label}
      grams={grams}
      nutrient={label}
      servings={servings}
    />
  </View>
);

const ExtraNutrientsComponent = ({
  nutrients,
  servings,
}: ExtraNutrientsProps) => {
  if (
    !nutrients.calcium &&
    !nutrients.iron &&
    !nutrients.vitaminD &&
    !nutrients.potassium &&
    !nutrients.vitaminA &&
    !nutrients.vitaminC &&
    !nutrients.vitaminK &&
    !nutrients.thiamin &&
    !nutrients.riboflavin &&
    !nutrients.niacin &&
    !nutrients.vitaminB6 &&
    !nutrients.folicAcid &&
    !nutrients.vitaminB12 &&
    !nutrients.pantothenicAcid &&
    !nutrients.phosphorus &&
    !nutrients.iodine &&
    !nutrients.magnesium &&
    !nutrients.zinc &&
    !nutrients.selenium &&
    !nutrients.copper &&
    !nutrients.manganese &&
    !nutrients.chromium &&
    !nutrients.molybdenum &&
    !nutrients.chloride &&
    !nutrients.caffeine
  )
    return null;

  return (
    <>
      <AppDivider />

      <View style={styles.container}>
        <Item servings={servings} label="Calcium" grams={nutrients.calcium} />
        <Item servings={servings} label="Iron" grams={nutrients.iron} />
        <Item
          servings={servings}
          label="Vitamin D"
          grams={nutrients.vitaminD}
        />
        <Item
          servings={servings}
          label="Potassium"
          grams={nutrients.potassium}
        />
        <Item
          servings={servings}
          label="Vitamin A"
          grams={nutrients.vitaminA}
        />
        <Item
          servings={servings}
          label="Vitamin C"
          grams={nutrients.vitaminC}
        />
        <Item
          servings={servings}
          label="Vitamin K"
          grams={nutrients.vitaminK}
        />
        <Item servings={servings} label="Thiamin" grams={nutrients.thiamin} />
        <Item
          servings={servings}
          label="Riboflavin"
          grams={nutrients.riboflavin}
        />
        <Item servings={servings} label="Niacin" grams={nutrients.niacin} />
        <Item
          servings={servings}
          label="Vitamin B6"
          grams={nutrients.vitaminB6}
        />
        <Item
          servings={servings}
          label="Folic Acid"
          grams={nutrients.folicAcid}
        />
        <Item
          servings={servings}
          label="Vitamin B12"
          grams={nutrients.vitaminB12}
        />
        <Item
          servings={servings}
          label="Pantothenic Acid"
          grams={nutrients.pantothenicAcid}
        />
        <Item
          servings={servings}
          label="Phosphorus"
          grams={nutrients.phosphorus}
        />
        <Item servings={servings} label="Iodine" grams={nutrients.iodine} />
        <Item
          servings={servings}
          label="Magnesium"
          grams={nutrients.magnesium}
        />
        <Item servings={servings} label="Zinc" grams={nutrients.zinc} />
        <Item servings={servings} label="Selenium" grams={nutrients.selenium} />
        <Item servings={servings} label="Copper" grams={nutrients.copper} />
        <Item
          servings={servings}
          label="Manganese"
          grams={nutrients.manganese}
        />
        <Item servings={servings} label="Chromium" grams={nutrients.chromium} />
        <Item
          servings={servings}
          label="Molybdenum"
          grams={nutrients.molybdenum}
        />
        <Item servings={servings} label="Chloride" grams={nutrients.chloride} />
        <Item servings={servings} label="Caffeine" grams={nutrients.caffeine} />
      </View>
    </>
  );
};

export const ExtraNutrients = React.memo(ExtraNutrientsComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'space-between',
  },

  item: {
    width: '47%',
    flexDirection: 'row',
    paddingHorizontal: 6,
  },

  percent: {
    marginLeft: 'auto',
  },

  nutrientText: {
    flex: 1,
  },
});

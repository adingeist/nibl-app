import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ExtraNutrients } from '@src/components/ExtraNutrients';
import { NutrientsDtoType } from '@shared/types/dto/Nutrients.entity';
import { NutrientText as Item } from '@src/components/NutrientText';
import { NutritionPie } from '@src/components/NutritionPie';

type NutritionDisplayProps = {
  nutrients: NutrientsDtoType;
  style?: StyleProp<ViewStyle>;
  servings?: number;
};

const NutritionDisplayComponent = ({
  style,
  nutrients,
  servings = 1,
}: NutritionDisplayProps) => {
  return (
    <View style={style}>
      <View style={styles.topContainer}>
        <View style={styles.mainNutrients}>
          <Item
            servings={servings}
            bold
            nutrient="Calories"
            grams={nutrients.calories}
          />
          <Item
            servings={servings}
            bold
            label="Total Fat"
            nutrient="Fat"
            grams={nutrients.totalFat}
          />
          <View style={styles.indentation}>
            <Item
              servings={servings}
              nutrient="Saturated Fat"
              grams={nutrients.saturatedFat}
            />
            <Item
              servings={servings}
              nutrient="Trans Fat"
              grams={nutrients.transFat}
            />
            <Item
              servings={servings}
              doNotShow0
              nutrient="Monounsaturated Fat"
              grams={nutrients.monounsaturatedFat}
            />
            <Item
              servings={servings}
              doNotShow0
              nutrient="Polyunsaturated Fat"
              grams={nutrients.polyunsaturatedFat}
            />
          </View>
          <Item
            servings={servings}
            bold
            nutrient="Cholesterol"
            grams={nutrients.cholesterol}
          />
          <Item
            servings={servings}
            bold
            nutrient="Sodium"
            grams={nutrients.sodium}
          />
          <Item
            servings={servings}
            bold
            nutrient="Total Carbohydrates"
            grams={nutrients.totalCarbohydrates}
          />
          <View style={styles.indentation}>
            <Item
              servings={servings}
              nutrient="Dietary Fiber"
              grams={nutrients.dietaryFiber}
            />
            <Item
              servings={servings}
              nutrient="Total Sugars"
              grams={nutrients.sugars}
            />
            <Item
              servings={servings}
              doNotShow0
              nutrient="Added Sugars"
              grams={nutrients.addedSugars}
            />
            <Item
              servings={servings}
              doNotShow0
              nutrient="Sugar Alcohols"
              grams={nutrients.sugarAlcohol}
            />
          </View>
          <Item
            servings={servings}
            bold
            nutrient="Protein"
            grams={nutrients.protein}
          />
        </View>

        <NutritionPie
          fat={nutrients.totalFat}
          carbs={nutrients.totalCarbohydrates}
          protein={nutrients.protein}
        />
      </View>

      <ExtraNutrients servings={servings} nutrients={nutrients} />
    </View>
  );
};

export const NutritionDisplay = React.memo(NutritionDisplayComponent);

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
  },

  indentation: {
    marginLeft: 10,
  },

  mainNutrients: {
    width: '50%',
    alignSelf: 'center',
  },
});

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { EasyCook, Nutrients } from 'easy-cook';

type NutrientTextProps = {
  label?: string;
  bold?: boolean;
  doNotShow0?: boolean;
  unit?: string;
  grams: number | null;
  nutrient: Nutrients;
  showPercentDV?: boolean;
  servings?: number;
};

const NutrientTextComponent = ({
  label,
  bold,
  grams,
  nutrient,
  servings = 1,
  doNotShow0,
  showPercentDV,
  unit: unitOverride,
}: NutrientTextProps) => {
  const roundFloatTo = (num: number, decimalPlaces: number) => {
    if (Number.isInteger(num)) return num;
    return num.toFixed(decimalPlaces);
  };

  const qty = useMemo(() => {
    const qtyPerServing = (grams ? grams : 0) / (servings ? servings : 1);
    const labelUnitQty = Math.floor(
      EasyCook.change(qtyPerServing || 0)
        .grams(nutrient)
        .toLabelUnit(),
    );

    return roundFloatTo(labelUnitQty, 1);
  }, [grams, nutrient, servings]);

  const unit = useMemo(() => EasyCook.getLabelUnit(nutrient), [nutrient]);

  const percentDV = useMemo(
    () =>
      Math.floor(
        EasyCook.change(grams ? grams : 0)
          .grams(nutrient)
          .toPercentDV(),
      ),
    [grams, nutrient],
  );

  if (doNotShow0 && qty === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        style={[{ marginTop: bold ? 3 : 1 }, styles.nutrientAndQty]}
        variant="bodyMedium"
      >
        <Text style={{ fontWeight: bold ? 'bold' : 'normal' }}>{`${
          label || nutrient
        } `}</Text>
        {qty}
        {unitOverride !== undefined ? unitOverride : unit}
      </Text>
      {showPercentDV && (
        <Text variant="bodyMedium" style={styles.percent}>
          {percentDV}%
        </Text>
      )}
    </View>
  );
};

export const NutrientText = React.memo(NutrientTextComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },

  nutrientAndQty: {
    flex: 1,
  },

  percent: {
    marginLeft: 'auto',
  },
});

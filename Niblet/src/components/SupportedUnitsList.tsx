import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { SupportedUnitIcon } from '@src/components/SupportedUnitIcon';
import { FoodDtoType } from '@shared/types/dto/Food.entity';
import { CustomUnitDtoType } from '@shared/types/dto/Nutrition.entity';
import { EasyCook } from 'easy-cook';

type SupportedUnitsListProps = {
  servingSizeMetricUnit: 'g' | 'mL';
  supportedUnits?: FoodDtoType['nutrition']['supportedUnits'];
};

export const SupportedUnitsList = ({
  servingSizeMetricUnit,
  supportedUnits,
}: SupportedUnitsListProps) => {
  const {
    weightSupported,
    volumeSupported,
    customUnits,
  }: {
    weightSupported: boolean;
    volumeSupported: boolean;
    customUnits: CustomUnitDtoType[];
  } = useMemo(() => {
    let weightSupported = false;
    let volumeSupported = false;
    const customUnits: CustomUnitDtoType[] = [];

    if (!supportedUnits)
      return { weightSupported, volumeSupported, customUnits };

    supportedUnits.forEach((unit) => {
      if (typeof unit !== 'string') {
        customUnits.push(unit);
      } else if (EasyCook.getUnitMeasuringType(unit) === 'mass') {
        weightSupported = true;
      } else {
        volumeSupported = true;
      }
    });

    return { weightSupported, volumeSupported, customUnits };
  }, [supportedUnits]);

  return (
    <View style={styles.supportedUnitsContainer}>
      <SupportedUnitIcon.Weight isSupported={weightSupported} />
      <SupportedUnitIcon.Volume isSupported={volumeSupported} />
      {customUnits.map((unit) => (
        <SupportedUnitIcon.Custom
          isSupported={true}
          key={unit.unit}
          quantity={unit.quantity}
          label={unit.unit}
          metricEquivalence={{
            quantity: unit.metricQuantityPerUnit,
            unit: servingSizeMetricUnit,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  supportedUnitsContainer: {
    flexDirection: 'row',
    marginBottom: 14,
  },
});

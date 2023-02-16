import React, { useMemo } from 'react';
import { VictoryLabel, VictoryPie } from 'victory-native';

import { useTheme } from '@src/hooks/useTheme';

type NutritionPieProps = {
  fat: number;
  carbs: number;
  protein: number;
};

const NutritionPieComponent = ({ carbs, fat, protein }: NutritionPieProps) => {
  const { colors, typescale } = useTheme();

  const total = useMemo(() => carbs + fat + protein, [carbs, fat, protein]);

  const height = useMemo(
    () => (carbs || fat || protein ? 350 : 1),
    [carbs, fat, protein]
  );

  return (
    <VictoryPie
      animate
      startAngle={180}
      endAngle={360}
      height={height}
      innerRadius={60}
      labelRadius={140}
      labels={(data) => {
        const categories = ['Protein', 'Carbs', 'Fat'];
        const index = data.slice.index;
        const percent = Math.round((data.slice.value / total) * 100);
        if (!percent || percent < 20) return '';
        return [categories[index], `${percent}%`];
      }}
      data={[protein, carbs, fat]}
      labelComponent={
        <VictoryLabel
          style={[
            { ...typescale.bodySmall },
            { ...typescale.bodySmall, fill: colors.dark },
          ]}
        />
      }
      colorScale={[colors.protein, colors.carbs, colors.fat]}
      style={{
        labels: { ...typescale.bodySmall, textAlign: 'center' },
      }}
    />
  );
};

export const NutritionPie = React.memo(NutritionPieComponent);

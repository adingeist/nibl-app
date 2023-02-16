import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Bold } from '@src/components/Bold';
import { foodApi } from '@src/api/food';
import { FoodDtoType } from '@shared/types/dto/Food.entity';
import { Headline } from '@src/components/Headline';
import { ImageOrNotFound } from '@src/components/ImageOrNotFound';
import { MainAppScreenProps } from '@src/types/navigation';
import { NutritionDisplay } from '@src/components/NutritionDisplay';
import { Screen } from '@src/components/Screen';
import { ScrollView } from 'react-native-gesture-handler';
import { SupportedUnitsList } from '@src/components/SupportedUnitsList';
import { useApi } from '@src/hooks/useApi';

export const FoodDetailsScreen = ({
  route,
  navigation,
}: MainAppScreenProps<'FoodDetails'>) => {
  const getFoodApi = useApi(foodApi.getFood);
  const [food, setFood] = useState<FoodDtoType>();

  const editFood = useCallback(() => {
    navigation.navigate('UploadNavigator', { screen: 'CreateIngredient' });
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: food?.name || route.params.foodName || 'Food',
    });
  }, [editFood, food?.name, navigation, route.params.foodName]);

  useEffect(() => {
    const getFood = async () => {
      const res = await getFoodApi.request({
        params: { id: route.params.foodId },
      });

      if (res.ok) {
        setFood(res.data);
      }
    };

    getFood();
  }, []);

  if (!food) {
    return null;
  }

  return (
    <ScrollView>
      <Screen addPadding>
        <View style={styles.detailsContainer}>
          <View>
            <Text variant="headlineLarge">{food.name}</Text>
            <Text variant="bodyMedium">{route.params.brandName}</Text>
          </View>

          <ImageOrNotFound width={100} height={100} imageUri={food.image} />
        </View>

        <Headline>Nutrition</Headline>
        <Text variant="bodyMedium">
          <Bold>Serving size</Bold> {food.servingSizeQuantity}{' '}
          {food.servingSizeUnit} ({food.servingSizeMetricQuantity}
          {food.servingSizeMetricUnit})
        </Text>
        <NutritionDisplay
          servings={1 / food.servingSizeMetricQuantity}
          nutrients={food.nutrients}
        />

        <Headline>Supported Units</Headline>
        <SupportedUnitsList
          supportedUnits={food.supportedUnits}
          servingSizeMetricUnit={food.servingSizeMetricUnit}
        />
      </Screen>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  supportedUnitsContainer: {
    flexDirection: 'row',
    marginBottom: 14,
  },
});

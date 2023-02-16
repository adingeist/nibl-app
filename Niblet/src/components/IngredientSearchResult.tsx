import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FoodDtoType } from '@shared/types/dto/Food.entity';
import { Bold } from '@src/components/Bold';
import { useTheme } from '@src/hooks/useTheme';
import React, { useCallback } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface IngredientSearchResultProps {
  food: FoodDtoType;
  onPress?: (food: FoodDtoType) => void;
}

const IngredientSearchResultComponent = ({
  food,
  onPress,
}: IngredientSearchResultProps) => {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(food);
    }
  }, [food, onPress]);

  return (
    <View style={[styles.border, { borderBottomColor: theme.colors.light }]}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.container, { paddingHorizontal: theme.screenMargin }]}
      >
        <View
          style={[
            styles.imageContainer,
            {
              borderRadius: theme.roundness,
              backgroundColor: theme.colors.light,
            },
          ]}
        >
          {(food.image && (
            <Image style={styles.image} source={{ uri: food.image }} />
          )) || (
            <MaterialCommunityIcons
              name="image"
              size={20}
              color={theme.colors.background}
            />
          )}
        </View>

        <View>
          <Bold variant="bodyMedium">{food.name}</Bold>
          <Text style={styles.brandText}>{food.brand?.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const IngredientSearchResult = React.memo(
  IngredientSearchResultComponent,
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 75,
    alignItems: 'center',
  },

  border: {
    borderBottomWidth: 2,
  },

  image: {
    width: 40,
    height: 40,
  },

  imageContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },

  brandText: {
    marginLeft: 10,
    fontStyle: 'italic',
  },
});

import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Text } from 'react-native-paper';

import { Bold } from '@src/components/Bold';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@src/hooks/useTheme';

type IngredientListingProps = {
  quantity?: number;
  foodName: string;
  unit?: string;
  note?: string;
  brand?: string;
  onPress?: (e: GestureResponderEvent) => void;
  imageUri?: string | null;
  style?: StyleProp<ViewStyle>;
};

export const IngredientListing = ({
  foodName,
  brand,
  note,
  quantity,
  unit,
  onPress,
  imageUri,
  style,
}: IngredientListingProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.screenMargin,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons style={styles.icon} name="square" size={10} />
      <TouchableOpacity disabled={!onPress} onPress={onPress}>
        <Text variant="bodyMedium">
          {quantity && unit && <Text>{`${quantity} ${unit} `}</Text>}
          <Bold>{`${foodName}`}</Bold>
          {note && <Text>{`, ${note}`}</Text>}
        </Text>
        {brand && (
          <Text style={styles.brandText} variant="bodySmall">{`${brand}`}</Text>
        )}
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },

  image: {
    width: 25,
    height: 25,
    marginLeft: 'auto',
  },

  brandText: {
    marginLeft: 10,
    fontStyle: 'italic',
  },

  icon: {
    marginLeft: 2,
    marginRight: 14,
  },
});

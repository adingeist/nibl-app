import React, { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { useTheme } from '@src/hooks/useTheme';
import { TouchableOpacity } from 'react-native-gesture-handler';

type SupportedUnitIconProps = {
  label: string;
  quantity?: number;
  iconName?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  isSupported: boolean;
  metricEquivalence?: { unit: 'g' | 'mL'; quantity: number };
};

const Custom = ({
  isSupported,
  iconName,
  label,
  quantity,
  metricEquivalence,
}: SupportedUnitIconProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: theme.roundness,
          backgroundColor: theme.colors.light,
          opacity: isSupported ? 1 : 0.2,
        },
      ]}
    >
      {iconName && <MaterialCommunityIcons size={20} name={iconName} />}
      <Text adjustsFontSizeToFit style={styles.text} variant="bodySmall">
        {quantity ? `${quantity} ` : ''}
        {label}
      </Text>
      {metricEquivalence && (
        <Text variant="bodySmall">{`(${metricEquivalence.quantity}${metricEquivalence.unit})`}</Text>
      )}
    </View>
  );
};

type VolumeAndWeightProps = {
  isSupported: boolean;
};

const Weight = ({ isSupported }: VolumeAndWeightProps) => {
  return <Custom isSupported={isSupported} label="Weight" iconName="scale" />;
};

const Volume = ({ isSupported }: VolumeAndWeightProps) => {
  return <Custom isSupported={isSupported} label="Volume" iconName="beer" />;
};

type AddProps = {
  onPress: () => void;
};

const Add = ({ onPress }: AddProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.roundness,
        },
      ]}
    >
      <MaterialCommunityIcons
        color={theme.colors.background}
        size={20}
        name="plus"
      />
    </TouchableOpacity>
  );
};

export const SupportedUnitIcon = {
  Volume,
  Weight,
  Custom,
  Add,
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    overflow: 'hidden',
  },

  text: {
    textAlign: 'center',
  },
});

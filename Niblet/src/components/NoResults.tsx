import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@src/hooks/useTheme';

type NoResultsComponentProps = {
  children: React.ReactNode;
};

const NoResultsComponent = ({ children }: NoResultsComponentProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.noResultsContainer}>
      <MaterialCommunityIcons
        name="emoticon-confused-outline"
        size={50}
        color={colors.medium}
      />
      <Text
        style={[{ color: colors.medium }, styles.noResultsText]}
        variant="bodyMedium"
      >
        {children}
      </Text>
    </View>
  );
};

export const NoResults = React.memo(NoResultsComponent);

const styles = StyleSheet.create({
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },

  noResultsText: {
    fontWeight: 'bold',
  },
});

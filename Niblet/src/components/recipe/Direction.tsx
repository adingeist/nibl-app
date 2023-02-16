import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTheme } from '@src/hooks/useTheme';

type DirectionProps = {
  index: number;
  body: string;
};

const DirectionComponent = ({ body, index }: DirectionProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.stepNumberText, { paddingLeft: theme.screenMargin }]}
        variant="titleLarge"
      >
        {index + 1}
      </Text>
      <Text
        variant="bodyMedium"
        style={[
          theme.typescale.bodyMedium,
          styles.text,
          { paddingRight: theme.screenMargin },
        ]}
      >
        {body}
      </Text>
    </View>
  );
};

export const Direction = React.memo(DirectionComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
  },

  text: {
    alignSelf: 'center',
    paddingTop: 0,
    marginVertical: 10,
    flex: 1,
  },

  stepNumberText: {
    marginTop: 6,
    paddingRight: 15,
  },
});

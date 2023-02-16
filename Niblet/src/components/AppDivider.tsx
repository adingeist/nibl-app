import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

const AppDividerComponent = () => {
  return <Divider style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    marginTop: 10,
    marginBottom: 4,
    height: 2,
  },
});

export const AppDivider = React.memo(AppDividerComponent);

import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Displays the app's logo with consistent styling

export default function LogoTitle(): JSX.Element {
  return (
    <Image
      style={styles.image}
      source={require('@src/assets/niblet-logo.png')}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 33,
    height: 33,
  },
});

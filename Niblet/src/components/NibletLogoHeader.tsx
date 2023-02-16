import { StyleSheet, Image } from 'react-native';
import React from 'react';

export const NibletLogoHeader = () => {
  return (
    <>
      <Image
        style={styles.niblet}
        source={require('@src/assets/niblet-text-logo-orange.png')}
      />
      <Image
        style={styles.logo}
        source={require('@src/assets/niblet-logo.png')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  logo: { height: 40, resizeMode: 'contain' },
  niblet: { marginVertical: 10, height: 50, resizeMode: 'contain' },
});

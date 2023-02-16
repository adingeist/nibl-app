import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppActivityIndicator } from '@src/components/AppActivityIndicator';

type LoadingOverlayProps = { isVisible: boolean };

export const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View
      style={[styles.overlay, { backgroundColor: 'rgba(255,255,255,0.5)' }]}
    >
      <AppActivityIndicator size={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  animation: {
    height: 50,
  },
  overlay: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
});

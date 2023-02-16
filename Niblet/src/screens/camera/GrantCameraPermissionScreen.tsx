import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

import { Screen } from '@src/components/Screen';
import { CameraIcons } from '@src/components/camera/CameraIcons';

export const GrantCameraPermissionScreen = () => {
  return (
    <Screen style={styles.screen}>
      <CameraIcons name="close" />
      <MaterialCommunityIcons
        name="camera-off-outline"
        size={50}
        color="#fff"
      />
      <Text style={styles.title} variant="headlineLarge">
        Grant camera permission
      </Text>
      <Text style={styles.subTitle} variant="bodyLarge">
        {Platform.OS === 'ios'
          ? `Navigate to your phones settings:\nSettings > Privacy > Camera > Niblet`
          : `Navigate to your phones settings:\nSettings > Apps > Niblet`}
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    textAlign: 'center',
  },

  subTitle: {
    color: '#ddd',
    textAlign: 'center',
  },
});

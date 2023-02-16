import React from 'react';
import { Share, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

import {
  ACTION_STYLES,
  ICON_SIZE,
} from '@src/components/post/actions/ActionsConstants';

export const ShareAction = () => {
  const handlePress = async () => {
    try {
      await Share.share({
        message: 'Check out Niblet.',
      });
    } catch (error) {
      console.error('Failed to share.');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={ACTION_STYLES.container}>
      <MaterialCommunityIcons name={'share'} size={ICON_SIZE} color={'#fff'} />
      <Text style={ACTION_STYLES.text}>Share</Text>
    </TouchableOpacity>
  );
};

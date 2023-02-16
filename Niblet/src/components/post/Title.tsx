import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePostContext } from '@src/components/post/PostContext';
import { useNavigation } from '@react-navigation/native';
import { MainAppNavigationProp } from '@src/types/navigation';

export const Title = () => {
  const post = usePostContext();
  const navigation = useNavigation<MainAppNavigationProp>();

  const openRecipe = () => {
    navigation.navigate('Recipe', { id: post.id });
  };

  return (
    <TouchableOpacity onPress={openRecipe} style={styles.container}>
      <Text
        style={[
          {
            color: '#fff',
          },
          styles.text,
        ]}
        numberOfLines={2}
      >
        {post.title}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={'#fff'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 21,
    paddingRight: 2,
    textAlign: 'right',
    top: 2,
  },
});

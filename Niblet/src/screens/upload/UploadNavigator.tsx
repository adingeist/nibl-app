import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { UploadNavigatorParamList } from '@src/types/navigation';

import { CreateRecipe } from '@src/screens/CreateRecipe';
import { useDefaultHeaders } from '@src/theme/headers';
import { VideoEditorScreen } from '@src/screens/camera/VideoEditorScreen';
import { CreateIngredientScreen } from '@src/screens/upload/CreateIngredientScreen';
import { CreateNibScreen } from '@src/screens/upload/CreateNibScreen';

const Stack = createStackNavigator<UploadNavigatorParamList>();

export const UploadNavigator = () => {
  const headers = useDefaultHeaders();

  return (
    <Stack.Navigator
      screenOptions={headers.stackHeaderOptions}
      initialRouteName={'VideoEditor'}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="VideoEditor"
        component={VideoEditorScreen}
      />
      <Stack.Screen
        name="CreateRecipe"
        options={{ title: 'Create Recipe' }}
        component={CreateRecipe}
      />
      <Stack.Screen
        name="CreateIngredient"
        options={{ title: 'Create Ingredient' }}
        component={CreateIngredientScreen}
      />
      <Stack.Screen
        name="CreateNib"
        options={{ title: 'Nib Recipe' }}
        component={CreateNibScreen}
      />
    </Stack.Navigator>
  );
};

/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { ComponentProps, useState } from 'react';
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@src/hooks/useTheme';
import { useKeyboard } from '@src/hooks/useKeyboard';

type CollapsibleProps = {
  children: React.ReactNode;
  headerComponent: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
} & ComponentProps<typeof Collapsible>;

export const AppCollapsible = ({
  children,
  headerComponent,
  containerStyle,
  collapsed = false,
  ...props
}: CollapsibleProps) => {
  const [open, setOpen] = useState(collapsed);
  const { colors } = useTheme();
  const keyboard = useKeyboard();

  const handlePress = () => {
    if (keyboard.isShown.current) {
      Keyboard.dismiss();
    } else {
      setOpen((state) => !state);
    }
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={handlePress} style={styles.header}>
        {headerComponent}
        <MaterialCommunityIcons
          style={styles.icon}
          name={open ? 'chevron-up' : 'chevron-down'}
          size={30}
          color={colors.dark}
        />
      </TouchableOpacity>
      {/** @ts-ignore - children property not recognized */}
      <Collapsible {...props} collapsed={open}>
        {children}
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginLeft: 'auto',
  },
});

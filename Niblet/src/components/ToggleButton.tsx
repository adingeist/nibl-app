import React, { ComponentProps } from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

interface ToggleButtonProps
  extends Omit<ComponentProps<typeof Button>, 'children'> {
  /** Indicates whether the button should show toggled styles */
  isToggled: boolean;
  /** Text shown when toggled */
  toggledLabel?: string;
  /** Text shown when **not** toggled */
  notToggledLabel?: string;
  /** Overrides the "style" prop when toggled  */
  toggledStyle?: StyleProp<ViewStyle>;
  /** Overrides the "labelStyle" prop when toggled  */
  toggledLabelStyle?: StyleProp<TextStyle>;
  /** Overrides the "style" prop when **not** toggled  */
  notToggledStyle?: StyleProp<ViewStyle>;
  /** Overrides the "labelStyle" prop when **not** toggled  */
  notToggledLabelStyle?: StyleProp<TextStyle>;
}

export const ToggleButton = ({
  style,
  labelStyle,
  isToggled,
  toggledStyle,
  toggledLabelStyle,
  notToggledStyle,
  notToggledLabelStyle,
  toggledLabel,
  notToggledLabel,
  ...props
}: ToggleButtonProps) => {
  return (
    <Button
      style={[styles.button, style, isToggled ? toggledStyle : notToggledStyle]}
      labelStyle={[
        styles.label,
        labelStyle,
        isToggled ? toggledLabelStyle : notToggledLabelStyle,
      ]}
      {...props}
    >
      {isToggled ? toggledLabel : notToggledLabel}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
});

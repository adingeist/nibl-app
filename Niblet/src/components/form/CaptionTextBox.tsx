import { AppTextInput } from '@src/components/form/AppTextInput';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

export const CaptionTextBox = (props: ComponentProps<typeof AppTextInput>) => {
  return (
    <AppTextInput
      style={styles.caption}
      maxLength={300}
      multiline
      label="Caption"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  caption: {
    height: 80,
  },
});

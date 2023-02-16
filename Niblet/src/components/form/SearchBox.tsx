import React, { ComponentProps, ForwardedRef, forwardRef } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { TextInput } from 'react-native-paper';

import { useTheme } from '@src/hooks/useTheme';

const SearchBoxComponent = (
  { style, ...props }: ComponentProps<typeof TextInput>,
  ref: ForwardedRef<RNTextInput>
) => {
  const theme = useTheme();

  return (
    <TextInput
      ref={ref}
      placeholder="Search"
      mode="flat"
      style={[
        {
          backgroundColor: theme.colors.background,
          ...theme.typescale.bodyMedium,
        },
        style,
      ]}
      right={<TextInput.Icon name="magnify" />}
      {...props}
    />
  );
};

export const SearchBox = forwardRef(SearchBoxComponent);

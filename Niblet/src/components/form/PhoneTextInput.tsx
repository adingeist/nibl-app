import React, { ForwardedRef } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { AppTextInput } from '@src/components/form/AppTextInput';

type PhoneTextInputComponentProps = React.ComponentProps<typeof AppTextInput>;

const PhoneTextInputComponent = (
  { name, ...appTextInputProps }: PhoneTextInputComponentProps,
  ref: ForwardedRef<RNTextInput>
) => {
  return (
    <View>
      <AppTextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        inputModifier="phone"
        label="Phone"
        left={<TextInput.Icon name="phone" />}
        name={name}
        returnKeyType="next"
        textContentType="telephoneNumber"
        {...appTextInputProps}
        ref={ref}
      />
    </View>
  );
};

export const PhoneTextInput = React.forwardRef(PhoneTextInputComponent);

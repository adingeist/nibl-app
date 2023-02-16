import React from 'react';
import { AppTextInput } from '@src/components/form/AppTextInput';
import { PhoneTextInput } from '@src/components/form/PhoneTextInput';
import { TextInput, useTheme } from 'react-native-paper';
import { StyleProp, View, ViewStyle } from 'react-native';
import { FormikProps } from 'formik';

type EmailOrPhoneInputProps = {
  emailInputProps: Omit<React.ComponentProps<typeof AppTextInput>, 'formik'>;
  phoneInputProps: Omit<React.ComponentProps<typeof PhoneTextInput>, 'formik'>;
  isEmailInput: boolean;
  formik: FormikProps<any>;
  onToggleInputType: () => void;
  style?: StyleProp<ViewStyle>;
};

export const EmailOrPhoneInput = ({
  emailInputProps,
  formik,
  isEmailInput,
  phoneInputProps,
  style,
  onToggleInputType,
}: EmailOrPhoneInputProps) => {
  const theme = useTheme();

  return (
    <View style={style}>
      {(isEmailInput && (
        <AppTextInput
          formik={formik}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          label="Email"
          inputModifier="email"
          left={<TextInput.Icon name="email" />}
          right={
            <TextInput.Icon
              name="phone"
              size={16}
              onPress={onToggleInputType}
              style={{ backgroundColor: theme.colors.light }}
            />
          }
          returnKeyType="next"
          textContentType="emailAddress"
          {...emailInputProps}
        />
      )) || (
        <PhoneTextInput
          formik={formik}
          right={
            <TextInput.Icon
              name="email"
              size={16}
              onPress={onToggleInputType}
              style={{ backgroundColor: theme.colors.light }}
            />
          }
          {...phoneInputProps}
        />
      )}
    </View>
  );
};

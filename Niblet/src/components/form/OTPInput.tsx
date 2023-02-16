import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useTheme } from 'react-native-paper';
import { useFormikContext } from 'formik';
import AppErrorMessage from '@src/components/form/AppErrorMessage';

type OTPInputProps = { name: string; pinCount?: number } & Omit<
  React.ComponentProps<typeof OTPInputView>,
  'pinCount'
>;

export const OTPInput = ({ name, ...OTPInputViewProps }: OTPInputProps) => {
  const theme = useTheme();
  const formik = useFormikContext<Record<string, string>>();

  const hasError =
    formik.errors[name] !== undefined && formik.errors[name] !== '';

  const codeInputFieldStyle = [
    styles.underlineStyleBase,
    {
      borderColor: hasError ? theme.colors.error : theme.colors.medium,
      color: hasError ? theme.colors.error : theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
  ] as TextStyle;

  const codeInputHighlightStyle = [
    styles.underlineStyleHighLighted,
    {
      borderColor: hasError ? theme.colors.error : theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
  ] as TextStyle;

  return (
    <>
      <OTPInputView
        style={styles.otpContainer}
        pinCount={6}
        code={formik.values[name]}
        onCodeChanged={(code) => {
          formik.setFieldValue(name, code);
        }}
        codeInputFieldStyle={codeInputFieldStyle}
        selectionColor={'transparent'}
        codeInputHighlightStyle={codeInputHighlightStyle}
        onCodeFilled={() => formik.handleSubmit()}
        {...OTPInputViewProps}
      />
      <AppErrorMessage error={formik.errors[name]} isVisible={hasError} />
    </>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    width: '90%',
    height: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  underlineStyleBase: {
    width: 40,
    height: 40,
    borderWidth: 2,
    fontSize: 30,
  },

  underlineStyleHighLighted: {
    borderWidth: 3,
  },
});

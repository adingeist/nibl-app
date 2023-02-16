import React, { useState, ForwardedRef, useCallback, useMemo } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputContentSizeChangeEventData,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import AppErrorMessage from '@src/components/form/AppErrorMessage';
import { FormikProps } from 'formik';
import { useTheme } from '@src/hooks/useTheme';

export const fieldShouldShowError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>,
  name: string,
) => {
  return formik.errors[name] !== undefined && formik.touched[name] === true;
};

type AppTextInputProps = {
  name: string;
  suffix?: string;
  submitFormOnSubmit?: boolean;
  inputModifier?: 'username' | 'email' | 'phone';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
  ignoreErrors?: boolean;
} & React.ComponentProps<typeof TextInput>;

const AppTextInputComponent = (
  {
    mode = 'outlined',
    name,
    right,
    suffix,
    inputModifier,
    secureTextEntry,
    style,
    onFocus,
    submitFormOnSubmit,
    onBlur,
    onSubmitEditing,
    onChangeText,
    maxLength,
    formik,
    ignoreErrors,
    ...textInputProps
  }: AppTextInputProps,
  ref: ForwardedRef<RNTextInput>,
) => {
  const theme = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const [suffixLeft, setSuffixLeft] = useState(20);

  const handleTextInputFocus = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleTextInputBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    setIsFocused(false);
    formik.setFieldTouched(name, true, false); // Set touched to true without validation
    if (secureTextEntry) setIsSecure(true);

    formik.handleBlur(name);
    if (onBlur) onBlur(e);
  };

  const handleTextInputChange = (text: string) => {
    if (inputModifier === 'username') {
      text = text.toLowerCase().replace(/[^0-9a-z._]|^\.|\.(?=\.)/g, '');
    } else if (inputModifier === 'email') {
      text = text.replace(/\s/g, '');
    } else if (inputModifier === 'phone') {
      text = text.replace(/\D/g, '');
      text = text.substring(0, 11);
    }

    formik.handleChange(name)(text);
    if (onChangeText) onChangeText(text);
  };

  const toggleIsSecure = () => setIsSecure(!isSecure);

  const handleOnSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (submitFormOnSubmit) formik.handleSubmit();
    if (onSubmitEditing) onSubmitEditing(e);
  };

  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (suffix) setSuffixLeft(e.nativeEvent.contentSize.width + 20);
    },
    [suffix],
  );

  const isShowingError = useMemo(
    () => (ignoreErrors ? false : fieldShouldShowError(formik, name)),
    [formik, ignoreErrors, name],
  );

  const value = useMemo(() => formik.values[name], [formik.values, name]);

  return (
    <View>
      <TextInput
        secureTextEntry={isSecure}
        error={isShowingError}
        mode={mode}
        onBlur={handleTextInputBlur}
        onFocus={handleTextInputFocus}
        onChangeText={handleTextInputChange}
        onSubmitEditing={handleOnSubmitEditing}
        ref={ref}
        maxLength={maxLength}
        value={formik.values[name]}
        hitSlop={{ bottom: 1, top: 12 }}
        onContentSizeChange={handleContentSizeChange}
        style={[styles.input, style]}
        right={
          secureTextEntry ? (
            <TextInput.Icon
              name={isSecure ? 'eye-off' : 'eye'}
              style={{
                display: isFocused ? 'flex' : 'none',
              }}
              onPress={toggleIsSecure}
            />
          ) : (
            right
          )
        }
        {...textInputProps}
      />
      {suffix && (isFocused || formik.values[name]) && (
        <View style={styles.suffix}>
          <Text
            style={
              (styles.suffix, { left: suffixLeft, color: theme.colors.dark })
            }
          >
            {suffix}
          </Text>
        </View>
      )}
      <View style={styles.textInputFooterContainer}>
        <AppErrorMessage
          error={formik.errors[name] as string}
          isVisible={isShowingError}
        />
        {maxLength && isFocused && (
          <Text style={styles.charCounter}>
            {(value && value.length) || 0} / {maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const AppTextInputForward = React.forwardRef(AppTextInputComponent);

const arePropsSame = (
  prev: Readonly<AppTextInputProps>,
  next: Readonly<AppTextInputProps>,
) => {
  const name = prev.name;

  return (
    prev.disabled === next.disabled &&
    prev.formik.values[name] === next.formik.values[name] &&
    prev.formik.errors[name] === next.formik.errors[name] &&
    prev.formik.touched[name] === next.formik.touched[name]
  );
};

export const AppTextInput = React.memo(AppTextInputForward, arePropsSame);

const styles = StyleSheet.create({
  input: {
    marginVertical: 2,
  },

  suffix: {
    position: 'absolute',
    top: 22,
  },

  textInputFooterContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  charCounter: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
  },
});

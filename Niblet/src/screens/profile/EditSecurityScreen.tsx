import React, { createRef, useCallback } from 'react';
import { Text, TextInput } from 'react-native-paper';
import * as Yup from 'yup';
import { TextInput as RNTextInput, StyleSheet, Alert } from 'react-native';

import { AppTextInput } from '@src/components/form/AppTextInput';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { FormikSubmitHandler } from '@src/types/formik';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { MainAppScreenProps } from '@src/types/navigation';
import { Platform } from 'react-native';
import { Screen } from '@src/components/Screen';
import { useApi } from '@src/hooks/useApi';
import { useFormError } from '@src/hooks/useFormError';
import { usersApi } from '@src/api/users';
import { userYupSchema } from '@shared/schemas/user.joi';
import { useSignedInAuth } from '@src/auth/useAuthContext';
import { useTheme } from '@src/hooks/useTheme';
import { useCancelHeader } from '@src/hooks/useCancelHeader';
import { Formik, FormikProps } from 'formik';

const initialValues = { password: '', confirm: '' };

type FormValues = typeof initialValues;

export const EditSecurityScreen = ({
  navigation,
}: MainAppScreenProps<'EditSecurity'>) => {
  const theme = useTheme();
  const passwordInput = createRef<RNTextInput>();
  const confirmPasswordInput = createRef<RNTextInput>();
  const { isFormError, setFieldOrFormError } = useFormError<FormValues>();
  const resetApi = useApi(usersApi.update);
  const { user } = useSignedInAuth();
  const formRef = createRef<FormikProps<FormValues>>();

  const isFieldChanged = (field: keyof FormValues): boolean => {
    if (!formRef.current) return false;

    const values = formRef.current.values;

    return initialValues[field] !== values[field];
  };

  const isFormChanged = () => {
    if (isFieldChanged('password') || isFieldChanged('confirm')) {
      return true;
    }
    return false;
  };

  const saveChanges = useCallback(() => {
    formRef.current?.submitForm();
  }, [formRef]);

  useCancelHeader({ isFormChanged, navigation, onDone: saveChanges });

  const handleFormSubmit: FormikSubmitHandler<FormValues> = async (
    { password },
    { setFieldError }
  ) => {
    const res = await resetApi.request({
      params: { id: user.id },
      body: { password },
      attachments: {},
    });

    if (res.ok) {
      Alert.alert('Password Changed', 'Password changed successfully', [
        { text: 'Ok', onPress: () => navigation.goBack() },
      ]);
    } else {
      setFieldOrFormError(res.data, setFieldError)
        .ifErrContains('password')
        .setErrIn('password');
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={resetApi.isLoading} />
      <Screen addPadding>
        <Text
          style={[styles.title, { color: theme.colors.primary }]}
          variant="headlineMedium"
        >{`Reset password.`}</Text>

        <Formik
          validationSchema={Yup.object().shape({
            password: userYupSchema.password.required('Password is required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password')], 'Passwords must match')
              .required('Password confirmation is required'),
          })}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          innerRef={formRef}
        >
          {(formik) => (
            <>
              <FormErrorMessage
                error={resetApi.error}
                isVisible={isFormError}
              />
              <AppTextInput
                formik={formik}
                name="password"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={
                  Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                }
                label="New password"
                left={<TextInput.Icon name="lock" />}
                ref={passwordInput}
                onSubmitEditing={() => confirmPasswordInput.current?.focus()}
                returnKeyType="next"
                secureTextEntry
                style={styles.textInput}
                textContentType="password"
              />
              <AppTextInput
                formik={formik}
                name="confirmPassword"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={
                  Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                }
                label="Confirm password"
                left={<TextInput.Icon name="lock" />}
                submitFormOnSubmit
                ref={confirmPasswordInput}
                returnKeyType="go"
                secureTextEntry
                style={styles.textInput}
                textContentType="password"
              />
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: 10 },
  textInput: { width: '100%', marginVertical: 3 },
  submit: { marginTop: 16 },
});

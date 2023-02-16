import React, { createRef, useMemo } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import * as Yup from 'yup';
import jwtDecode from 'jwt-decode';

import { AppTextInput } from '@src/components/form/AppTextInput';
import { AuthNavParams } from '@src/screens/auth/AuthNavigator';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { FormikSubmitHandler } from '@src/types/formik';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { Platform } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Screen } from '@src/components/Screen';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { useApi } from '@src/hooks/useApi';
import { useAuthContext } from '@src/auth';
import { useFormError } from '@src/hooks/useFormError';
import { usersApi } from '@src/api/users';
import { userYupSchema } from '@shared/schemas/user.joi';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { Formik } from 'formik';

type ResetPasswordScreenProps = {
  route: RouteProp<AuthNavParams, 'ResetPassword'>;
};

const initialValues = { password: '', confirm: '' };

type FormValues = typeof initialValues;

export const ResetPassword = ({ route }: ResetPasswordScreenProps) => {
  const theme = useTheme();
  const passwordInput = createRef<RNTextInput>();
  const confirmPasswordInput = createRef<RNTextInput>();
  const { isFormError, setFieldOrFormError } = useFormError<FormValues>();
  const resetApi = useApi(usersApi.update);
  const auth = useAuthContext();

  const user = useMemo(
    () => jwtDecode<JWTUserPayload>(route.params.authToken),
    [route.params.authToken],
  );

  const handleFormSubmit: FormikSubmitHandler<FormValues> = async (
    { password },
    { setFieldError },
  ) => {
    const res = await resetApi.request(
      {
        params: { id: user.id },
        body: { password },
        attachments: { profilePicture: undefined },
      },
      { headers: { 'x-auth-token': route.params.authToken } },
    );

    if (res.ok) {
      await auth.logIn(route.params.authToken);
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
              <SubmitButton style={styles.submit}>Reset</SubmitButton>
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

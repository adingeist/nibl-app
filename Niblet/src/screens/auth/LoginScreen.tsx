import React, { createRef } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'react-native-paper';
import { TextInput } from 'react-native-paper';

import { AppTextInput } from '@src/components/form/AppTextInput';
import { authApi } from '@src/api/auth';
import { AuthNavParams } from '@src/screens/auth/AuthNavigator';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { FormikSubmitHandler } from '@src/types/formik';
import { LinkText } from '@src/components/LinkText';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { NibletLogoHeader } from '@src/components/NibletLogoHeader';
import { Screen } from '@src/components/Screen';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { useApi } from '@src/hooks/useApi';
import { useAuthContext } from '@src/auth';
import { useFormError } from '@src/hooks/useFormError';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';

const initialValues = {
  credential: '',
  password: '',
};

type FormValues = typeof initialValues;

export const LoginScreen = () => {
  const loginApi = useApi(authApi.login);
  const auth = useAuthContext();
  const credentialInput = createRef<RNTextInput>();
  const passwordInput = createRef<RNTextInput>();
  const { setFieldOrFormError, isFormError } = useFormError<FormValues>();
  const navigation =
    useNavigation<StackNavigationProp<AuthNavParams, 'Login'>>();

  const handleNavigateSignUp = () => navigation.navigate('SignUp');

  const handleFormSubmit: FormikSubmitHandler<FormValues> = async (
    { credential, password },
    { setFieldError }
  ) => {
    const phoneRegex = /^[0-9()+-].*$/;
    credential = credential.toLowerCase();

    let res: Awaited<ReturnType<typeof loginApi['request']>>;
    if (credential.includes('@')) {
      res = await loginApi.request({ body: { email: credential, password } });
    } else if (phoneRegex.test(credential)) {
      res = await loginApi.request({ body: { phone: credential, password } });
    } else {
      res = await loginApi.request({
        body: { username: credential, password },
      });
    }

    if (res.ok && res.headers) {
      await auth.logIn(res.headers['x-auth-token']);
    }

    if (!res.ok) {
      setFieldOrFormError(res.data, setFieldError)
        .ifErrContains('credential', 'username', 'email', 'phone')
        .setErrIn('credential')
        .ifErrContains('password')
        .setErrIn('password');
    }
  };

  const handleNavigateForgotPassword = () =>
    navigation.navigate('ForgotPasswordStart');

  return (
    <>
      <LoadingOverlay isVisible={loginApi.isLoading} />
      <Screen addPadding style={styles.screen}>
        <NibletLogoHeader />
        <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
          {(formik) => (
            <View style={styles.formContainer}>
              <FormErrorMessage
                error={loginApi.error}
                isVisible={isFormError}
              />
              <AppTextInput
                formik={formik}
                name="credential"
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                label="Username, email, or phone"
                inputModifier="email"
                left={<TextInput.Icon name="account" />}
                onSubmitEditing={() => passwordInput.current?.focus()}
                ref={credentialInput}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="emailAddress"
              />
              <AppTextInput
                formik={formik}
                name="password"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={
                  Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                }
                label="Password"
                left={<TextInput.Icon name="lock" />}
                submitFormOnSubmit
                ref={passwordInput}
                returnKeyType="go"
                secureTextEntry
                style={styles.textInput}
                textContentType="password"
              />
              <LinkText
                style={styles.forgotPassword}
                onPress={handleNavigateForgotPassword}
              >
                Forgot password?
              </LinkText>
              <SubmitButton>Log In</SubmitButton>
            </View>
          )}
        </Formik>
        <Text variant="bodyMedium">
          {`Don't have an account? `}
          <LinkText variant="bodyMedium" onPress={handleNavigateSignUp}>
            Sign up.
          </LinkText>
        </Text>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  textInput: { width: '100%', marginVertical: 3 },
  formContainer: { width: '100%', flex: 1 },
  forgotPassword: { marginTop: 5, marginBottom: 10, alignSelf: 'flex-end' },
});

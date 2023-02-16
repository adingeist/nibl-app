import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as Yup from 'yup';

import { AppTextInput } from '@src/components/form/AppTextInput';
import { AuthNavParams } from '@src/screens/auth/AuthNavigator';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { FormikSubmitHandler } from '@src/types/formik';
import { NibletLogoHeader } from '@src/components/NibletLogoHeader';
import { Screen } from '@src/components/Screen';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { useApi } from '@src/hooks/useApi';
import { useAuthContext } from '@src/auth';
import { usersApi } from '@src/api/users';
import { LinkText } from '@src/components/LinkText';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { EmailOrPhoneInput } from '@src/components/form/EmailOrPhoneInput';
import { Formik } from 'formik';
import { userYupSchema } from '@shared/schemas/user.joi';
import { YupErrors } from '@shared/schemas/yupErrors';

const initialFormValues = {
  email: '',
  phone: '',
  username: '',
  password: '',
};

type FormValues = typeof initialFormValues;

export const SignUpScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<AuthNavParams, 'SignUp'>>();
  const usernameInput = useRef<RNTextInput>(null);
  const passwordInput = useRef<RNTextInput>(null);
  const [isEmailSignUp, setIsEmailSignUp] = useState(true);
  const [isFormError, setIsFormError] = useState(false);
  const signUpApi = useApi(usersApi.signUp);
  const auth = useAuthContext();

  const validationSchema = isEmailSignUp
    ? Yup.object().shape({
        email: userYupSchema.email.required(YupErrors.required('Email')),
        username: userYupSchema.username.required(
          YupErrors.required('Username'),
        ),
        password: userYupSchema.password.required(
          YupErrors.required('Password'),
        ),
      })
    : Yup.object().shape({
        phone: userYupSchema.phone.required(YupErrors.required('Phone')),
        username: userYupSchema.username.required(
          YupErrors.required('Username'),
        ),
        password: userYupSchema.password.required(
          YupErrors.required('Password'),
        ),
      });

  const handleNavigateLogin = () => navigation.navigate('Login');

  const handleOpenTerms = async () => {
    await WebBrowser.openBrowserAsync('https://niblet.app/terms');
  };

  const handleOpenPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync('https://niblet.app/privacy');
  };

  const handleFormSubmit: FormikSubmitHandler<FormValues> = async (
    values,
    { setFieldError },
  ) => {
    if (signUpApi.isLoading) return;

    const email = isEmailSignUp ? values.email : undefined;
    const phone = isEmailSignUp ? undefined : values.phone;

    const res = await signUpApi.request({
      body: {
        email: email as string | null,
        phone: phone as string | null,
        username: values.username,
        password: values.password,
      },
    });

    if (res.ok && res.headers && res.data) {
      // Login as a new user to give welcome
      await auth.logIn(res.headers['x-auth-token'], true);
      navigation.navigate('EnterOTP', {
        nextScreen: 'NotificationPermission',
        userId: res.data.id,
        email,
        phone,
      });
    }

    if (!res.ok) {
      let isFieldError = false;
      // Set field-specific errors
      ['username', 'email', 'phone'].forEach((field) => {
        if ((res.data || '').toLowerCase().includes(field)) {
          setFieldError(field, res.data);
          isFieldError = true;
        }
      });

      if (!isFieldError) setIsFormError(true);
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={signUpApi.isLoading} />
      <Screen addPadding style={styles.screen}>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
        >
          {(formik) => (
            <View style={styles.upperContainer}>
              <NibletLogoHeader />
              <FormErrorMessage
                error={signUpApi.error}
                isVisible={isFormError}
              />
              <View style={styles.inputContainer}>
                <EmailOrPhoneInput
                  formik={formik}
                  emailInputProps={{
                    name: 'email',
                    autoFocus: true,
                    onSubmitEditing: () => usernameInput.current?.focus(),
                  }}
                  phoneInputProps={{
                    name: 'phone',
                    autoFocus: true,
                    onSubmitEditing: () => usernameInput.current?.focus(),
                  }}
                  isEmailInput={isEmailSignUp}
                  onToggleInputType={() => setIsEmailSignUp((state) => !state)}
                  style={styles.textInput}
                />

                <AppTextInput
                  formik={formik}
                  name="username"
                  inputModifier="username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : 'default'
                  }
                  label="Username"
                  left={<TextInput.Icon name="account" />}
                  onSubmitEditing={() => passwordInput.current?.focus()}
                  ref={usernameInput}
                  returnKeyType="next"
                  style={styles.textInput}
                  textContentType="username"
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
                <View style={styles.buttonContainer}>
                  <SubmitButton style={styles.button}>Sign Up</SubmitButton>
                </View>
                <Text variant="bodySmall" style={styles.agreementText}>
                  By signing up you, agree to our{' '}
                  <LinkText
                    variant="bodySmall"
                    style={styles.agreementText}
                    onPress={handleOpenTerms}
                  >
                    Terms of Service
                  </LinkText>{' '}
                  and{' '}
                  <LinkText
                    variant="bodySmall"
                    style={styles.agreementText}
                    onPress={handleOpenPrivacyPolicy}
                  >
                    Privacy Policy
                  </LinkText>
                  . Other users will able to search for you through the name,
                  email, and phone number provided.
                </Text>
              </View>
            </View>
          )}
        </Formik>
        <Text variant="bodyMedium">
          Already have an account?{' '}
          <LinkText variant="bodyMedium" onPress={handleNavigateLogin}>
            Log in.
          </LinkText>
        </Text>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  button: { marginTop: 20, marginBottom: 10 },
  buttonContainer: { width: '100%' },
  screen: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  textInput: { width: '100%', marginVertical: 3 },
  upperContainer: { width: '100%', alignItems: 'center' },
  agreementText: {
    fontSize: 13,
    marginVertical: 10,
    textAlign: 'left',
  },
  inputContainer: { width: '100%' },
});

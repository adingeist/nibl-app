import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import * as Yup from 'yup';

import { authApi } from '@src/api/auth';
import { AuthNavParams } from '@src/screens/auth/AuthNavigator';
import { EmailOrPhoneInput } from '@src/components/form/EmailOrPhoneInput';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { Formik } from 'formik';
import { FormikSubmitHandler } from '@src/types/formik';
import { Headline } from '@src/components/Headline';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { Screen } from '@src/components/Screen';
import { StackNavigationProp } from '@react-navigation/stack';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { useApi } from '@src/hooks/useApi';
import { useFormError } from '@src/hooks/useFormError';
import { useNavigation } from '@react-navigation/native';
import { userYupSchema } from '@shared/schemas/user.joi';

const initialValues = { email: '', phone: '' };

type FormValues = typeof initialValues;

export const ForgotPasswordStartScreen = () => {
  const [isEmailInput, setIsEmailInput] = useState(true);
  const { isFormError, setFieldOrFormError } = useFormError<FormValues>();
  const reqOTPApi = useApi(authApi.requestOTP);
  const navigation =
    useNavigation<StackNavigationProp<AuthNavParams, 'ForgotPasswordStart'>>();

  const handleFormSubmit: FormikSubmitHandler<FormValues> = async (
    { email, phone },
    { setFieldError }
  ) => {
    const payload = {
      email: isEmailInput ? email : undefined,
      phone: isEmailInput ? undefined : phone,
    };

    const res = await reqOTPApi.request({ body: payload });

    if (!res.data) return;

    if (res.ok) {
      navigation.navigate('EnterOTP', {
        nextScreen: 'ResetPassword',
        userId: res.data.userId,
        ...payload,
      });
    } else {
      setFieldOrFormError(res.data, setFieldError)
        .ifErrContains('email')
        .setErrIn('email')
        .ifErrContains('phone')
        .setErrIn('phone');
    }
  };

  const handleToggleInputType = () => {
    setIsEmailInput(!isEmailInput);
  };

  return (
    <>
      <LoadingOverlay isVisible={reqOTPApi.isLoading} />
      <Screen addPadding>
        <Headline>Forgot password?</Headline>
        <Text variant="bodyMedium">{`We'll send you a one-time code to reset your password.`}</Text>
        <Formik
          validationSchema={
            isEmailInput
              ? Yup.object().shape({ email: userYupSchema.email.required() })
              : Yup.object().shape({ phone: userYupSchema.phone.required() })
          }
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
        >
          {(formik) => (
            <>
              <FormErrorMessage
                error={reqOTPApi.error}
                isVisible={isFormError}
              />
              <EmailOrPhoneInput
                formik={formik}
                emailInputProps={{
                  name: 'email',
                  autoFocus: true,
                  submitFormOnSubmit: true,
                }}
                phoneInputProps={{
                  name: 'phone',
                  autoFocus: true,
                  submitFormOnSubmit: true,
                }}
                isEmailInput={isEmailInput}
                onToggleInputType={handleToggleInputType}
                style={styles.textInput}
              />
              <SubmitButton disabled={reqOTPApi.isLoading}>
                Send Code
              </SubmitButton>
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  textInput: { width: '100%', marginVertical: 15 },
});

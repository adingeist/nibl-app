import React, { createRef, useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';

import { AppTextInput } from '@src/components/form/AppTextInput';
import { authApi } from '@src/api/auth';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { FormikSubmitHandler } from '@src/types/formik';
import { IGetUserEmail } from '@shared/types/routes/users.controller';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { OTPModal } from '@src/components/form/OTPModal';
import { Screen } from '@src/components/Screen';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { useApi } from '@src/hooks/useApi';
import { useFormError } from '@src/hooks/useFormError';
import { UserDataVerified } from '@src/components/form/UserDataVerified';
import { usersApi } from '@src/api/users';
import { userYupSchema } from '@shared/schemas/user.joi';
import { useSignedInAuth } from '@src/auth/useAuthContext';
import { Headline } from '@src/components/Headline';

const initialValues = { email: '' };

type FormValues = typeof initialValues;

export const EditEmailScreen = () => {
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<IGetUserEmail['res']>();
  const { isFormError, setFieldOrFormError } = useFormError<FormValues>();
  const { user } = useSignedInAuth();
  const formRef = createRef<FormikProps<FormValues>>();
  const getUserEmailApi = useApi(usersApi.getUserEmail);
  const requestOTPApi = useApi(authApi.requestOTP);
  const updateUserApi = useApi(usersApi.update);

  // On mount
  useEffect(() => {
    const loadEmail = async () => {
      const res = await getUserEmailApi.request({});
      if (res.ok && res.data) {
        setUserEmail(res.data);
      }
    };

    loadEmail();
  }, []);

  if (!userEmail) return null;

  const handleSubmit: FormikSubmitHandler<FormValues> = async (
    { email },
    { setFieldError }
  ) => {
    const res = await updateUserApi.request({
      params: { id: user.id },
      body: { email },
    });

    if (res.ok) {
      setUserEmail({ email: email, emailIsVerified: false });
      showVerificationModal();
    } else {
      setFieldOrFormError(res.data, setFieldError)
        .ifErrContains('email')
        .setErrIn('email');
    }
  };

  const showVerificationModal = () => setIsVerifyModalVisible(true);

  const hideVerificationModal = () => setIsVerifyModalVisible(false);

  const onVerificationRequest = async () => {
    if (!userEmail.email) return;

    const res = await requestOTPApi.request({
      body: { email: userEmail.email },
    });

    if (res.ok) {
      showVerificationModal();
    }
  };

  const handleVerificationSuccess = () => {
    hideVerificationModal();
    setUserEmail({ email: userEmail.email, emailIsVerified: true });
  };

  return (
    <>
      <OTPModal
        isVisible={isVerifyModalVisible}
        email={userEmail.email as string | undefined}
        userId={user.id}
        onVerificationSuccess={handleVerificationSuccess}
        onVerificationIgnore={hideVerificationModal}
      />
      <LoadingOverlay
        isVisible={updateUserApi.isLoading || requestOTPApi.isLoading}
      />
      <Screen addPadding>
        <Formik
          validateOnBlur={false}
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            email: userYupSchema.email
              .not([userEmail.email], "Email hasn't changed")
              .required('Email is required'),
          })}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          {(formik) => (
            <>
              <FormErrorMessage
                error={updateUserApi.error}
                isVisible={isFormError}
              />
              <Headline>Update email</Headline>
              <Text variant="bodyMedium">
                Current email:{' '}
                <Text variant="bodyMedium" style={styles.email}>
                  {userEmail.email ? userEmail.email : 'none'}
                </Text>
              </Text>
              {userEmail.email && (
                <UserDataVerified
                  onVerificationRequest={onVerificationRequest}
                  isVerified={userEmail.emailIsVerified}
                />
              )}
              <AppTextInput
                formik={formik}
                name="email"
                submitFormOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                label="New email"
                left={<TextInput.Icon name="email" />}
                returnKeyType="go"
                style={styles.textInput}
                textContentType="emailAddress"
              />
              <SubmitButton style={styles.submit}>Update</SubmitButton>
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: 10 },
  email: { fontWeight: 'bold' },
  textInput: { width: '100%', marginVertical: 5 },
  submit: { marginTop: 16 },
});

import React, { createRef, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet, TextInput as RNTextInput } from 'react-native';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';

import { authApi } from '@src/api/auth';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { FormikSubmitHandler } from '@src/types/formik';
import { IGetUserPhone } from '@shared/types/routes/users.controller';
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
import { useTheme } from '@src/hooks/useTheme';
import { PhoneTextInput } from '@src/components/form/PhoneTextInput';

const initialValues = { phone: '' };

type FormValues = typeof initialValues;

export const EditPhoneScreen = () => {
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [phoneData, setPhoneData] = useState<IGetUserPhone['res']>();
  const { isFormError, setFieldOrFormError } = useFormError<FormValues>();
  const { user } = useSignedInAuth();
  const formRef = createRef<FormikProps<FormValues>>();
  const phoneRef = createRef<RNTextInput>();
  const getUserPhoneApi = useApi(usersApi.getUserPhone);
  const requestOTPApi = useApi(authApi.requestOTP);
  const theme = useTheme();
  const updateUserApi = useApi(usersApi.update);

  // On mount
  useEffect(() => {
    const loadPhoneData = async () => {
      const res = await getUserPhoneApi.request({});
      if (res.ok && res.data) {
        setPhoneData(res.data);
      }
    };

    loadPhoneData();
  }, []);

  if (!phoneData) return null;

  const handleSubmit: FormikSubmitHandler<FormValues> = async (
    { phone },
    { setFieldError }
  ) => {
    const res = await updateUserApi.request({
      params: { id: user.id },
      body: { phone },
    });

    if (res.ok) {
      setPhoneData({ phone, phoneIsVerified: false });
      showVerificationModal();
    } else {
      setFieldOrFormError(res.data, setFieldError)
        .ifErrContains('phone')
        .setErrIn('phone');
    }
  };

  const showVerificationModal = () => setIsVerifyModalVisible(true);

  const hideVerificationModal = () => setIsVerifyModalVisible(false);

  const onVerificationRequest = async () => {
    if (!phoneData.phone) return;

    const res = await requestOTPApi.request({
      body: { phone: phoneData.phone },
    });

    if (res.ok) {
      showVerificationModal();
    }
  };

  const handleVerificationSuccess = () => {
    hideVerificationModal();
    setPhoneData({ phone: phoneData.phone, phoneIsVerified: true });
  };

  return (
    <>
      <OTPModal
        isVisible={isVerifyModalVisible}
        phone={phoneData.phone as string | undefined}
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
            phone: userYupSchema.phone
              .not([phoneData.phone], "Phone hasn't changed")
              .required('Phone is required'),
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
              <Text
                style={[styles.title, { color: theme.colors.primary }]}
                variant="headlineMedium"
              >
                Update phone
              </Text>
              <Text variant="bodyMedium">
                Current phone:{' '}
                <Text variant="bodyMedium" style={styles.phone}>
                  {phoneData.phone ? phoneData.phone : 'none'}
                </Text>
              </Text>
              {phoneData.phone && (
                <UserDataVerified
                  onVerificationRequest={onVerificationRequest}
                  isVerified={phoneData.phoneIsVerified}
                />
              )}
              <PhoneTextInput
                formik={formik}
                name="phone"
                label="New phone"
                ref={phoneRef}
                style={styles.textInput}
                submitFormOnSubmit
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
  phone: { fontWeight: 'bold' },
  textInput: { width: '100%', marginVertical: 5 },
  submit: { marginTop: 16 },
});

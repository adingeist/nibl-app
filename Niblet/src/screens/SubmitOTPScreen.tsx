import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { Screen } from '@src/components/Screen';
import { useTheme } from '@src/hooks/useTheme';
import { FormErrorMessage } from '@src/components/FormErrorMessage';
import { OTPInput } from '@src/components/form/OTPInput';
import { LinkText } from '@src/components/LinkText';
import { useApi } from '@src/hooks/useApi';
import { authApi } from '@src/api/auth';
import { FormikSubmitHandler } from '@src/types/formik';
import { ApiOkResponse } from 'apisauce';
import { IAuthOTP } from '@shared/types/routes/auth.controller';
import { useFormError } from '@src/hooks/useFormError';
import { Formik } from 'formik';

type SubmitOTPScreenProps = {
  email?: string;
  phone?: string;
  userId: string;
  onVerificationSuccess?: (res: ApiOkResponse<IAuthOTP['res']>) => void;
};

const initialValues = { pin: '' };

type FormValues = typeof initialValues;

export const SubmitOTPScreen = ({
  email,
  phone,
  userId,
  onVerificationSuccess,
}: SubmitOTPScreenProps) => {
  if (phone && email) {
    console.error(`SubmitOTPScreen should only receive a email or phone prop.`);
  }

  const theme = useTheme();
  const reqOTPApi = useApi(authApi.requestOTP);
  const otpApi = useApi(authApi.submitOTP);
  const { isFormError, setFieldOrFormError } = useFormError<FormValues>();

  const showDialog = () => {
    Alert.alert('Code Sent', `A new code was sent to ${email ? email : phone}`);
  };

  const handleSendNewCode = async () => {
    const res = await reqOTPApi.request({
      body: {
        email: email ? email : undefined,
        phone: phone ? phone : undefined,
      },
    });

    if (res.ok) {
      showDialog();
    }
  };

  const handleFormSubmit: FormikSubmitHandler<FormValues> = async (
    { pin },
    { setFieldError }
  ) => {
    const res = await otpApi.request({
      body: {
        pin: pin,
        userId,
      },
    });

    if (res.ok) {
      if (onVerificationSuccess) onVerificationSuccess(res);
    } else {
      setFieldOrFormError(res.data, setFieldError)
        .ifErrContains('pin', 'code')
        .setErrIn('pin');
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={otpApi.isLoading || reqOTPApi.isLoading} />
      <Screen addPadding>
        <Text
          style={{ color: theme.colors.primary }}
          variant="headlineMedium"
        >{`Enter code.`}</Text>
        <Text variant="bodyMedium">{`We sent a code to ${
          email ? email : phone
        }`}</Text>

        <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
          {() => (
            <>
              <FormErrorMessage
                style={styles.errorMessage}
                error={otpApi.error}
                isVisible={isFormError}
              />
              <OTPInput name="pin" />
            </>
          )}
        </Formik>

        <LinkText onPress={handleSendNewCode} style={styles.resendCode}>
          Resend code?
        </LinkText>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  resendCode: {
    marginLeft: 'auto',
    marginRight: 20,
  },
  errorMessage: { marginTop: 10 },
});

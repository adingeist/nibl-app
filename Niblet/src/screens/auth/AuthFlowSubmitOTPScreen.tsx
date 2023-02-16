import React from 'react';

import { ApiOkResponse } from 'apisauce';
import { AuthNavParams } from '@src/screens/auth/AuthNavigator';
import { IAuthOTP } from '@shared/types/routes/auth.controller';
import { SubmitOTPScreen } from '@src/screens/SubmitOTPScreen';
import { StackScreenProps } from '@react-navigation/stack';

export const AuthFlowSubmitOTPScreen = ({
  navigation,
  route: {
    params: { email, phone, nextScreen, userId },
  },
}: StackScreenProps<AuthNavParams, 'EnterOTP'>) => {
  const handleVerificationSuccess = (res: ApiOkResponse<IAuthOTP['res']>) => {
    const headers = res.headers as { 'x-auth-token': string };
    const authToken = headers['x-auth-token'];
    navigation.navigate(nextScreen, { authToken });
  };

  return (
    <SubmitOTPScreen
      userId={userId}
      email={email}
      phone={phone}
      onVerificationSuccess={handleVerificationSuccess}
    />
  );
};

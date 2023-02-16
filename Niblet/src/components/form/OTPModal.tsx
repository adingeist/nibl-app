import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { SubmitOTPScreen } from '@src/screens/SubmitOTPScreen';
import { NavigationButton } from '@src/components/navigation/NavigationButton';
import { useTheme } from '@src/hooks/useTheme';

type OTPModalProps = {
  email?: string;
  phone?: string;
  userId: string;
  isVisible: boolean;
  onVerificationIgnore: () => void;
  onVerificationSuccess: () => void;
};

export const OTPModal = ({
  email,
  phone,
  userId,
  isVisible,
  onVerificationIgnore,
  onVerificationSuccess,
}: OTPModalProps) => {
  const theme = useTheme();

  const handleVerifyModalClose = () => {
    Alert.alert(
      'Ignore verifying?',
      'Not verifying may limit certain features with your account. You may also lose the ability to recover your account if you lose access!',
      [
        { text: 'Continue verifying' },
        {
          text: "I'll verify later",
          style: 'destructive',
          onPress: onVerificationIgnore,
        },
      ]
    );
  };

  return (
    <Modal style={styles.modal} isVisible={isVisible}>
      <SubmitOTPScreen
        userId={userId}
        email={email}
        phone={phone}
        onVerificationSuccess={onVerificationSuccess}
      />
      <NavigationButton
        style={[
          {
            top: theme.screenMargin,
            right: theme.screenMargin,
          },
          styles.closeButton,
        ]}
        name="close"
        onPress={handleVerifyModalClose}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginBottom: 0,
    marginHorizontal: 0,
    marginTop: 200,
  },

  closeButton: {
    position: 'absolute',
    zIndex: 2,
  },
});

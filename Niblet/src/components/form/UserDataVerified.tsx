import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

import { useTheme } from '@src/hooks/useTheme';
import { LinkText } from '@src/components/LinkText';

type UserDataVerifiedProps = {
  isVerified: boolean | undefined;
  onVerificationRequest: () => void;
};

export const UserDataVerified = ({
  isVerified,
  onVerificationRequest,
}: UserDataVerifiedProps) => {
  const { colors } = useTheme();

  const color = useMemo(
    () => (isVerified ? colors.success : colors.error),
    [colors.error, colors.success, isVerified]
  );

  if (isVerified === undefined) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        color={color}
        name={isVerified ? 'check-circle-outline' : 'alert-circle-outline'}
        size={20}
        style={styles.icon}
      />
      <Text variant="bodyMedium" style={{ color }}>
        {isVerified ? 'Verified' : 'Not verified'}
      </Text>
      {!isVerified && (
        <LinkText
          onPress={onVerificationRequest}
          style={styles.verifyText}
          variant="bodyMedium"
        >
          Verify
        </LinkText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    flexDirection: 'row',
  },

  icon: {
    marginHorizontal: 3,
  },

  verifyText: {
    paddingLeft: 10,
  },
});

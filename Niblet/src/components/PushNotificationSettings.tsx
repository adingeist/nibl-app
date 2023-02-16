import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { notificationApi } from '@src/api/notifications';
import { ToggleRow } from '@src/components/ToggleRow';
import { useApi } from '@src/hooks/useApi';
import { useNotifications } from '@src/hooks/useNotifications';
import { useFormikContext } from 'formik';

export const PushNotificationSettings = () => {
  const formik = useFormikContext();
  const { hasPermission } = useNotifications();

  const getPushApi = useApi(notificationApi.getSettings);

  useEffect(() => {
    const getInitialValues = async () => {
      const res = await getPushApi.request({});
      if (res.ok && res.data) {
        const settings = res.data;
        formik.setValues(settings, false);
      }
    };

    getInitialValues();
  }, []);

  return (
    <View>
      <ToggleRow name="notifyPostLikes" label="Your post gets a like" />
      <ToggleRow name="notifyCommentOnPost" label="You post gets a comment" />
      <ToggleRow name="notifyRecipeGetsNib" label="Someone nibs your recipe" />
      <ToggleRow name="notifyCommentReply" label="Your comment gets a reply" />

      {!hasPermission && (
        <View style={styles.enableOverlay}>
          <MaterialCommunityIcons name="bell" size={35} />
          <View style={styles.buttonContainer}>
            <Text variant="headlineLarge" style={styles.textCentered}>
              Enable notifications
            </Text>
          </View>
          <Text style={styles.textCentered} variant="bodySmall">
            {`You'll get to pick which notifications you receive.`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  enableOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: 'auto',
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: { width: '100%', marginVertical: 10 },

  textCentered: { textAlign: 'center' },

  doneButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});

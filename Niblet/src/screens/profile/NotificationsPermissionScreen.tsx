import React, { createRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@src/components/Screen';
import { Headline } from '@src/components/Headline';
import { PushNotificationSettings } from '@src/components/PushNotificationSettings';
import { Formik, FormikProps } from 'formik';
import { FormikSubmitHandler } from '@src/types/formik';
import { SubmitButton } from '@src/components/form/SubmitButton';
import { useApi } from '@src/hooks/useApi';
import { notificationApi } from '@src/api/notifications';
import { LoadingOverlay } from '@src/components/LoadingOverlay';
import { useAuthContext } from '@src/auth';

type FormValues = {
  notifyCommentOnPost: boolean;
  notifyCommentReply: boolean;
  notifyPostLikes: boolean;
  notifyRecipeGetsNib: boolean;
};

export const NotificationsPermissionScreen = () => {
  const updatePushApi = useApi(notificationApi.updateSettings);
  const formRef = createRef<FormikProps<FormValues>>();
  const { dispatch } = useAuthContext();

  const handleSubmit: FormikSubmitHandler<FormValues> = async (values) => {
    await updatePushApi.request({ body: values });

    dispatch({ type: 'STOP_WELCOMING_USER' });
  };

  return (
    <>
      <LoadingOverlay isVisible={updatePushApi.isLoading} />
      <Screen addPadding>
        <Headline>Notification settings</Headline>
        <Formik
          innerRef={formRef}
          initialValues={{
            notifyCommentOnPost: true,
            notifyCommentReply: true,
            notifyPostLikes: true,
            notifyRecipeGetsNib: true,
          }}
          onSubmit={handleSubmit}
        >
          {() => (
            <>
              <PushNotificationSettings />
              <View style={styles.doneButton}>
                <SubmitButton alwaysEnabled mode="contained">
                  Done
                </SubmitButton>
              </View>
            </>
          )}
        </Formik>
      </Screen>
    </>
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

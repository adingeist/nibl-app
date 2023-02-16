import React, { ComponentProps, ForwardedRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';

export const MODAL_ANIMATION_SPEED = 200;

type AppModalProps = Partial<ComponentProps<typeof Modal>>;

const AppModalComponent = (
  { children, ...props }: AppModalProps,
  ref: ForwardedRef<Modal>,
) => {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      animationInTiming={MODAL_ANIMATION_SPEED}
      animationOutTiming={MODAL_ANIMATION_SPEED}
      ref={ref}
      useNativeDriverForBackdrop
      useNativeDriver
      style={styles.modalContainer}
      {...props}
    >
      <View
        style={[
          styles.contentContainer,
          {
            paddingHorizontal: theme.screenMargin / 2,
            paddingBottom: bottom + 20,
            paddingTop: theme.screenMargin / 2,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {children}
      </View>
    </Modal>
  );
};

export const AppModal = React.forwardRef(AppModalComponent);

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },

  contentContainer: {
    width: '100%',
  },
});

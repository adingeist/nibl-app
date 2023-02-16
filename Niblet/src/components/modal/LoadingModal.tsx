import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { AppActivityIndicator } from '@src/components/AppActivityIndicator';
import { MODAL_ANIMATION_SPEED } from '@src/components/modal/AppModal';

type LoadingModalProps = Partial<ComponentProps<typeof Modal>> & {
  isVisible: boolean;
};

const LoadingModalComponent = ({ style, ...props }: LoadingModalProps) => {
  return (
    <Modal
      animationInTiming={MODAL_ANIMATION_SPEED}
      animationOutTiming={MODAL_ANIMATION_SPEED}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={[styles.container, style]}
      {...props}
    >
      <AppActivityIndicator size={50} />
    </Modal>
  );
};

export const LoadingModal = React.memo(LoadingModalComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

import React, { ComponentProps } from 'react';

import { AppDialogModal } from '@src/components/AppDialogModal';

type ErrorModalProps = { isVisible: boolean } & Partial<
  Omit<ComponentProps<typeof AppDialogModal>, 'buttons'>
>;

const ErrorModalComponent = ({
  title = '',
  body = '',
  onDismiss,
  ...props
}: ErrorModalProps) => {
  return (
    <AppDialogModal
      title={title}
      body={body}
      onDismiss={onDismiss}
      buttons={[{ title: 'Dismiss', onPress: onDismiss }]}
      {...props}
    />
  );
};

export const ErrorModal = React.memo(ErrorModalComponent);

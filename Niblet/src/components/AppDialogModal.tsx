import { MODAL_ANIMATION_SPEED } from '@src/components/modal/AppModal';
import { useTheme } from '@src/hooks/useTheme';
import React, { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { Button, Text } from 'react-native-paper';

type ButtonTypes = 'default' | 'destructive';

type AppDialogModalProps = Partial<ModalProps> & {
  title: string;
  body: string;
  buttons: (Omit<ComponentProps<typeof Button>, 'children'> & {
    title: string;
    type?: ButtonTypes;
  })[];
  isVisible: boolean;
};

const AppDialogModalComponent = ({
  children,
  body,
  buttons,
  title,
  ...props
}: AppDialogModalProps) => {
  const theme = useTheme();

  return (
    <Modal
      animationInTiming={MODAL_ANIMATION_SPEED}
      animationOutTiming={MODAL_ANIMATION_SPEED}
      animationIn="zoomIn"
      animationOut="zoomOut"
      {...props}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            paddingHorizontal: theme.screenMargin,
          },
        ]}
      >
        <Text style={styles.headline} variant="headlineLarge">
          {title}
        </Text>
        <Text style={styles.body} variant="bodyMedium">
          {body}
        </Text>
        <View style={styles.buttonsContainer}>
          {buttons.map((button, index) => {
            const type: ButtonTypes = button.type ? button.type : 'default';

            return (
              <Button
                key={`dialog-btn-${index}`}
                textColor={
                  type === 'destructive'
                    ? theme.colors.error
                    : theme.colors.primary
                }
                {...button}
              >
                {button.title}
              </Button>
            );
          })}
        </View>
      </View>
      {children}
    </Modal>
  );
};

export const AppDialogModal = React.memo(AppDialogModalComponent);

const styles = StyleSheet.create({
  body: {
    marginVertical: 10,
  },

  headline: {
    marginTop: 7,
  },

  container: {
    width: '100%',
    paddingVertical: 5,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginBottom: 7,
  },
});

import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { useFormikContext } from 'formik';

type SubmitButtonProps = {
  alwaysEnabled?: boolean;
} & React.ComponentProps<typeof Button>;

const SubmitButtonComponent = ({
  alwaysEnabled,
  ...props
}: SubmitButtonProps) => {
  const theme = useTheme();
  const formik = useFormikContext();

  return (
    <Button
      labelStyle={theme.typescale.bodyMedium}
      mode="contained"
      onPress={formik.handleSubmit}
      {...props}
      disabled={
        !alwaysEnabled && (!formik.isValid || !formik.dirty || props.disabled)
      }
    >
      {props.children}
    </Button>
  );
};

export const SubmitButton = React.memo(SubmitButtonComponent);

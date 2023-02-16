import React, { ComponentProps } from 'react';

import { AppTextInput } from '@src/components/form/AppTextInput';

type NumericInputType = ComponentProps<typeof AppTextInput>;

export const NumericInput = ({ name, ...props }: NumericInputType) => {
  return (
    <AppTextInput name={name} dense keyboardType={'decimal-pad'} {...props} />
  );
};

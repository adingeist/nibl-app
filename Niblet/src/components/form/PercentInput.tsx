import { NumericInput } from '@src/components/form/NumericInput';
import { EasyCook, Nutrients } from 'easy-cook';
import React from 'react';
import { TextInput } from 'react-native-paper';

type PercentInputProps = {
  nutrient: Nutrients;
} & React.ComponentProps<typeof NumericInput>;

const PercentInputComponent = ({
  nutrient,
  formik,
  name,
  ...props
}: PercentInputProps) => {
  const unit = EasyCook.getLabelUnit(nutrient);

  const percentDV = EasyCook.change(
    Number.parseFloat(
      formik.getFieldMeta(name).value
        ? (formik.getFieldMeta(name).value as string)
        : '0',
    ),
  )
    .labelUnit(nutrient)
    .toPercentDV();

  return (
    <NumericInput
      right={<TextInput.Affix text={`${percentDV}%`} />}
      suffix={unit}
      label={nutrient}
      formik={formik}
      name={name}
      {...props}
    />
  );
};

export const PercentInput = React.memo(PercentInputComponent);

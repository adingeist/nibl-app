import type { FormikHelpers } from 'formik';

export type FormikSubmitHandler<FormValues> = (
  values: FormValues,
  formikHelpers: FormikHelpers<FormValues>
) => void | Promise<void>;

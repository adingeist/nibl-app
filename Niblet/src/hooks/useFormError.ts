import { FormikHelpers } from 'formik';
import { useState } from 'react';

export const useFormError = <FormValues>() => {
  const [isFormError, setIsFormError] = useState(false);

  /**
   * If the error contains a given string, which represents a field,
   * that field will be set to the error. If the error doesn't describe
   * a field, isFormError will be set to true, indicating a form error.
   * @example setFieldOrFormError(res.data, setFieldError)
        .ifErrContains('username', 'email', 'phone')
        .setErrIn('credential')
   * @param err - error data of API response
   * @param setFieldError - Formik set field error helper function
   */
  function setFieldOrFormError(
    err: string | undefined,
    setFieldError: FormikHelpers<FormValues>['setFieldError']
  ) {
    let isFieldError = false;

    const ifErrContains = (...search: string[]) => {
      const setErrIn = (field: string & keyof FormValues) => {
        search.forEach((str) => {
          if (err?.toLowerCase().includes(str.toLowerCase())) {
            setFieldError(field, err);
            isFieldError = true;
          }
        });
        if (!isFieldError) {
          setIsFormError(true);
        }
        return { ifErrContains };
      };

      return { setErrIn };
    };

    return { ifErrContains };
  }

  return {
    isFormError,
    setFieldOrFormError,
  };
};

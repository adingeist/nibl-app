import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AllMassTypes, AllVolumeTypes, EasyCook } from 'easy-cook';
import { Formik, FormikProps } from 'formik';
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';

import { AppDropDownPicker } from '@src/components/form/AppDropDownPicker';
import { AppTextInput } from '@src/components/form/AppTextInput';
import { Columns } from '@src/components/Columns';
import { CreateFoodFormValues } from '@src/screens/upload/CreateIngredientScreen';
import { DeleteOrConfirmButtons } from '@src/components/DeleteOrConfirmButtons';
import { FormikSubmitHandler } from '@src/types/formik';
import { NumericInput } from '@src/components/form/NumericInput';
import { SupportedUnitIcon } from '@src/components/SupportedUnitIcon';
import { SupportedUnitsList } from '@src/components/SupportedUnitsList';
import { YupErrors } from '@shared/schemas/yupErrors';
import { FoodYupSchema } from '@shared/schemas/food.joi';

const ANIMATION_DURATION = 200;

type SupportedUnitListFormProps = {
  formik: FormikProps<CreateFoodFormValues>;
} & ComponentProps<typeof SupportedUnitsList>;

export const SupportedUnitsListForm = ({
  formik,
  ...props
}: SupportedUnitListFormProps) => {
  const [showAddUnit, setShowAddUnit] = useState(false);
  const addFormHeight = useRef(new Animated.Value(0)).current;

  const initialValues = {
    servingSizeQuantity: '',
    servingSizeUnit: '',
    servingSizeMetricQuantity: '',
    servingSizeMetricUnit: formik.values.servingSizeMetricUnit,
  };

  type FormValues = {
    servingSizeUnit: string;
    servingSizeQuantity: string;
    servingSizeMetricQuantity: string;
    servingSizeMetricUnit: 'g' | 'mL';
  };

  const getDensity = useCallback(
    (
      metricQty: number,
      metricUnit: 'g' | 'mL',
      altUnit: string,
      altQty: number,
    ) => {
      const altType = EasyCook.getUnitMeasuringType(altUnit);

      let density: number | undefined = undefined;

      if (metricUnit === 'g' && altType === 'volume' && altQty) {
        density =
          metricQty /
          EasyCook.convert(altQty, altUnit as AllVolumeTypes).to('mL');
      } else if (metricUnit === 'mL' && altType === 'mass' && metricQty) {
        density =
          EasyCook.convert(altQty, altUnit as AllMassTypes).to('g') / metricQty;
      }

      return density ? density.toString() : undefined;
    },
    [],
  );

  const onConfirmPress: FormikSubmitHandler<FormValues> = ({
    servingSizeMetricUnit,
    servingSizeMetricQuantity,
    servingSizeQuantity,
    servingSizeUnit,
  }) => {
    const supportedUnits = [...formik.values.supportedUnits];
    const altQty = Number.parseFloat(servingSizeQuantity);
    const metricQty = Number.parseFloat(servingSizeMetricQuantity);

    const density = getDensity(
      metricQty,
      servingSizeMetricUnit,
      servingSizeUnit,
      altQty,
    );

    supportedUnits.push({
      quantity: altQty,
      metricQuantityPerUnit: metricQty,
      unit: servingSizeUnit,
    });

    if (density) {
      supportedUnits.push('g');
      supportedUnits.push('mL');
    } else {
      supportedUnits.push(servingSizeMetricUnit);
    }

    formik.setValues({
      ...formik.values,
      // Only update these values on the first unit add
      servingSizeQuantity:
        formik.values.servingSizeQuantity || servingSizeQuantity,
      servingSizeMetricQuantity:
        formik.values.servingSizeMetricQuantity || servingSizeMetricQuantity,
      servingSizeUnit: formik.values.servingSizeUnit || servingSizeUnit,
      servingSizeMetricUnit:
        formik.values.servingSizeMetricUnit || servingSizeMetricUnit,
      // Update if density goes undefined --> number
      density: formik.values.density || density,
      // Always update
      supportedUnits,
    });

    setShowAddUnit(false);
  };

  const showAddUnitForm = useCallback(() => {
    setShowAddUnit(true);
  }, []);

  const hideAddUnitForm = useCallback(() => {
    setShowAddUnit(false);
  }, []);

  useEffect(() => {
    if (showAddUnit) {
      Animated.timing(addFormHeight, {
        toValue: 250,
        useNativeDriver: false,
        duration: ANIMATION_DURATION,
      }).start();
    } else {
      Animated.timing(addFormHeight, {
        toValue: 0,
        useNativeDriver: false,
        duration: ANIMATION_DURATION,
      }).start();
    }
  }, [addFormHeight, hideAddUnitForm, showAddUnit, showAddUnitForm]);

  return (
    <>
      <ScrollView horizontal style={styles.scrollView}>
        <SupportedUnitsList {...props} />
        <SupportedUnitIcon.Add onPress={showAddUnitForm} />
      </ScrollView>

      <Animated.View style={[{ height: addFormHeight }, styles.expandable]}>
        {showAddUnit && (
          <Formik
            initialValues={initialValues}
            onSubmit={onConfirmPress}
            validationSchema={Yup.object().shape({
              servingSizeQuantity: FoodYupSchema.servingSizeQuantity.required(
                YupErrors.required('Serving size quantity'),
              ),
              servingSizeUnit: FoodYupSchema.servingSizeUnit.required(
                YupErrors.required('Serving size unit'),
              ),
              servingSizeMetricQuantity:
                FoodYupSchema.servingSizeMetricQuantity.required(
                  YupErrors.required('Metric quantity'),
                ),
              servingSizeMetricUnit:
                FoodYupSchema.servingSizeMetricUnit.required(
                  YupErrors.required('Metric unit'),
                ),
            })}
          >
            {(subFormik) => (
              <>
                <Columns>
                  <NumericInput
                    formik={subFormik}
                    label="Serving quantity"
                    name={'servingSizeQuantity'}
                    dense={false}
                  />
                  <AppTextInput
                    formik={subFormik}
                    label="Serving size"
                    autoCapitalize="none"
                    name={'servingSizeUnit'}
                  />
                </Columns>
                <Columns style={styles.elevation5}>
                  <NumericInput
                    dense={false}
                    formik={subFormik}
                    label="Metric quantity"
                    name={'servingSizeMetricQuantity'}
                  />
                  <AppDropDownPicker
                    disabled={formik.values.servingSizeMetricUnit !== undefined}
                    items={['g', 'mL']}
                    formik={subFormik}
                    autoCapitalize="none"
                    label="Metric unit"
                    name={'servingSizeMetricUnit'}
                  />
                </Columns>
                <Columns style={styles.elevation4}>
                  <></>
                  <DeleteOrConfirmButtons
                    onConfirmPress={subFormik.submitForm}
                    onDeletePress={hideAddUnitForm}
                  />
                </Columns>
              </>
            )}
          </Formik>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  elevation5: {
    zIndex: 5,
    elevation: 5,
  },

  elevation4: {
    zIndex: 4,
    elevation: 4,
  },

  scrollView: {
    flexDirection: 'row',
  },

  expandable: {
    overflow: 'hidden',
  },
});

import { useTheme } from '@src/hooks/useTheme';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';

type ToggleRowProps = {
  label: string;
  name: string;
};

export const ToggleRow = ({ label, name }: ToggleRowProps) => {
  const { colors } = useTheme();
  const formik = useFormikContext();

  const handleValueChange = useCallback(
    (newVal: boolean) => {
      formik.setFieldValue(name, newVal);
    },
    [formik, name],
  );

  return (
    <View style={[styles.toggleRow, { borderColor: colors.light }]}>
      <Text style={styles.text} variant="bodyLarge">
        {label}
      </Text>
      <Switch
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={(formik.values as any)[name]}
        onValueChange={handleValueChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },

  text: {
    flex: 1,
  },
});

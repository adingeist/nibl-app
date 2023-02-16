import React, {
  ComponentProps,
  ForwardedRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import {
  AppTextInput,
  fieldShouldShowError,
} from '@src/components/form/AppTextInput';
import { Text, TextInput } from 'react-native-paper';
import { useFormikContext } from 'formik';
import { ScrollView } from 'react-native-gesture-handler';

type AppDropDownPickerProps = {
  name: string;
  containerStyle?: StyleProp<ViewStyle>;
  items: string[];
} & ComponentProps<typeof AppTextInput>;

const AppDropDownPickerComponent = (
  {
    name,
    items,
    onFocus,
    containerStyle,
    onBlur,
    ...props
  }: AppDropDownPickerProps,
  ref: ForwardedRef<RNTextInput>
) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const top = useRef(0);
  const formik = useFormikContext<Record<string, string>>();

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);

      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);

      if (!items.includes(e.nativeEvent.text)) {
        formik.setFieldValue(name, '');
      }

      if (onBlur) {
        onBlur(e);
      }
    },
    [formik, items, name, onBlur]
  );

  const setInputHeight = (e: LayoutChangeEvent) => {
    top.current = e.nativeEvent.layout.height + 8;
  };

  const handleSelect = (item: string) => {
    formik.setFieldValue(name, item);
  };

  const isShowingError = useMemo(
    () => fieldShouldShowError(formik, name),
    [formik, name]
  );

  return (
    <View style={containerStyle}>
      <AppTextInput
        onLayout={setInputHeight}
        right={<TextInput.Icon style={styles.rightIcon} name="chevron-down" />}
        name={name}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
        ref={ref}
      />
      {focused && (
        <ScrollView
          overScrollMode="always"
          style={[
            styles.itemsContainer,
            {
              backgroundColor: theme.colors.background,
              borderBottomLeftRadius: theme.roundness,
              borderBottomRightRadius: theme.roundness,
              borderColor: isShowingError
                ? theme.colors.error
                : theme.colors.primary,
              borderLeftWidth: focused ? 2 : 0,
              borderRightWidth: focused ? 2 : 0,
              borderBottomWidth: focused ? 2 : 0,
              borderTopWidth: 2,
              top: top.current,
              height: 130,
            },
          ]}
          keyboardShouldPersistTaps="always"
        >
          {focused &&
            items.map((item) => {
              const value = formik.values[name];

              if (
                !value ||
                (item.toLowerCase().includes(value.toLowerCase()) &&
                  item.toLowerCase() !== value.toLowerCase())
              )
                return (
                  <TouchableOpacity
                    style={[
                      styles.itemContainer,
                      {
                        borderTopWidth: 2,
                        borderColor: theme.colors.light,
                      },
                    ]}
                    key={item}
                    onPress={() => handleSelect(item)}
                  >
                    <Text variant="bodyMedium">{item}</Text>
                  </TouchableOpacity>
                );
            })}
        </ScrollView>
      )}
    </View>
  );
};

export const AppDropDownPicker = React.forwardRef(AppDropDownPickerComponent);

const styles = StyleSheet.create({
  itemsContainer: {
    position: 'absolute',
    width: '100%',
  },

  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  rightIcon: {
    left: 10,
  },
});

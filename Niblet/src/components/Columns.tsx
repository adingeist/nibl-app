import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type ColumnsType = {
  children: React.ReactNode[];
  spacing?: number;
  style?: StyleProp<ViewStyle>;
};

export const Columns = ({ children, style, spacing = 5 }: ColumnsType) => {
  const colCount = useMemo(() => children.length, [children.length]);

  return (
    <View style={[styles.container, style]}>
      {children.map((child, index) => {
        return (
          <View
            style={[
              {
                marginLeft: index === 0 ? 0 : spacing,
                marginRight: index === colCount - 1 ? 0 : spacing,
              },
              styles.child,
            ]}
            key={index}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  child: {
    flex: 1,
  },
});

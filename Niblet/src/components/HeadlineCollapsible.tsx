import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { AppCollapsible } from '@src/components/AppCollapsible';
import { Headline } from '@src/components/Headline';

type HeadlineCollapsibleProps = { headline: string } & Omit<
  ComponentProps<typeof AppCollapsible>,
  'headerComponent'
>;

export const HeadlineCollapsible = ({
  headline,
  children,
}: HeadlineCollapsibleProps) => {
  return (
    <AppCollapsible
      containerStyle={styles.collapsible}
      headerComponent={<Headline style={styles.headline}>{headline}</Headline>}
    >
      {children}
    </AppCollapsible>
  );
};

const styles = StyleSheet.create({
  collapsible: {
    marginVertical: 10,
  },

  headline: {
    marginBottom: 0,
  },
});

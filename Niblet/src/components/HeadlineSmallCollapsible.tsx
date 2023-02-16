import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { AppCollapsible } from '@src/components/AppCollapsible';
import { HeadlineSmall } from '@src/components/HeadlineSmall';

type HeadlineCollapsibleProps = { headline: string } & Omit<
  ComponentProps<typeof AppCollapsible>,
  'headerComponent'
>;

export const HeadlineSmallCollapsible = ({
  headline,
  children,
  ...props
}: HeadlineCollapsibleProps) => {
  return (
    <AppCollapsible
      containerStyle={styles.collapsible}
      headerComponent={
        <HeadlineSmall variant="headlineSmall">{headline}</HeadlineSmall>
      }
      {...props}
    >
      {children}
    </AppCollapsible>
  );
};

const styles = StyleSheet.create({
  collapsible: {
    marginVertical: 6,
  },

  headline: {
    marginBottom: 0,
  },
});

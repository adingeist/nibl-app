import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { Text } from 'react-native-paper';

import { MainAppScreenProps } from '@src/types/navigation';
import { MONTHS } from '@src/locales/calendar';
import { CalendarDay } from '@src/components/calendar/CalendarDay';

export const CalendarScreen = ({
  navigation,
}: MainAppScreenProps<'Calendar'>) => {
  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: '' });
  });

  const handleMonthChange = useCallback(
    (date: DateData) => {
      const month = MONTHS[date.month - 1];

      navigation.setOptions({
        headerLeft: () => (
          <Text variant="bodyLarge">
            {month} {date.year}
          </Text>
        ),
      });
    },
    [navigation],
  );

  return (
    <CalendarList
      dayComponent={CalendarDay}
      calendarStyle={styles.calendar}
      hideExtraDays={false}
      horizontal
      onMonthChange={handleMonthChange}
      pagingEnabled
      renderHeader={() => null}
      showSixWeeks
      theme={{ weekVerticalMargin: 0 }}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

import { useCalendarSize } from '@src/hooks/useCalendarSize';
import { useTheme } from '@src/hooks/useTheme';
import React, { ComponentType, useMemo } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { DateData } from 'react-native-calendars';
import { DayProps } from 'react-native-calendars/src/calendar/day';
import { Text } from 'react-native-paper';

const isDateBefore = (date1: Date, date2: Date) =>
  date1.getTime() < date2.getTime();

const isSameDay = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const TODAY = new Date();

export const CalendarDayComponent:
  | ComponentType<DayProps & { date?: DateData | undefined }>
  | undefined = ({ date, state, marking }) => {
  const styles = useCalendarDayStyles();
  const theme = useTheme();

  const isToday = useMemo(() => {
    if (!date) return false;

    const calDate = new Date(date.year, date.month - 1, date.day);

    return isSameDay(calDate, TODAY);
  }, [date]);

  const isSelected = useMemo(() => marking?.selected, [marking?.selected]);

  const isInPast = useMemo(() => {
    if (!date) return false;

    const calDate = new Date(date.year, date.month - 1, date.day + 1);

    return isDateBefore(calDate, TODAY);
  }, [date]);

  const isExtraDay = useMemo(() => state === 'disabled', [state]);

  const handleDayPress = () => {
    // if (marking && marking.recipes) {
    //   navigation.navigate('DayDetails', {
    //     day: dateString,
    //     recipes: marking.recipes,
    //   });
    // }
  };

  return (
    <Pressable
      style={[
        styles.container_normal,
        isExtraDay ? styles.container_extraDay : {},
        isInPast ? styles.container_inPast : {},
        isToday ? styles.container_today : {},
        isSelected ? styles.container_selected : {},
      ]}
      onPress={handleDayPress}
    >
      <View
        style={[
          styles.dayContainer,
          { backgroundColor: isToday ? theme.colors.primary : undefined },
        ]}
      >
        <Text
          style={[
            styles.text_normal,
            isExtraDay ? styles.text_extraDay : {},
            isInPast ? styles.text_inPast : {},
            isToday ? styles.text_today : {},
            isSelected ? styles.text_selected : {},
          ]}
        >
          {date?.day || 'x'}
        </Text>
      </View>
      {/* {marking && marking.recipes && (
        <View style={styles.recipesContainer}>
          {marking.recipes.map((recipe) => (
            <RecipeOnCalendar
              inPast={isInPast}
              key={`${dateString}-${recipe._id}`}
              recipe={recipe}
            />
          ))}
        </View>
      )} */}
    </Pressable>
  );
};

const useCalendarDayStyles = () => {
  const { colors } = useTheme();
  const calendarSize = useCalendarSize();

  return StyleSheet.create({
    dayContainer: {
      width: 23,
      height: 23,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 2,
      borderRadius: 30,
    },

    recipesContainer: { overflow: 'hidden', flex: 1, width: '100%' },

    container_normal: {
      alignItems: 'center',
      borderRadius: 0,
      borderWidth: 0.5,
      justifyContent: 'flex-start',
      borderColor: colors.light,
      width: calendarSize.dayWidth,
      height: calendarSize.dayHeight,
    },
    container_extraDay: {},
    container_inPast: { backgroundColor: colors.extraLight },
    container_today: {},
    container_selected: {
      backgroundColor: 'hsla(199, 100%, 92%, 1)',
      borderColor: 'hsla(199, 100%, 75%, 1)',
    },

    text_normal: {},
    text_extraDay: { color: colors.medium },
    text_inPast: { color: colors.medium },
    text_today: { color: colors.background },
    text_selected: {},
  });
};

export const CalendarDay = React.memo(CalendarDayComponent);

import { Dimensions } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import Constants from 'expo-constants';

export const useCalendarSize = () => {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const CALENDAR_HEIGHT =
    Dimensions.get('window').height -
    tabBarHeight -
    headerHeight -
    Constants.statusBarHeight +
    6;
  const dayHeight = CALENDAR_HEIGHT / 6;
  const dayWidth = Dimensions.get('window').width / 7;
  const CALENDAR_Y = Constants.statusBarHeight;

  return {
    CALENDAR_HEIGHT,
    CALENDAR_Y,
    dayHeight,
    dayWidth,
  };
};

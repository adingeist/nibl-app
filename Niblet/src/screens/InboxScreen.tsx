import React, { Reducer, useCallback, useReducer } from 'react';
import { Text } from 'react-native-paper';

import { FlatList, StyleSheet } from 'react-native';
import { Headline } from '@src/components/Headline';
import { ListedNotification } from '@src/components/ListedNotification';
import { MainAppScreenProps } from '@src/types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { notificationApi } from '@src/api/notifications';
import { NotificationResponse } from '@shared/types/responses/Notification';
import { Screen } from '@src/components/Screen';
import { useApi } from '@src/hooks/useApi';
import { useOnMount } from '@src/hooks/useOnMount';
import { useTheme } from '@src/hooks/useTheme';

type StateType = {
  notifications: NotificationResponse[];
  onPage: number;
  pageCount: number | undefined;
};

type ActionType = {
  type: 'ADD_NOTIFICATION_PAGE';
  notifications: NotificationResponse[];
  pageCount: number;
};

const reducer: Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION_PAGE':
      return {
        ...state,
        notifications: [...state.notifications, ...action.notifications],
        onPage: state.onPage + 1,
        pageCount: action.pageCount,
      };

    default:
      return state;
  }
};

export const InboxScreen = ({ navigation }: MainAppScreenProps<'Inbox'>) => {
  const { colors } = useTheme();
  const [state, dispatch] = useReducer(reducer, {
    notifications: [],
    onPage: 0,
    pageCount: 0,
  });
  const getNotificationsApi = useApi(notificationApi.getNotifications);

  const fetchNotifications = useCallback(async () => {
    const res = await getNotificationsApi.request({
      query: { page: state.onPage, perPage: 12 },
    });

    if (res.ok && res.data) {
      dispatch({
        type: 'ADD_NOTIFICATION_PAGE',
        notifications: res.data.notifications,
        pageCount: res.data.pageCount,
      });
    }
  }, [getNotificationsApi, state.onPage]);

  useOnMount(() => {
    fetchNotifications();
  });

  if (state.notifications.length === 0 && state.pageCount !== undefined) {
    return (
      <Screen addPadding style={styles.screen}>
        <MaterialCommunityIcons
          name="emoticon-confused-outline"
          size={40}
          color={colors.medium}
        />
        <Headline style={styles.centerText}>No notifications yet!</Headline>
        <Text style={styles.centerText} variant="bodyMedium">
          {`Your notifications will appear here after engaging in the community`}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen addPadding>
      <FlatList
        data={state.notifications}
        renderItem={({ item }) => (
          <ListedNotification navigation={navigation} notification={item} />
        )}
        keyExtractor={(notification) => notification.id}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
  },

  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatList: {
    flex: 1,
  },
});

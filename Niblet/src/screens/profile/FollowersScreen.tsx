import React, { Reducer, useCallback, useEffect, useReducer } from 'react';
import { FlatList } from 'react-native';

import { MainAppScreenProps } from '@src/types/navigation';
import { useApi } from '@src/hooks/useApi';
import { followersApi } from '@src/api/followers';
import { FollowerListItem } from '@src/components/profile/FollowerListItem';
import { NoResults } from '@src/components/NoResults';
import { PostedByDtoType } from '@shared/types/dto/PostedByDto';

type StateType = {
  followers: PostedByDtoType[] | undefined;
  onPage: number;
  pageCount: number | undefined;
};

type ActionType = {
  type: 'PUSH_FOLLOWERS_PAGE';
  followers: PostedByDtoType[];
  pageCount: number;
};

const reducer: Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case 'PUSH_FOLLOWERS_PAGE': {
      const newFollowers = state.followers ? [...state.followers] : [];
      newFollowers.push(...action.followers);

      return {
        followers: newFollowers,
        onPage: state.onPage + 1,
        pageCount: action.pageCount,
      };
    }

    default:
      return state;
  }
};

const initialState: StateType = {
  onPage: 0,
  followers: undefined,
  pageCount: undefined,
};

export const FollowersScreen = ({ route }: MainAppScreenProps<'Followers'>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getFollowersApi = useApi(followersApi.getFollowers);

  const getFollowers = useCallback(async () => {
    if (getFollowersApi.isLoading) {
      return;
    }

    const res = await getFollowersApi.request({
      params: { id: route.params.userId },
      query: { page: state.onPage },
    });

    console.log(res.data);

    if (res.ok && res.data) {
      dispatch({
        type: 'PUSH_FOLLOWERS_PAGE',
        followers: res.data.followers,
        pageCount: res.data.pageCount,
      });
    }
  }, [getFollowersApi, route.params.userId, state.onPage]);

  useEffect(() => {
    getFollowers();
  }, []);

  return (
    <>
      {(state.followers && state.followers.length === 0 && (
        <NoResults>No followers</NoResults>
      )) || (
        <FlatList
          data={state.followers}
          renderItem={({ item }) => <FollowerListItem user={item} />}
        />
      )}
    </>
  );
};

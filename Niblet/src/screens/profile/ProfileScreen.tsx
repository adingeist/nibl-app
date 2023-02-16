import React, {
  createRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from 'react';
import {
  MaterialTabBar,
  OnTabChangeCallback,
  Tabs,
} from 'react-native-collapsible-tab-view';

import {
  OpenProfilePostHandler,
  postThumbnailHeight,
  postThumbnailWidth,
} from '@src/components/profile/PostThumbnail';
import {
  Animated,
  DeviceEventEmitter,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FeedNibDtoType } from '@shared/types/dto/Nib.entity';
import { FeedRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { IGetUserProfile } from '@shared/types/routes/users.controller';
import { MainAppScreenProps } from '@src/types/navigation';
import { MediaListTab } from '@src/components/profile/MediaListTab';
import { NavigationButton } from '@src/components/navigation/NavigationButton';
import { PostCardFlatList } from '@src/components/PostCardFlatList';
import { ProfileHeader } from '@src/components/profile/ProfileHeader';
import { useApi } from '@src/hooks/useApi';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { usersApi } from '@src/api/users';
import { useSignedInAuth } from '@src/auth/useAuthContext';
import { useTheme } from '@src/hooks/useTheme';
import { BackButton } from '@src/components/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PopUpFeed } from '@src/components/PopUpFeed';
import { TabName } from 'react-native-collapsible-tab-view/lib/typescript/types';
import { likeApi } from '@src/api/like';
import { findIndexOfId } from '@src/util/findIndexOfId';
import { useOnMount } from '@src/hooks/useOnMount';

const ANIMATION_SPEED = 300;

type TabNames = 'Recipes' | 'Nibs';

type StateType = {
  userProfile?: IGetUserProfile['res'];
  userRecipes: FeedRecipeDtoType[];
  userNibs: FeedNibDtoType[];

  recipePageCount: number;
  nibPageCount: number;

  /** Current pagination status for the get recipes endpoint */
  onRecipePage: number;
  /** Current pagination status for the get nibs endpoint */
  onNibPage: number;

  activeTab: TabNames;
};

function likePost<T extends FeedRecipeDtoType | FeedNibDtoType>(
  arr: T[],
  postIndex: number,
  postId: string,
): T[] {
  const arrCopy = [...arr];
  const isLiked = arrCopy[postIndex].post.requesterLiked;

  if (isLiked) {
    arrCopy[postIndex].post.likeCount -= 1;
    arrCopy[postIndex].post.requesterLiked = false;
    likeApi.unlikePost({ params: { id: postId } });
  } else {
    arrCopy[postIndex].post.likeCount += 1;
    arrCopy[postIndex].post.requesterLiked = true;
    likeApi.likePost({ params: { id: postId } });
  }

  return arrCopy;
}

type ActionType =
  | {
      type: 'LIKE_POST';
      postId: string;
    }
  | {
      type: 'DELETE_POST';
      postId: string;
    }
  | { type: 'SET_PROFILE'; profile: IGetUserProfile['res'] }
  | { type: 'ADD_NIBS'; nibs: StateType['userNibs']; nibPageCount: number }
  | {
      type: 'ADD_RECIPES';
      recipes: StateType['userRecipes'];
      recipePageCount: number;
    }
  | { type: 'CHANGE_TAB'; newTab: TabNames };

const reducer = (state: StateType, action: ActionType): StateType => {
  const findIndexInRecipesOrNibs = (
    postId: string,
  ): [number, null | 'recipe' | 'nib'] => {
    let type: 'recipe' | 'nib' | null = 'recipe';
    let index = findIndexOfId(state.userRecipes, postId);

    if (index === -1) {
      type = 'nib';
      index = findIndexOfId(state.userNibs, postId);
    }

    if (index === -1) {
      type = null;
    }

    return [index, type];
  };

  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, userProfile: action.profile };

    case 'ADD_RECIPES':
      return {
        ...state,
        userRecipes: [...state.userRecipes, ...action.recipes],
        recipePageCount: action.recipePageCount,
        onRecipePage: state.onRecipePage + 1,
      };

    case 'ADD_NIBS':
      return {
        ...state,
        userNibs: [...state.userNibs, ...action.nibs],
        nibPageCount: action.nibPageCount,
        onNibPage: state.onNibPage + 1,
      };

    case 'LIKE_POST': {
      const [index, postType] = findIndexInRecipesOrNibs(action.postId);

      return {
        ...state,
        userRecipes:
          postType === 'recipe'
            ? likePost(state.userRecipes, index, action.postId)
            : state.userRecipes,
        userNibs:
          postType === 'nib'
            ? likePost(state.userNibs, index, action.postId)
            : state.userNibs,
      };
    }

    case 'CHANGE_TAB':
      return { ...state, activeTab: action.newTab };

    case 'DELETE_POST': {
      const [index, postType] = findIndexInRecipesOrNibs(action.postId);

      let userRecipes = state.userRecipes;
      let userNibs = state.userNibs;

      if (postType === 'recipe') {
        userRecipes = [...userRecipes]; // clone array to assign mem address
        userRecipes.splice(index, 1);
      } else if (postType === 'nib') {
        userNibs = [...userNibs];
        userNibs.splice(index, 1);
      }

      return {
        ...state,
        userRecipes,
        userNibs,
      };
    }

    default:
      return state;
  }
};

const initialState: StateType = {
  nibPageCount: 0,
  onNibPage: 0,
  onRecipePage: 0,
  recipePageCount: 0,
  userNibs: [],
  userProfile: undefined,
  userRecipes: [],
  activeTab: 'Recipes',
};

const OtherProfileHeader = () => (
  <NavigationButton name="dots-horizontal" size={24} />
);

const MyProfileHeader = ({
  navigation,
}: {
  navigation: MainAppScreenProps<'Profile'>['navigation'];
}) => {
  const goToSettings = () => navigation.navigate('UserSettings');

  return <NavigationButton name="cog" onPress={goToSettings} />;
};

export const ProfileScreen = ({
  navigation,
  route,
}: MainAppScreenProps<'Profile'>) => {
  const { user } = useSignedInAuth();
  const profileUsername = route.params?.username
    ? route.params.username
    : user.username;

  const theme = useTheme();
  const getUserProfileApi = useApi(usersApi.getUserProfile);
  const getRecipesApi = useApi(usersApi.getUserRecipes);
  const getNibsApi = useApi(usersApi.getUserNibs);
  const [state, dispatch] = useReducer(reducer, initialState);
  const tabBarHeight = useBottomTabBarHeight();
  const popUpFeedRef = createRef<PopUpFeed>();
  const listViewXY = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const { top: safeAreaTop } = useSafeAreaInsets();
  const listViewWidthHeight = useRef(
    new Animated.ValueXY({ x: 0, y: 0 }),
  ).current;
  const pan = useRef(new Animated.ValueXY()).current as Animated.ValueXY & {
    x: { _value: number };
    y: { _value: number };
  };
  const flatListRef = useRef<PostCardFlatList>(null);

  useEffect(() => {
    const tabPressListener = DeviceEventEmitter.addListener(
      'profileTabDoublePress',
      () => {
        popUpFeedRef.current?.swipeAwayPostView();
      },
    );

    return () => {
      tabPressListener.remove();
    };
  });

  // Set header based on the user's ownership of the profile
  useLayoutEffect(() => {
    navigation.setOptions({
      title: profileUsername,
      headerRight:
        profileUsername === user.username
          ? () => <MyProfileHeader navigation={navigation} />
          : () => <OtherProfileHeader />,
    });
  }, [navigation, profileUsername, user.username]);

  const isOnLastPage = useCallback(
    (onPage: number, pageCount: number) => onPage > Math.max(pageCount - 1, 1),
    [],
  );

  const getRecipes = useCallback(async () => {
    if (
      isOnLastPage(state.onRecipePage, state.recipePageCount) ||
      getRecipesApi.isLoading
    ) {
      return;
    }

    const res = await getRecipesApi.request({
      params: { username: profileUsername },
      query: { page: state.onRecipePage },
    });

    if (res.ok && res.data) {
      dispatch({
        type: 'ADD_RECIPES',
        recipes: res.data.recipes,
        recipePageCount: res.data.pageCount,
      });
    }
  }, [
    getRecipesApi,
    isOnLastPage,
    profileUsername,
    state.onRecipePage,
    state.recipePageCount,
  ]);

  const getNibs = useCallback(async () => {
    if (
      isOnLastPage(state.onNibPage, state.nibPageCount) ||
      getNibsApi.isLoading
    ) {
      return;
    }

    const res = await getNibsApi.request({
      params: { username: profileUsername },
      query: { page: state.onNibPage },
    });

    if (res.ok && res.data) {
      dispatch({
        type: 'ADD_NIBS',
        nibs: res.data.nibs,
        nibPageCount: res.data.pageCount,
      });
    }
  }, [
    getNibsApi,
    isOnLastPage,
    profileUsername,
    state.nibPageCount,
    state.onNibPage,
  ]);

  const getProfile = useCallback(async () => {
    if (getUserProfileApi.isLoading) {
      return;
    }

    const res = await getUserProfileApi.request({
      params: { username: profileUsername },
    });
    if (res.ok && res.data) {
      dispatch({ type: 'SET_PROFILE', profile: res.data });
    }
  }, [getUserProfileApi, profileUsername]);

  // Fetch profile data, recipes, and nibs on mount
  useOnMount(() => {
    getProfile();
    getRecipes();
    getNibs();
  });

  const handleOpenImage: OpenProfilePostHandler = (index, postType, x, y) => {
    listViewXY.setValue({ x, y });
    listViewWidthHeight.setValue({
      x: postThumbnailWidth,
      y: postThumbnailHeight,
    });
    pan.setValue({
      x: 0,
      y: 0,
    });

    flatListRef.current?.scrollToIndex({ index, animated: false });
    flatListRef.current?.setActiveIndexTo(index);

    Animated.timing(listViewWidthHeight, {
      toValue: {
        x: Dimensions.get('window').width,
        y: Dimensions.get('window').height - tabBarHeight,
      },
      useNativeDriver: false,
      duration: ANIMATION_SPEED,
    }).start();
    Animated.timing(listViewXY, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      duration: ANIMATION_SPEED,
    }).start();
  };

  const toggleLike = (postId: string) => {
    dispatch({ type: 'LIKE_POST', postId });
  };

  const handleTabChange: OnTabChangeCallback<TabName> = useCallback((tab) => {
    dispatch({ type: 'CHANGE_TAB', newTab: tab.tabName as TabNames });
  }, []);

  const handleDelete = useCallback((postId: string) => {
    dispatch({ type: 'DELETE_POST', postId });
  }, []);

  return (
    <>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.background,
            paddingTop: safeAreaTop,
            paddingHorizontal: theme.screenMargin,
          },
        ]}
      >
        <>
          <BackButton />
          <Text style={styles.headerText}>{profileUsername}</Text>
          {profileUsername === user.username ? (
            <MyProfileHeader navigation={navigation} />
          ) : (
            <OtherProfileHeader />
          )}
        </>
      </View>

      <Tabs.Container
        onTabChange={handleTabChange}
        TabBarComponent={(props) => (
          <MaterialTabBar
            {...props}
            labelStyle={{ color: theme.colors.primary }}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
          />
        )}
        renderHeader={(props) => (
          <ProfileHeader
            username={profileUsername}
            user={state.userProfile}
            {...props}
          />
        )}
      >
        <Tabs.Tab name={'Recipes' as TabNames}>
          <MediaListTab
            onOpenImage={handleOpenImage}
            onEndReached={getRecipes}
            data={state.userRecipes}
          />
        </Tabs.Tab>
        <Tabs.Tab name={'Nibs' as TabNames}>
          <MediaListTab
            onOpenImage={handleOpenImage}
            onEndReached={getNibs}
            data={state.userNibs}
          />
        </Tabs.Tab>
      </Tabs.Container>

      <PopUpFeed
        data={
          state.activeTab === 'Recipes' ? state.userRecipes : state.userNibs
        }
        ref={popUpFeedRef}
        flatListRef={flatListRef}
        listViewWidthHeight={listViewWidthHeight}
        listViewXY={listViewXY}
        pan={pan}
        toggleLike={toggleLike}
        onDelete={handleDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 3,
    elevation: 3,
    flexDirection: 'row',
    height: 88,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
  },
});

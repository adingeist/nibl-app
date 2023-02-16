import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, FlatList, Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

import { AppAvatar } from '@src/components/AppAvatar';
import { Bold } from '@src/components/Bold';
import { Direction } from '@src/components/recipe/Direction';
import { FullRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { getDurationText } from '@src/util/getDurationText';
import { Headline } from '@src/components/Headline';
import { IngredientListing } from '@src/components/recipe/IngredientListing';
import { LinkText } from '@src/components/LinkText';
import { MainAppScreenProps } from '@src/types/navigation';
import { NutritionDisplay } from '@src/components/NutritionDisplay';
import {
  PostThumbnail,
  postThumbnailHeight,
} from '@src/components/profile/PostThumbnail';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@src/hooks/useTheme';
import { RecipeIngredientDtoType } from '@shared/types/dto/RecipeIngredient.entity';
import { NoResults } from '@src/components/NoResults';
import { FeedNibDtoType } from '@shared/types/dto/Nib.entity';
import NotFoundScreen from '@src/screens/NotFoundScreen';
import { useApi } from '@src/hooks/useApi';
import { recipesApi } from '@src/api/recipes';

const IMAGE_EXPANDED_HEIGHT = 300;
const IMAGE_COLLAPSED_HEIGHT = 0;

const pluralize = (num: number, label: string) => {
  return `${num} ${label}${num === 1 ? '' : 's'}`;
};

export const RecipeDetailsScreen = ({
  navigation,
  route,
}: MainAppScreenProps<'Recipe'>) => {
  const [recipe, setRecipe] = useState<FullRecipeDtoType | undefined | null>(
    undefined,
  );
  const [nibs, setNibs] = useState<FeedNibDtoType[] | undefined>(undefined);
  const theme = useTheme();
  const getNibsApi = useApi(recipesApi.getNibs);
  const getRecipeApi = useApi(recipesApi.getRecipe);
  const scrollY = useRef(new Animated.Value(0)).current;

  const goToProfile = (username: string) => {
    navigation.navigate('Profile', { username });
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, IMAGE_EXPANDED_HEIGHT - IMAGE_COLLAPSED_HEIGHT],
    outputRange: [IMAGE_EXPANDED_HEIGHT, IMAGE_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const duration = useMemo(
    () => (recipe ? getDurationText(recipe.minuteDuration) : 0),
    [recipe],
  );

  const goToIngredientDetail = useCallback(
    (ingredient: RecipeIngredientDtoType) => {
      navigation.navigate('FoodDetails', {
        brandName: ingredient.food.brand?.name,
        foodName: ingredient.food.name,
        foodId: ingredient.food.id,
      });
    },
    [navigation],
  );

  const navigateToUploadNib = useCallback(() => {
    if (!recipe) return;

    navigation.navigate('UploadNavigator', {
      screen: 'VideoEditor',
      params: { navigateNextTo: 'CreateNib', recipe },
    });
  }, [navigation, recipe]);

  const onOpenImage = () => {
    console.log('Open image');
  };

  // On mount, load the recipe and its nibs
  useEffect(() => {
    const getRecipe = async () => {
      const res = await getRecipeApi.request({
        params: { id: route.params.id },
      });

      if (res.ok) {
        setRecipe(res.data);
      } else {
        setRecipe(null);
      }
    };
    const getNibs = async () => {
      const res = await getNibsApi.request({
        params: { id: route.params.id },
        query: { page: 0, perPage: 3 },
      });

      if (res.ok && res.data) {
        setNibs(res.data.nibs);
      } else {
        setNibs([]);
      }
    };

    getRecipe();
    getNibs();
  }, []);

  if (recipe === null) {
    return <NotFoundScreen />;
  }

  if (!recipe) {
    return null;
  }

  return (
    <ScrollView
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: scrollY,
              },
            },
          },
        ],
        { useNativeDriver: false },
      )}
      scrollEventThrottle={16}
      bounces={false}
    >
      <Text
        style={[{ marginHorizontal: theme.screenMargin }, styles.title]}
        variant="headlineLarge"
      >
        {recipe.title}
      </Text>

      <Animated.View style={[{ height: headerHeight }, styles.imageContainer]}>
        <View style={styles.rightOfImageContainer}>
          <View style={[styles.listItem, styles.postedByContainer]}>
            <AppAvatar
              style={styles.listItemIcon}
              size={25}
              uri={recipe.post.postedBy.profileImage}
            />
            <LinkText
              onPress={() => goToProfile(recipe.post.postedBy.username)}
              variant="bodyMedium"
            >
              {recipe.post.postedBy.username}
            </LinkText>
          </View>

          <View style={styles.listItem}>
            <MaterialCommunityIcons
              name="clock"
              size={25}
              color={theme.colors.dark}
              style={styles.listItemIcon}
            />
            <Text variant="bodyMedium">{duration}</Text>
          </View>

          <View style={styles.listItem}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={25}
              color={theme.colors.dark}
              style={styles.listItemIcon}
            />
            <Text variant="bodyMedium">
              {pluralize(recipe.servingsPerRecipe || 0, 'serving')}
            </Text>
          </View>

          <View style={styles.socialListItems}>
            <View style={styles.listItem}>
              <MaterialCommunityIcons
                name="heart"
                size={25}
                color={theme.colors.dark}
                style={styles.listItemIcon}
              />
              <Text variant="bodyMedium">
                {pluralize(recipe.post.likeCount, 'like')}
              </Text>
            </View>
            <View style={styles.listItem}>
              <MaterialCommunityIcons
                name="silverware"
                size={25}
                color={theme.colors.dark}
                style={styles.listItemIcon}
              />
              <Text variant="bodyMedium">
                {pluralize(recipe.nibCount, 'nib')}
              </Text>
            </View>
          </View>
        </View>

        <Image style={styles.image} source={{ uri: recipe.post.banner }} />
      </Animated.View>

      <Animated.View
        style={[
          {
            shadowColor: theme.colors.dark,
            shadowOpacity: scrollY.interpolate({
              inputRange: [IMAGE_COLLAPSED_HEIGHT, IMAGE_EXPANDED_HEIGHT],
              outputRange: [0, 0.4],
              extrapolate: 'clamp',
            }),
            backgroundColor: theme.colors.background,
          },
          styles.recipeInfoContainer,
        ]}
      >
        <Headline addPadding style={styles.headline}>
          Ingredients
        </Headline>
        {recipe.ingredients.map((ingredient) => (
          <IngredientListing
            onPress={() => goToIngredientDetail(ingredient)}
            foodName={ingredient.food.name}
            brand={ingredient.food.brand?.name}
            imageUri={ingredient.food.image}
            key={ingredient.id}
            note={ingredient.ingredientNote}
            quantity={ingredient.quantity}
            unit={ingredient.unit}
            style={{
              borderBottomColor: theme.colors.light,
            }}
          />
        ))}

        <Headline addPadding style={styles.headline}>
          Directions
        </Headline>
        {recipe.directions.map((direction, index) => (
          <Direction body={direction.body} index={index} key={direction.id} />
        ))}

        <Headline addPadding style={styles.headline}>
          Nutrition
        </Headline>
        <View style={{ paddingLeft: theme.screenMargin }}>
          <Text style={styles.servingSizeText} variant="bodyMedium">
            <Bold>Serving size</Bold> {recipe.servingSizeQuantity}{' '}
            {recipe.servingSizeUnit}
          </Text>
          <Text variant="bodyMedium">
            <Bold>Servings per recipe</Bold>{' '}
            {pluralize(recipe.servingsPerRecipe, 'serving')}
          </Text>
          <NutritionDisplay nutrients={recipe.nutrients} />
        </View>

        <Headline addPadding style={styles.headline}>
          Nibs
        </Headline>
        <View style={[{ height: postThumbnailHeight }, styles.nibsContainer]}>
          {!nibs && <ActivityIndicator animating={true} />}
          {nibs && nibs.length === 0 && <NoResults>No Nibs</NoResults>}
          {nibs && nibs.length > 0 && (
            <FlatList
              data={nibs}
              showsVerticalScrollIndicator={false}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <PostThumbnail
                  onOpenImage={onOpenImage}
                  index={index}
                  item={item}
                />
              )}
            />
          )}
        </View>
        <Button
          onPress={navigateToUploadNib}
          style={[
            { marginHorizontal: theme.screenMargin },
            styles.nibRecipeButton,
          ]}
          mode="contained"
        >
          Nib Recipe
        </Button>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 14,
  },

  imageContainer: {
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
  },

  image: {
    flex: 1,
    height: IMAGE_EXPANDED_HEIGHT,
  },

  postedByContainer: {
    marginBottom: 15,
  },

  headline: {
    marginTop: 20,
  },

  nibsContainer: {
    width: '100%',
    justifyContent: 'center',
  },

  rightOfImageContainer: {
    flex: 1,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },

  listItemIcon: {
    marginLeft: 14,
    marginRight: 7,
  },

  socialListItems: {
    marginTop: 15,
  },

  nibRecipeButton: {
    marginBottom: 50,
  },

  recipeInfoContainer: {
    shadowRadius: 20,
  },

  servingSizeText: {
    marginVertical: 3,
  },
});

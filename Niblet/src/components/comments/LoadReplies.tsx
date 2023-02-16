import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';
import { LinkText } from '@src/components/LinkText';
import { useTheme } from '@src/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type LoadRepliesProps = {
  id: string;
  isLoading: boolean;
  isVisible: boolean;
  onLoadCommentReplies: (commentId: string) => void;
};

const LoadRepliesComponent = ({
  id,
  isLoading,
  isVisible,
  onLoadCommentReplies,
}: LoadRepliesProps) => {
  const theme = useTheme();

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {(isLoading && (
        <ActivityIndicator animating color={theme.colors.primary} />
      )) || (
        <View style={styles.textContainer}>
          <MaterialCommunityIcons
            size={20}
            color={theme.colors.dark}
            name="chevron-right"
          />
          <LinkText
            style={{
              color: theme.colors.dark,
            }}
            variant="bodySmall"
            onPress={() => onLoadCommentReplies(id)}
          >
            Load replies
          </LinkText>
        </View>
      )}
    </View>
  );
};

export const LoadReplies = React.memo(LoadRepliesComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    marginLeft: 55,
    width: 100,
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

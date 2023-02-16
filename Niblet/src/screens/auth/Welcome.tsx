import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import React from 'react';
import { LinkText } from '@src/components/LinkText';
import { useNavigation } from '@react-navigation/native';
import { AuthNavParams } from './AuthNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { NibletLogoHeader } from '@src/components/NibletLogoHeader';

export const Welcome = () => {
  const { colors } = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<AuthNavParams, 'Welcome'>>();

  const handleNavigateSignUp = () => navigation.navigate('SignUp');

  const handleNavigateLogin = () => navigation.navigate('Login');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <NibletLogoHeader />
      </View>
      <View style={styles.signUpContainer}>
        <Text variant="headlineLarge">
          Get connected to the sweetest community.
        </Text>
        <Text
          style={[styles.subHeadline, { color: colors.dark }]}
          variant="bodyMedium"
        >{`Share what's good,\nand what's not.`}</Text>
        <Button onPress={handleNavigateSignUp} mode="contained">
          Sign Up
        </Button>
      </View>
      <Text variant="bodyMedium">
        Already have an account?{' '}
        <LinkText variant="bodyMedium" onPress={handleNavigateLogin}>
          Log in.
        </LinkText>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  header: { alignItems: 'center' },
  signUpContainer: { width: '100%', paddingHorizontal: 24, marginBottom: 50 },
  subHeadline: { marginVertical: 10 },
});

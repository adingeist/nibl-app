import { useEffect } from 'react';
import { BackHandler } from 'react-native';

// Functional component that does not have any place on the DOM. It simply
// disables the ᐊ Android back button.

export default function DisableAndroidBack(): null {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  return null;
}

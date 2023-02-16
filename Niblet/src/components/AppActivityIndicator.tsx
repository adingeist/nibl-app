import React from 'react';
import LottieView from 'lottie-react-native';

type AppActivityIndicator = {
  size: number;
};

const AppActivityIndicatorComponent = ({ size }: AppActivityIndicator) => {
  return (
    <LottieView
      autoPlay
      loop
      source={require('@src/assets/animations/loader.json')}
      style={{ height: size }}
      speed={1}
    />
  );
};

export const AppActivityIndicator = React.memo(AppActivityIndicatorComponent);

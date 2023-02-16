import React, { ComponentProps } from 'react';
import {
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

type DoubleTapProps = {
  onDoubleTap: () => void;
} & ComponentProps<typeof TapGestureHandler>;

export const DoubleTap = ({
  onDoubleTap,
  children,
  ...props
}: DoubleTapProps) => {
  const handleDoubleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onDoubleTap();
    }
  };

  return (
    <TapGestureHandler
      numberOfTaps={2}
      onHandlerStateChange={handleDoubleTap}
      {...props}
    >
      {children}
    </TapGestureHandler>
  );
};

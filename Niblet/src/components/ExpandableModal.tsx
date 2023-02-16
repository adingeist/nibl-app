import { useNavigation } from '@react-navigation/native';
import { KeyboardAccessoryView } from '@src/components/KeyboardAccessoryView';
import { useKeyboard } from '@src/hooks/useKeyboard';
import { useTheme } from '@src/hooks/useTheme';
import React, {
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  PanResponder,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type ExpandableModal = React.ElementRef<typeof ExpandableModal>;

type ExpandableModalProps = {
  children: React.ReactNode;
  keyboardAccessoryChildren?: React.ReactNode;
  backdropOpacity?: number;
  backgroundStyle?: StyleProp<ViewStyle>;
  /**
   * Percent height of screen to snap to
   * @example [0.5,0.9] will snap to 50% and 90%
   */
  snapPoints: number[];
};

type ExpandableModalHandle = {
  maximize: () => void;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CLOSE_BAR_MARGIN_VERTICAL = 18;
const ANIMATION_SPEED = 200;

const ExpandableModalComponent: ForwardRefRenderFunction<
  ExpandableModalHandle,
  ExpandableModalProps
> = (
  {
    children,
    backgroundStyle,
    snapPoints,
    backdropOpacity = 0.7,
    keyboardAccessoryChildren,
  },
  ref,
) => {
  const initialBgHeight = windowHeight / 2;
  const theme = useTheme();
  const bgHeight = useRef(new Animated.Value(initialBgHeight)).current;
  const navigation = useNavigation();
  const keyboard = useKeyboard();

  const maximizeModal = () => {
    Animated.timing(bgHeight, {
      toValue: snapPointYFromBottom[sortedSnapPoints.length - 1],
      useNativeDriver: false,
      duration: ANIMATION_SPEED,
    }).start();
  };

  const sortedSnapPoints = useMemo(
    () => snapPoints.sort((a, b) => a - b),
    [snapPoints],
  );

  const snapPointYFromBottom = useMemo(
    () => sortedSnapPoints.map((point) => point * windowHeight),
    [sortedSnapPoints],
  );

  const bgHeightPercent = useMemo(
    () => Animated.divide(bgHeight, new Animated.Value(windowHeight)),
    [bgHeight],
  );

  const animatedBackdropOpacity = useMemo(() => {
    const maxOpacity = new Animated.Value(backdropOpacity);

    return Animated.divide(
      Animated.multiply(
        maxOpacity,
        Animated.diffClamp(bgHeightPercent, 0, sortedSnapPoints[0]),
      ),
      new Animated.Value(sortedSnapPoints[0]),
    );
  }, [backdropOpacity, bgHeightPercent, sortedSnapPoints]);

  const animatedAccessoryOpacity = useMemo(() => {
    return Animated.divide(
      bgHeightPercent,
      new Animated.Value(sortedSnapPoints[0]),
    );
  }, [bgHeightPercent, sortedSnapPoints]);

  // Animate modal in whenever visible
  useEffect(() => {
    Animated.timing(bgHeight, {
      toValue: snapPointYFromBottom[0],
      duration: ANIMATION_SPEED,
      useNativeDriver: false,
    }).start();
  }, []);

  const closeModal = () => {
    Keyboard.dismiss();

    Animated.timing(bgHeight, {
      toValue: 0,
      useNativeDriver: false,
      duration: ANIMATION_SPEED,
    }).start();

    setTimeout(() => {
      navigation.goBack();
    }, ANIMATION_SPEED);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderMove: (event) => {
        const touchYFromBottom = windowHeight - event.nativeEvent.pageY;

        if (keyboard.isShown) {
          Keyboard.dismiss();
        }

        Animated.timing(bgHeight, {
          toValue: touchYFromBottom,
          useNativeDriver: false,
          duration: 0,
        }).start();
      },

      onPanResponderRelease: (event, gestureState) => {
        const touchYFromBottom = windowHeight - event.nativeEvent.pageY;

        if (
          gestureState.vy > 1 ||
          touchYFromBottom < snapPointYFromBottom[0] / 2
        ) {
          // Quick flick down or below half of lowest set point
          closeModal();
        } else if (gestureState.vy < -1) {
          // Quick flick up
          maximizeModal();
        } else {
          // Snap to nearest snap point
          let closestSnapPoint = snapPointYFromBottom[0];
          let closestSnapDistance = Number.MAX_VALUE;
          snapPointYFromBottom.forEach((point) => {
            const snapDistance = Math.abs(touchYFromBottom - point);
            if (snapDistance < closestSnapDistance) {
              closestSnapDistance = snapDistance;
              closestSnapPoint = point;
            }
          });
          Animated.timing(bgHeight, {
            toValue: closestSnapPoint,
            useNativeDriver: false,
            duration: ANIMATION_SPEED,
          }).start();
        }
      },

      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  useImperativeHandle(ref, () => ({
    maximize() {
      maximizeModal();
    },
  }));

  return (
    <View style={styles.modal}>
      <Animated.View
        style={[
          {
            backgroundColor: theme.colors.backdrop,
            opacity: animatedBackdropOpacity,
          },
          styles.backdrop,
        ]}
      >
        <Pressable style={styles.backdropPressable} onPress={closeModal} />
      </Animated.View>

      <Animated.View
        style={[
          {
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: theme.roundness,
            borderTopRightRadius: theme.roundness,
            height: bgHeight,
          },
          styles.background,
          backgroundStyle,
        ]}
      >
        <View
          {...panResponder.panHandlers}
          hitSlop={{
            bottom: CLOSE_BAR_MARGIN_VERTICAL,
            top: CLOSE_BAR_MARGIN_VERTICAL,
            left: windowWidth / 2,
            right: windowWidth / 2,
          }}
          style={[
            {
              backgroundColor: theme.colors.medium,
              borderRadius: theme.roundness,
            },
            styles.closeBar,
          ]}
        />
        {children}
      </Animated.View>

      {keyboardAccessoryChildren && (
        <>
          <KeyboardAccessoryView>
            <View
              style={[
                {
                  backgroundColor: theme.colors.background,
                  height: windowHeight,
                },
                styles.tabHider,
              ]}
            />
            <Animated.View
              style={{
                opacity: animatedAccessoryOpacity,
              }}
            >
              {keyboardAccessoryChildren}
            </Animated.View>
          </KeyboardAccessoryView>
        </>
      )}
    </View>
  );
};

const ExpandableModalForwardRef = React.forwardRef(ExpandableModalComponent);

export const ExpandableModal = React.memo(ExpandableModalForwardRef);

const styles = StyleSheet.create({
  modal: {
    marginTop: 'auto',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },

  background: {
    width: '100%',
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
  },

  backdropPressable: {
    width: '100%',
    flex: 1,
  },

  closeBar: {
    width: 50,
    height: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: CLOSE_BAR_MARGIN_VERTICAL,
  },

  tabHider: {
    width: '100%',
    position: 'absolute',
  },
});

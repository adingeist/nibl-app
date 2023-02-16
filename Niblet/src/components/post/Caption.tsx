import React, { createRef, useEffect, useRef, useState } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  TextLayoutEventData,
} from 'react-native';
import { Text } from 'react-native-paper';

import { LinkText } from '@src/components/LinkText';

const EXPANDED_HEIGHT = 250;

type CaptionProps = {
  animationSpeed: number;
  isCaptionExpanded: boolean;
  setIsCaptionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export const Caption = ({
  animationSpeed,
  children,
  isCaptionExpanded,
  setIsCaptionExpanded,
}: CaptionProps) => {
  const [text, setText] = useState(children);
  const [condensedText, setCondensedText] = useState<JSX.Element>();
  const viewHeight = useRef(new Animated.Value(45.7)).current;
  const scroll_ref = createRef<ScrollView>();
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  useEffect(() => {
    if (isCaptionExpanded) {
      setText(children);
      Animated.timing(viewHeight, {
        toValue: EXPANDED_HEIGHT,
        useNativeDriver: false,
        duration: animationSpeed,
      }).start();
    } else if (condensedText) {
      // eslint-disable-next-line id-length
      scroll_ref.current?.scrollTo({ y: 0, animated: false });
      Animated.timing(viewHeight, {
        toValue: 45.7,
        useNativeDriver: false,
        duration: animationSpeed,
      }).start(() => setText(condensedText));
    }
  }, [
    animationSpeed,
    children,
    condensedText,
    isCaptionExpanded,
    scroll_ref,
    viewHeight,
  ]);

  const handleTextLayout = (
    data: NativeSyntheticEvent<TextLayoutEventData>
  ) => {
    if (data.nativeEvent.lines.length > 2) {
      const last = data.nativeEvent.lines[data.nativeEvent.lines.length - 1];
      if (last.y + last.height > EXPANDED_HEIGHT) setIsScrollEnabled(true);
      else setIsScrollEnabled(false);
    } else setIsScrollEnabled(false);

    if (
      !isCaptionExpanded &&
      data.nativeEvent.lines[0] &&
      data.nativeEvent.lines[1] &&
      data.nativeEvent.lines[2]
    ) {
      const line0 = data.nativeEvent.lines[0].text;
      let line1 = data.nativeEvent.lines[1].text;
      line1 = line1
        .substring(0, line1.length - '... See more'.length)
        .trimEnd();
      setCondensedText(
        <>
          <Text variant="bodyMedium" style={styles.moreDots}>
            {line0 + line1 + '... '}
          </Text>
          <LinkText onPress={() => setIsCaptionExpanded(true)}>
            See more
          </LinkText>
        </>
      );
    }
  };

  return (
    <Animated.View style={{ maxHeight: viewHeight }}>
      <ScrollView
        ref={scroll_ref}
        scrollEnabled={isScrollEnabled}
        overScrollMode={'never'}
        scrollsToTop={!isCaptionExpanded}
        showsVerticalScrollIndicator={false}
        onStartShouldSetResponder={() => true}
      >
        <Pressable>
          <Text
            variant="bodyMedium"
            style={styles.caption}
            onTextLayout={handleTextLayout}
          >
            {text}
          </Text>
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
};

const styles = {
  moreDots: {
    color: '#fff',
  },

  caption: {
    color: '#fff',
  },
};

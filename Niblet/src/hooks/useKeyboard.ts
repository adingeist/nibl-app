import { useEffect, useRef } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

type useKeyboardProps = {
  onKeyboardDidHide?: (event: KeyboardEvent) => void;
  onKeyboardDidShow?: (event: KeyboardEvent) => void;
  onKeyboardWillShow?: (event: KeyboardEvent) => void;
  onKeyboardWillHide?: (event: KeyboardEvent) => void;
};

export const useKeyboard = ({
  onKeyboardDidShow,
  onKeyboardWillShow,
  onKeyboardWillHide,
  onKeyboardDidHide,
}: useKeyboardProps = {}) => {
  const isMounted = useRef(false);
  const isShown = useRef(false);

  const kbShowLis = Keyboard.addListener('keyboardWillShow', (event) => {
    if (isMounted.current) {
      isShown.current = true;

      if (onKeyboardWillShow) {
        onKeyboardWillShow(event);
      }
    }
  });

  const kbDidShowLis = Keyboard.addListener('keyboardDidShow', (event) => {
    if (isMounted.current) {
      isShown.current = true;

      if (onKeyboardDidShow) {
        onKeyboardDidShow(event);
      }
    }
  });

  const kbDidHideLis = Keyboard.addListener('keyboardDidHide', (event) => {
    if (isMounted.current) {
      isShown.current = false;

      if (onKeyboardDidHide) {
        onKeyboardDidHide(event);
      }
    }
  });

  const kbHideLis = Keyboard.addListener('keyboardWillHide', (event) => {
    if (isMounted.current) {
      isShown.current = false;

      if (onKeyboardWillHide) {
        onKeyboardWillHide(event);
      }
    }
  });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      kbShowLis.remove();
      kbHideLis.remove();
      kbDidShowLis.remove();
      kbDidHideLis.remove();
    };
  }, [kbHideLis, kbShowLis, kbDidShowLis, kbDidHideLis]);

  return { isShown: isShown };
};

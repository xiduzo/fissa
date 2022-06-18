import {useRef} from 'react';
import {GestureResponderEvent} from 'react-native';

interface SwipeProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipe = (
  {onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp}: SwipeProps,
  triggerAmount = 50,
) => {
  const xRef = useRef(0);
  const yRef = useRef(0);

  const touchStart = (event: GestureResponderEvent) => {
    const {
      nativeEvent: {pageX, pageY},
    } = event;

    xRef.current = pageX;
    yRef.current = pageY;
  };

  const touchEnd = (event: GestureResponderEvent) => {
    const {
      nativeEvent: {pageX, pageY},
    } = event;

    if (pageX + triggerAmount < xRef.current) {
      onSwipeLeft && onSwipeLeft();
    }

    if (pageX - triggerAmount > xRef.current) {
      onSwipeRight && onSwipeRight();
    }

    if (pageY + triggerAmount < yRef.current) {
      onSwipeUp && onSwipeUp();
    }

    if (pageY - triggerAmount > yRef.current) {
      onSwipeDown && onSwipeDown();
    }
  };

  return {
    touchStart,
    touchEnd,
  };
};

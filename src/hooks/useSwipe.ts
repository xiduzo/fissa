import {useRef} from 'react';
import {GestureResponderEvent, PanResponder} from 'react-native';

interface SwipeProps {
  onSwipeLeft?: (event: GestureResponderEvent) => void;
  onSwipeRight?: (event: GestureResponderEvent) => void;
  onSwipeUp?: (event: GestureResponderEvent) => void;
  onSwipeDown?: (event: GestureResponderEvent) => void;
}

export const useSwipe = (
  {onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp}: SwipeProps,
  triggerAmount = 100,
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
      onSwipeLeft && onSwipeLeft(event);
    }

    if (pageX - triggerAmount > xRef.current) {
      onSwipeRight && onSwipeRight(event);
    }

    if (pageY + triggerAmount < yRef.current) {
      onSwipeUp && onSwipeUp(event);
    }

    if (pageY - triggerAmount > yRef.current) {
      onSwipeDown && onSwipeDown(event);
    }
  };

  return {
    touchStart,
    touchEnd,
  };
};

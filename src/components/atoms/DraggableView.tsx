import React, {FC, useRef} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';

interface DraggableViewProps extends ViewProps {}

const touchThreshold = 20;
const DraggableView: FC<DraggableViewProps> = ({children, ...viewProps}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    // https://stackoverflow.com/a/44671267/4655177
    onMoveShouldSetPanResponder: (e, gestureState) => {
      const {dx, dy} = gestureState;

      return Math.abs(dx) > touchThreshold || Math.abs(dy) > touchThreshold;
    },
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: pan.x,
          dy: pan.y,
        },
      ],
      {
        useNativeDriver: false,
      },
    ),
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: {x: 0, y: 0},
        bounciness: 6,
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout()]}
      {...viewProps}>
      {children}
    </Animated.View>
  );
};

export default DraggableView;

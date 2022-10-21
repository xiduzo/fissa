import React, {FC, forwardRef, useImperativeHandle, useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import Button from '../../components/atoms/Button';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';

interface RoomBackToTopProps {
  scrollRef: React.RefObject<any>;
}

export interface RoomBackToTopRef {
  scroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const SCROLL_TOP_OFFSET = -100;
const RoomBackToTop = forwardRef<RoomBackToTopRef, RoomBackToTopProps>(
  ({scrollRef}, ref) => {
    const backTopTopAnimation = useRef(
      new Animated.Value(SCROLL_TOP_OFFSET),
    ).current;

    useImperativeHandle(ref, () => ({
      scroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        scroll(event);
      },
    }));

    const animateBackToTop = (
      config?: Partial<Animated.SpringAnimationConfig>,
    ) => {
      Animated.spring(backTopTopAnimation, {
        toValue: SCROLL_TOP_OFFSET,
        useNativeDriver: false,
        ...(config ?? {}),
      }).start();
    };

    const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollHeight = event.nativeEvent.contentOffset.y;

      if (scrollHeight < 500) return animateBackToTop();

      animateBackToTop({
        toValue: 32,
      });
    };

    const scrollToTop = () => {
      scrollRef.current?.scrollToIndex({
        index: 0,
        viewOffset: 500,
      });
    };

    return (
      <Animated.View
        style={[
          styles.backToTop,
          {
            bottom: backTopTopAnimation,
          },
        ]}>
        <Button
          title="Back to top"
          variant="outlined"
          size="small"
          inverted
          onPress={scrollToTop}
          end={<ArrowUpIcon />}
        />
      </Animated.View>
    );
  },
);

export default RoomBackToTop;

const styles = StyleSheet.create({
  backToTop: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

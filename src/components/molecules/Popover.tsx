import React, {FC, useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  ModalProps,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSwipe} from '../../hooks/useSwipe';
import {Color} from '../../lib/types/Theme';
import BottomDrawer from '../atoms/BottomDrawer';
import DraggableView from '../atoms/DraggableView';

export interface PopOverProps extends ModalProps {
  title?: JSX.Element;
}

const Popover: FC<PopOverProps> = ({
  children,
  style,
  onRequestClose,
  title,
  ...props
}) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const animate = useCallback(
    (config?: Partial<Animated.TimingAnimationConfig>) => {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
        ...(config ?? {}),
      }).start();
    },
    [],
  );

  const close = (event: NativeSyntheticEvent<any>) => {
    animate();
    onRequestClose && onRequestClose(event);
  };

  const {touchStart, touchEnd, isActive} = useSwipe({
    onSwipeDown: close,
  });

  useEffect(() => {
    props.visible
      ? animate({toValue: 1, duration: 300, delay: 250})
      : animate();

    return animate;
  }, [props.visible, animate]);

  return (
    <SafeAreaView style={{flex: 1, position: 'absolute'}}>
      <Modal
        animationType="slide"
        transparent
        {...props}
        onRequestClose={close}
        style={style}>
        <View style={styles.view}>
          <DraggableView onTouchStart={touchStart} onTouchEnd={touchEnd}>
            <BottomDrawer
              title={title}
              action={close}
              style={{
                borderRadius: isActive ? 24 : 0,
              }}>
              {children}
            </BottomDrawer>
          </DraggableView>
          {fadeAnimation && (
            <Animated.View
              style={[
                styles.backdrop,
                {
                  opacity: fadeAnimation,
                },
              ]}>
              <LinearGradient
                onTouchStart={close}
                colors={[Color.dark + '80', Color.dark + '80']}
                style={styles.backdrop}
              />
            </Animated.View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Popover;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  view: {
    height: '100%',
    justifyContent: 'flex-end',
  },
});

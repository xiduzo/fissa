import {FC, useCallback, useEffect, useRef} from 'react';
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
import {Color} from '../../types/Color';
import BottomDrawer from '../atoms/BottomDrawer';

interface PopOverProps extends ModalProps {
  title?: JSX.Element;
}

const Popover: FC<PopOverProps> = ({
  children,
  style,
  onRequestClose,
  title,
  ...props
}) => {
  const fadeAnim = useRef(new Animated.Value(0));

  const animate = useCallback(
    (config?: Partial<Animated.TimingAnimationConfig>) => {
      Animated.timing(fadeAnim.current, {
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

  const {touchStart, touchEnd} = useSwipe({onSwipeDown: close});

  useEffect(() => {
    props.visible
      ? animate({toValue: 1, duration: 300, delay: 300})
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
          {
            <View onTouchStart={touchStart} onTouchEnd={touchEnd}>
              <BottomDrawer title={title} action={close}>
                {children}
              </BottomDrawer>
            </View>
          }
          {fadeAnim.current && (
            <Animated.View
              style={[
                styles.backdrop,
                {
                  opacity: fadeAnim.current,
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
  card: {
    padding: 12,
    paddingBottom: 72,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    paddingHorizontal: 12,
  },
  actions: {
    flexDirection: 'row',
  },
});

import React, {FC, useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  ModalProps,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from '../../types/Color';
import BottomDrawer from '../atoms/BottomDrawer';
import IconButton from '../atoms/IconButton';
import CLoseIcon from '../atoms/icons/CloseIcon';
import QuestionMarkIcon from '../atoms/icons/QuestionMarkIcon';

interface PopOverProps extends ModalProps {
  back?: () => void;
  backdrop?: boolean;
}

const Popover: FC<PopOverProps> = ({
  children,
  style,
  onRequestClose,
  back,
  backdrop = true,
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

  const close = () => {
    animate();
    onRequestClose && onRequestClose();
  };

  useEffect(() => {
    props.visible
      ? animate({toValue: 1, duration: 300, delay: 300})
      : animate();

    return animate;
  }, [props.visible, animate]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal
        animationType="slide"
        transparent
        {...props}
        onRequestClose={close}
        style={style}>
        <View style={styles.view}>
          <BottomDrawer back={back} close={close}>
            {children}
          </BottomDrawer>
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

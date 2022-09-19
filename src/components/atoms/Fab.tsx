import {FC, useRef} from 'react';
import {
  Animated,
  ButtonProps,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from '../../types/Color';

interface FabProps extends ButtonProps {
  scale?: number;
}

const Fab: FC<FabProps> = ({children, scale = 1, ...props}) => {
  const scaleAnimation = useRef(new Animated.Value(scale)).current;

  Animated.spring(scaleAnimation, {
    toValue: scale,
    bounciness: 8,
    useNativeDriver: true,
  }).start();

  return (
    <TouchableHighlight style={styles.container} {...props}>
      <Animated.View style={{transform: [{scale: scaleAnimation}]}}>
        <LinearGradient {...Color.gradient} style={styles.gradient}>
          {children}
        </LinearGradient>
      </Animated.View>
    </TouchableHighlight>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 999,
    borderRadius: 16,
  },
  gradient: {
    padding: 12,
    borderRadius: 16,
  },
});

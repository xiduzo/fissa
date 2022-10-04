import {FC} from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import {VectorImageProps} from 'react-native-vector-image';
import {Color} from '../../types/Theme';
import IconButton from './IconButton';
import CLoseIcon from './icons/CloseIcon';
import {IconProps} from './icons/_Icon';

interface BottomDrawerProps extends Omit<LinearGradientProps, 'colors'> {
  title?: JSX.Element;
  action?: (event: GestureResponderEvent) => void;
  actionIcon?: FC<IconProps>;
}

const BottomDrawer: FC<BottomDrawerProps> = ({
  title,
  action,
  children,
  style,
  actionIcon,
}) => {
  const Icon = actionIcon || CLoseIcon;
  return (
    <LinearGradient {...Color.gradient} style={[styles.card, style]}>
      <View
        style={[
          styles.actions,
          {
            justifyContent: title ? 'space-between' : 'flex-end',
          },
        ]}>
        {title}
        {action && (
          <IconButton title="close" onPress={action} variant="contained">
            <Icon color="dark" scale={0.6} />
          </IconButton>
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
};

export default BottomDrawer;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    paddingHorizontal: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import {Color} from '../../types/Color';
import IconButton from './IconButton';
import CLoseIcon from './icons/CloseIcon';

interface BottomDrawerProps extends Omit<LinearGradientProps, 'colors'> {
  title?: JSX.Element;
  close?: () => void;
}

const BottomDrawer: FC<BottomDrawerProps> = ({
  title,
  close,
  children,
  style,
}) => {
  return (
    <LinearGradient {...Color.gradient} style={[styles.card, style]}>
      <View
        style={[
          styles.actions,
          {
            justifyContent: title ? 'space-between' : 'flex-end',
            alignItems: 'center',
          },
        ]}>
        {title}
        {close && (
          <IconButton title="close" onPress={close} variant="contained">
            <CLoseIcon
              style={{tintColor: Color.dark, transform: [{scale: 0.6}]}}
            />
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
  },
});

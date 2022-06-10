import React, {FC} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import {Color} from '../../types/Color';
import IconButton from './IconButton';
import CLoseIcon from './icons/CloseIcon';
import QuestionMarkIcon from './icons/QuestionMarkIcon';

interface BottomDrawerProps extends Omit<LinearGradientProps, 'colors'> {
  back?: () => void;
  close?: () => void;
}

const BottomDrawer: FC<BottomDrawerProps> = ({
  back,
  close,
  children,
  style,
  ...props
}) => {
  return (
    <LinearGradient {...Color.gradient} style={[styles.card, style]}>
      <View
        style={[
          styles.actions,
          {
            justifyContent: back ? 'space-between' : 'flex-end',
          },
        ]}>
        {back && (
          <IconButton title="back" variant="contained">
            <QuestionMarkIcon style={{tintColor: Color.dark}} />
          </IconButton>
        )}
        {close && (
          <IconButton title="close" onPress={close} variant="contained">
            <CLoseIcon style={{tintColor: Color.dark}} />
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
    display: 'flex',
    flexDirection: 'row',
  },
});

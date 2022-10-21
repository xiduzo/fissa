import React, {FC} from 'react';
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LetterLogo from '../molecules/LetterLogo';

interface BaseViewProps {
  style?: StyleProp<ViewStyle>;
  inverted?: boolean;
  noPadding?: boolean;
}

const BaseView: FC<BaseViewProps> = ({style, noPadding, children}) => {
  return (
    <Animated.View style={[styles.container, style]}>
      <View style={[styles.content, {paddingHorizontal: noPadding ? 0 : 24}]}>
        {children}
      </View>
      <LetterLogo />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});

export default BaseView;

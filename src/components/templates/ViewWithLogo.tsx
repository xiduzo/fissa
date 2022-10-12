import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

interface BaseViewProps {
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
}

const BaseView: FC<BaseViewProps> = ({style, noPadding, children}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, {paddingHorizontal: noPadding ? 0 : 24}]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflowX: 'hidden',
  },
  content: {
    // backgroundColor: 'green',
    flex: 1,
  },
});

export default BaseView;
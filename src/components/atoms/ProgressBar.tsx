import React, {FC} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from '../../types/Color';

interface ProgressBarProps extends ViewProps {
  progress?: number;
}

const ProgressBar: FC<ProgressBarProps> = ({progress, style, ...props}) => {
  if (!progress) return null;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: Color.light + '20',
          borderRadius: 4,
          overflow: 'hidden',
        },
        style,
      ]}>
      <LinearGradient
        {...Color.gradient}
        style={{
          flex: progress,
          height: 6,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
        }}
      />
      <View style={{flex: 1 - progress}} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});

import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from 'react-native';

interface ScrollViewWithHeaderTitleProps extends ScrollViewProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
  scrollHeightTrigger?: number;
  title?: string;
}

const ScrollViewWithHeaderTitle: FC<ScrollViewWithHeaderTitleProps> = ({
  navigation,
  children,
  scrollHeightTrigger,
  title,
  onScroll,
  ...props
}) => {
  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (onScroll) {
      onScroll(event);
    }

    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < (scrollHeightTrigger ?? 35)) {
      return navigation.setOptions({headerTitle: undefined});
    }

    navigation.setOptions({headerTitle: title});
  };

  return (
    <ScrollView {...props} onScroll={scroll}>
      {children}
    </ScrollView>
  );
};

export default ScrollViewWithHeaderTitle;

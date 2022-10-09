import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import {ScrolledHeaderTitle} from './ScrolledHeaderTitle';

interface ScrollViewWithHeaderTitleProps extends ScrollViewProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
  scrollHeightTrigger?: number;
  title?: string;
}

const ScrollViewWithHeaderTitle: FC<ScrollViewWithHeaderTitleProps> = ({
  navigation,
  children,
  scrollHeightTrigger = 35,
  title,
  onScroll,
  ...props
}) => {
  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (onScroll) onScroll(event);
    if (!title) return;

    const scrollHeight = event.nativeEvent.contentOffset.y;

    navigation.setOptions({
      headerTitle: props => (
        <ScrolledHeaderTitle
          title={title}
          scrollPercentage={(scrollHeight / scrollHeightTrigger) * 100}
          {...props}
        />
      ),
    });
  };

  return (
    <ScrollView {...props} onScroll={scroll}>
      {children}
    </ScrollView>
  );
};

export default ScrollViewWithHeaderTitle;

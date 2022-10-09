import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  VirtualizedList,
  VirtualizedListProps,
} from 'react-native';
import {ScrolledHeaderTitle} from './ScrolledHeaderTitle';

interface VirtualizedListWithHeaderProps<T> extends VirtualizedListProps<T> {
  navigation: NativeStackNavigationProp<ParamListBase>;
  title: string;
  scrollHeightTrigger?: number;
}

function VirtualizedListWithHeader<T>({
  navigation,
  title,
  scrollHeightTrigger = 35,
  onScroll,
  ...props
}: VirtualizedListWithHeaderProps<T>): JSX.Element {
  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (onScroll) onScroll(event);

    const scrollHeight = event.nativeEvent.contentOffset.y;

    navigation.setOptions({
      headerTitle: props => {
        console.log(props);
        return (
          <ScrolledHeaderTitle
            title={title}
            scrollPercentage={(scrollHeight / scrollHeightTrigger) * 100}
            {...props}
          />
        );
      },
    });
  };

  return <VirtualizedList<T> {...props} onScroll={scroll} />;
}

export default VirtualizedListWithHeader;

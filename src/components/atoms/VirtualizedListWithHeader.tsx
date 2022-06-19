import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  VirtualizedList,
  VirtualizedListProps,
} from 'react-native';

interface VirtualizedListWithHeaderProps<T> extends VirtualizedListProps<T> {
  navigation: NativeStackNavigationProp<ParamListBase>;
  title?: string;
  scrollHeightTrigger?: number;
}

function VirtualizedListWithHeader<T>({
  navigation,
  title,
  scrollHeightTrigger,
  onScroll,
  ...props
}: VirtualizedListWithHeaderProps<T>): JSX.Element {
  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (onScroll) onScroll(event);

    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < (scrollHeightTrigger ?? 35)) {
      return navigation.setOptions({headerTitle: undefined});
    }

    navigation.setOptions({headerTitle: title});
  };

  return <VirtualizedList<T> {...props} onScroll={scroll} />;
}

export default VirtualizedListWithHeader;

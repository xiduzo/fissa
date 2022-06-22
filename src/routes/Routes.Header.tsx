import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {StackHeaderProps} from '@react-navigation/stack';
import React, {FC, useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import IconButton from '../components/atoms/IconButton';
import ArrowLeftIcon from '../components/atoms/icons/ArrowLeftIcon';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Color';

const Header: FC<NativeStackHeaderProps | StackHeaderProps> = ({
  options,
  navigation,
}) => {
  const backAnimation = useRef(new Animated.Value(0));
  const animateTitle = useRef(new Animated.Value(-80));
  const prefHeaderTitle = useRef(options.headerTitle);
  const canGoBack = navigation.canGoBack();

  const goBack = () => {
    if (!canGoBack) {
      return;
    }
    navigation.goBack();
  };

  useEffect(() => {
    const animate = (config?: Partial<Animated.TimingAnimationConfig>) => {
      Animated.timing(backAnimation.current, {
        toValue: 0,
        duration: 0,
        delay: 0,
        useNativeDriver: false,
        ...(config ?? {}),
      }).start();
    };

    canGoBack ? animate({toValue: 1, duration: 150, delay: 120}) : animate();

    return animate;
  }, [canGoBack]);

  useEffect(() => {
    const animate = (config?: Partial<Animated.TimingAnimationConfig>) => {
      Animated.timing(animateTitle.current, {
        toValue: -80,
        duration: 100,
        delay: 0,
        useNativeDriver: false,
        ...(config ?? {}),
      }).start(() => {
        prefHeaderTitle.current = options.headerTitle;
      });
    };

    options.headerTitle ? animate({toValue: 0, duration: 300}) : animate();

    return animate;
  }, [options.headerTitle]);

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: options.headerTitle
            ? Color.light + '20'
            : Color.dark,
        },
      ]}>
      <Animated.View style={{opacity: backAnimation.current}}>
        <IconButton onPress={goBack} title={options.title ?? ''}>
          <ArrowLeftIcon />
        </IconButton>
      </Animated.View>
      <Animated.View
        style={{
          marginBottom: animateTitle.current,
        }}>
        <Typography variant="h4">
          {options.headerTitle ?? prefHeaderTitle.current}
        </Typography>
      </Animated.View>
      {options.headerRight ? (
        options.headerRight({canGoBack})
      ) : (
        <View style={{width: 24}} />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.dark,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
});

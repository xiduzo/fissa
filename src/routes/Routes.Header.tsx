import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {StackHeaderProps} from '@react-navigation/stack';
import {FC, useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import IconButton from '../components/atoms/IconButton';
import ArrowLeftIcon from '../components/atoms/icons/ArrowLeftIcon';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Theme';

const Header: FC<NativeStackHeaderProps | StackHeaderProps> = ({
  options,
  navigation,
  ...props
}) => {
  const backAnimation = useRef(new Animated.Value(0)).current;
  const canGoBack = navigation.canGoBack();

  const goBack = () => {
    if (!canGoBack) return;
    navigation.goBack();
  };

  useEffect(() => {
    const animate = (config?: Partial<Animated.TimingAnimationConfig>) => {
      Animated.timing(backAnimation, {
        toValue: 0,
        duration: 0,
        delay: 0,
        useNativeDriver: false,
        ...config,
      }).start();
    };

    canGoBack ? animate({toValue: 1, duration: 150, delay: 120}) : animate();

    return animate;
  }, [canGoBack]);

  console.log(options.headerTitle);
  return (
    <View style={[styles.container]}>
      <Animated.View style={{opacity: backAnimation}}>
        <IconButton onPress={goBack} title={options.title ?? ''}>
          <ArrowLeftIcon />
        </IconButton>
      </Animated.View>
      {typeof options.headerTitle === 'string' && (
        <Typography variant="h4">{options.headerTitle}</Typography>
      )}
      {typeof options.headerTitle === 'function' &&
        options.headerTitle({
          children: '',
        })}
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
  },
});

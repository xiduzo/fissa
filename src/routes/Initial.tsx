import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import Logo from '../components/atoms/Logo';
import Button from '../components/atoms/Button';
import SpotifyIcon from '../components/atoms/icons/SpotifyIcon';
import Typography from '../components/atoms/Typography';
import {useSpotify} from '../providers/SpotifyProvider';
import {Color} from '../lib/types/Theme';
import {RootStackParamList} from '../lib/interfaces/StackParams';

interface InitialProps
  extends NativeStackScreenProps<RootStackParamList, 'Initial'> {}

const Initial: FC<InitialProps> = ({navigation}) => {
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const notSignedInAnimation = useRef(new Animated.Value(0)).current;
  const signedInAnimation = useRef(new Animated.Value(0)).current;
  const animationsDone = useRef(false);
  const [signingIn, setSigningIn] = useState(false);
  const canSkipToHome = useRef(false);

  const {auth, currentUser} = useSpotify();

  const signIn = async () => {
    try {
      setSigningIn(() => true);
      await auth();
      navigation.replace('Home');
    } finally {
      setSigningIn(() => false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    canSkipToHome.current = true;

    if (animationsDone.current) {
      navigation.replace('Home');
    }
  }, [currentUser]);

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      if (!canSkipToHome.current) {
        Animated.spring(notSignedInAnimation, {
          toValue: 1,
          useNativeDriver: false,
        }).start(() => {
          animationsDone.current = true;
        });
        return;
      }

      Animated.timing(signedInAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        animationsDone.current = true;
        navigation.replace('Home');
      });
    });
  }, [navigation]);

  const backgroundColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 0.4, 0.6, 1],
    outputRange: ['#000000', '#000000', Color.dark, Color.dark],
  });

  const colorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF90', Color.light],
  });

  const positionInterpolation = notSignedInAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  const translateInterpolation = notSignedInAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 0],
  });

  const scaleInterpolation = signedInAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1.75, 20],
  });

  const signedInTranslateInterpolation = signedInAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const opacityInterpolation = signedInAnimation.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: backgroundColorInterpolation},
      ]}>
      <View />

      <Logo
        style={{transform: [{scale: 1.75}]}}
        viewStyle={{
          marginTop: positionInterpolation,
          opacity: opacityInterpolation,
          transform: [
            {scale: scaleInterpolation},
            {translateY: signedInTranslateInterpolation},
          ],
        }}
        progress={colorAnimation}
      />
      <View>
        <Animated.View
          style={[
            styles.text,
            {
              opacity: notSignedInAnimation,
              transform: [{translateY: translateInterpolation}],
            },
          ]}>
          <Typography variant="h2" gutter>
            A collaborative live playlist
          </Typography>
          <Typography variant="h6">together with your friends</Typography>
        </Animated.View>
        <Animated.View
          style={{
            marginBottom: 48,
            opacity: notSignedInAnimation,
            transform: [{scale: notSignedInAnimation}],
          }}>
          <Button
            start={<SpotifyIcon color="dark" />}
            onPress={signIn}
            disabled={signingIn}
            size="small"
            title="Connect to get started"
          />
        </Animated.View>
        <Typography
          align="center"
          variant="bodyM"
          gutter={32}
          style={{color: colorInterpolation}}>
          Made by Milanovski and Xiduzo
        </Typography>
      </View>
    </Animated.View>
  );
};

export default Initial;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    alignItems: 'center',
    marginBottom: 150,
  },
});

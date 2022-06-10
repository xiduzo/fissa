import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import OnboardingSwiper from 'react-native-onboarding-swiper';
import Button from '../components/atoms/Button';
import ArrowLeftIcon from '../components/atoms/icons/ArrowLeftIcon';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Color';
import DotComponent from './Onboarding.DotComponent';
import OnboardingSlideOne from './Onboarding.SlideOne';
import OnboardingSlideThree from './Onboarding.SlideThree';
import OnboardingSlideTwo from './Onboarding.SlideTwo';
import {RootStackParamList} from './Routes';

interface OnboardingProps
  extends NativeStackScreenProps<RootStackParamList, 'Onboarding'> {}

const Onboarding: FC<OnboardingProps> = ({navigation}) => {
  const [showPagination, setShowPagination] = useState(true);

  const newPage = (index: number) => {
    setShowPagination(index < 2);
  };

  const finishOnboarding = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      {showPagination && (
        <TouchableHighlight onPress={finishOnboarding} style={styles.skip}>
          <Typography variant="h3">SKIP</Typography>
        </TouchableHighlight>
      )}
      {!showPagination && (
        <View style={styles.button}>
          <Button
            title="Yallah habibi"
            onPress={finishOnboarding}
            end={
              <ArrowLeftIcon
                style={{
                  tintColor: Color.dark,
                  marginLeft: 16,
                  transform: [{rotate: '180deg'}],
                }}
              />
            }
          />
        </View>
      )}
      <OnboardingSwiper
        showNext={false}
        showSkip={false}
        showPagination={showPagination}
        pageIndexCallback={newPage}
        imageContainerStyles={styles.image}
        DotComponent={DotComponent}
        pages={[
          {
            backgroundColor: Color.dark,
            image: <OnboardingSlideOne />,
            title: (
              <Typography variant="h2" style={{marginBottom: 16}}>
                A collaborative playlist
              </Typography>
            ),
            subtitle: (
              <Typography variant="body1">
                together with your friends
              </Typography>
            ),
          },
          {
            backgroundColor: Color.dark,
            image: <OnboardingSlideTwo />,
            title: (
              <Typography variant="h2" style={{marginBottom: 16}}>
                Add your favorite anthems
              </Typography>
            ),
            subtitle: (
              <Typography variant="body1">to funk up the party</Typography>
            ),
          },
          {
            backgroundColor: Color.dark,
            image: <OnboardingSlideThree />,
            title: (
              <Typography variant="h2" style={{marginBottom: 16}}>
                Up vote songs you like
              </Typography>
            ),
            subtitle: (
              <Typography variant="body1">
                or down vote those you do not like
              </Typography>
            ),
          },
        ]}
      />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    marginTop: -100,
  },
  button: {
    position: 'absolute',
    bottom: 80,
    zIndex: 999,
    width: '100%',
    paddingHorizontal: 24,
  },
  skip: {
    zIndex: 999,
    position: 'absolute',
    top: 74,
    right: 16,
  },
});

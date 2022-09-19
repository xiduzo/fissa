import {FC, useEffect, useRef} from 'react';
import {
  Animated,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import {Color} from '../../types/Color';
import Image from '../atoms/Image';
import Typography from '../atoms/Typography';

export interface ListItemProps extends TouchableWithoutFeedbackProps {
  imageUri?: string;
  title: string;
  subtitle: string;
  extra?: JSX.Element;
  imageStyle?: StyleProp<ImageStyle>;
  inverted?: boolean;
  hasBorder?: boolean;
  end?: JSX.Element;
  selected?: boolean;
}

const ListItem: FC<ListItemProps> = ({
  imageUri,
  title,
  subtitle,
  extra,
  end,
  imageStyle = {},
  inverted = false,
  hasBorder = false,
  selected = false,
  ...props
}) => {
  const selectedAnimation = useRef(new Animated.Value(0));
  useEffect(() => {
    const animate = (config?: Partial<Animated.SpringAnimationConfig>) => {
      Animated.spring(selectedAnimation.current, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: false,
        ...(config ?? {}),
      }).start();
    };

    selected ? animate({toValue: 1, bounciness: 12}) : animate();
  }, [selected]);

  const textOpacityInterpolation = selectedAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.4],
  });

  const backgroundOpacityInterpolation = selectedAnimation.current.interpolate({
    inputRange: [0, 1],

    outputRange: [Color.dark + '00', Color.dark + '80'],
  });

  const iconScaleInterpolation = selectedAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <TouchableWithoutFeedback accessibilityRole="button" {...props}>
      <View
        style={[
          styles.container,
          {
            borderColor: hasBorder ? Color.dark + '10' : 'transparent',
            borderWidth: 1,
            borderRadius: 12,
          },
          props.style,
        ]}>
        <View>
          <Image
            style={[
              styles.image,
              {
                borderTopRightRadius: hasBorder ? 0 : 12,
                borderBottomRightRadius: hasBorder ? 0 : 12,
                backgroundColor: Color.dark + (!imageUri ? 10 : 100),
              },
              imageStyle,
            ]}
            source={{
              uri: !!imageUri ? imageUri : DEFAULT_IMAGE,
            }}
          />
          <Animated.View
            style={[
              styles.selected,
              {
                backgroundColor: backgroundOpacityInterpolation,
              },
            ]}>
            <Animated.View
              style={{
                transform: [{scale: iconScaleInterpolation}],
              }}>
              <Typography style={{fontSize: 25, lineHeight: 35}}>✅</Typography>
            </Animated.View>
          </Animated.View>
        </View>
        <Animated.View
          style={{
            opacity: textOpacityInterpolation,
            flexShrink: 1,
            flexGrow: 1,
          }}>
          <Typography
            numberOfLines={2}
            variant="h4"
            style={{
              ...styles.title,
              color: inverted ? Color.dark : Color.light,
            }}>
            {title}
          </Typography>
          <Typography
            numberOfLines={1}
            style={{
              ...styles.subtitle,
              color: inverted ? Color.dark : Color.light,
            }}
            variant="bodyM">
            {subtitle}
          </Typography>
          {extra}
        </Animated.View>
        <Animated.View
          style={{
            opacity: textOpacityInterpolation,
            marginLeft: 4,
          }}>
          {end}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 12,
    maxWidth: '100%',
  },
  image: {
    marginRight: 16,
    width: 80,
    height: 80,
  },
  selected: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    width: 80,
    height: 80,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
});

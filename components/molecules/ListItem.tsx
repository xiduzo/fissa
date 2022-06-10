import React, {FC, useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';
import {Color} from '../../types/Color';
import Image from '../atoms/Image';
import Typography from '../atoms/Typography';

interface ListItemProps extends TouchableWithoutFeedbackProps {
  imageUri: string;
  title: string;
  subtitle: string;
  inverted?: boolean;
  hasBorder?: boolean;
  end?: JSX.Element;
  selected?: boolean;
}

const ListItem: FC<ListItemProps> = ({
  imageUri,
  title,
  subtitle,
  end,
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
        ]}>
        <View>
          <Image
            style={[
              styles.image,
              {
                borderTopRightRadius: hasBorder ? 0 : 12,
                borderBottomRightRadius: hasBorder ? 0 : 12,
              },
            ]}
            source={{
              uri: !!imageUri
                ? imageUri
                : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAYFBMVEX///8AAADLy8v+YyPU1NT19fXIyMjDw8Pf39/c3NxSUlKDg4OpqalVVVWcnJy4uLiioqIkJCR4eHhFRUVoaGhdXV3n5+f4///8VQD3w6/15trv7++ysrKVlZXzlnT0k3CpnqGfAAAChklEQVRoge2Y7baqIBCG1YMiKpqUtMtd+/7v8ijIV1aGMmefH74/WmuAHnWYGT6iaNeuXbt+Tynvx18gOPsmOGEE84Z8B39GjdiN3W6MladbExqeEoLTNOIRT9e/eJ8lRpnkoGQmJJ/oDO4X4VlsqxJtx3imo+ionLZsEZ4440vRVszhhegonbbEE16/h9eb4NK1dA6nogNtgbfRk68Xkv6K2g3wCUHmcPLksZ5wNf/NI1ulkRNbnvBcteaO26lp3wCvTDvSeIpMa7UBbtOjg2w6WE1uEvnCh4A2VUq8O9Vm8xj+/vA4PqkuNlpMWafZwGW4mP+2zHLzyVNARtKaDBOEVZ6VIt6Xa0talbWcMUOXPVOu1/aT9LSguqy8SrH+v8iYVFmCQR6e7C09YXy0sLLwaHE94SvhKi9lhdFekn5QVWX1kjcFhJwC981VQTy9+/97jSHRTgnp+nygt1YgfSh0LApaEmUSrnuw/eKjuBlV0qI4WmXhhZLXrkRdHHfPCM2nSaQyNF8cqaVK4+dwujhSi3rD42UPTtILqQdcvnqKK6zS+ny9XK7nyTAd3Qq4KNy1FSDn+9egH0mXoTPWmUO8Bh5TZrtoYP8Z9HV3XMGs9W9NPR/UDR1XwR7oV9sVtlbCx9J3UfBLZBXM4PBzWDiAW15M6Bgumyf0eSjeg4RiJ8xZEqlx25IIMv1BCxdkyYVZLECXOUehF2hbkFsL0E2Ru53Txx+xmd28ndN5HWwjCrqFBt38gx5b/uGBC/KoaB9yddnuAh1yQY/noBcLoFcioJc5oNdQsBdoga/+QC8tQa9bf0M5T3BSIVRhhDBfHu8lnhBEsr7PcpSj//P7d+3atSuA/gJGFyEE85BBNwAAAABJRU5ErkJggg==',
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
              <Typography style={[{fontSize: 25, lineHeight: 35}]}>
                ✅
              </Typography>
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
            style={[
              styles.title,
              {
                color: inverted ? Color.dark : Color.light,
              },
            ]}>
            {title}
          </Typography>
          <Typography
            numberOfLines={1}
            style={[
              styles.subtitle,
              {
                color: inverted ? Color.dark : Color.light,
              },
            ]}
            variant="bodyM">
            {subtitle}
          </Typography>
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
    display: 'flex',
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
    display: 'flex',
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

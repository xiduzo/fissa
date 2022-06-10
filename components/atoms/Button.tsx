import React, {FC} from 'react';
import {
  ButtonProps as NativeButtonProps,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import {Color} from '../../types/Color';
import Typography from './Typography';

export interface ButtonProps extends NativeButtonProps {
  inverted?: boolean;
  variant?: 'outlined';
  size?: 'small';
  end?: JSX.Element;
}

const Button: FC<ButtonProps> = ({
  title,
  inverted,
  variant,
  size,
  end,
  disabled,
  ...props
}) => {
  return (
    <TouchableHighlight {...props} style={{borderRadius: 12}}>
      <View
        style={[
          styles.view,
          {
            borderColor: variant === 'outlined' ? Color.main : 'transparent',
            backgroundColor: inverted ? Color.dark : Color.main,

            paddingHorizontal: size === 'small' ? 16 : 24,
            paddingRight: end ? 10 : 24,
            opacity: disabled ? 0.5 : 1,
            paddingVertical: size === 'small' ? (end ? 8 : 11.5) : 20,
          },
        ]}>
        <Typography
          variant={size === 'small' ? 'h6' : 'h3'}
          style={{
            color: inverted ? Color.light : Color.dark,
          }}>
          {title}
        </Typography>
        {end && <View style={styles.end}>{end}</View>}
      </View>
    </TouchableHighlight>
  );
};

export default Button;

const styles = StyleSheet.create({
  view: {
    borderWidth: 2,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  end: {
    marginLeft: 4,
  },
});

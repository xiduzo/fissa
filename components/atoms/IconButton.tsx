import React, {FC} from 'react';
import {ButtonProps, StyleSheet, TouchableHighlight} from 'react-native';
import {Color} from '../../types/Color';

export interface IconButtonProps extends ButtonProps {
  variant?: 'contained';
}

const IconButton: FC<IconButtonProps> = ({
  children,
  title,
  variant,
  ...props
}) => {
  return (
    <TouchableHighlight
      {...props}
      accessibilityLabel={title}
      underlayColor={
        variant === 'contained' ? Color.dark + '40' : 'transparent'
      }
      style={[
        styles.container,
        {
          backgroundColor:
            variant === 'contained' ? Color.dark + '20' : 'transparent',
        },
      ]}>
      {children}
    </TouchableHighlight>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
});

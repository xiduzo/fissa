import React, {FC} from 'react';
import {ButtonProps, StyleSheet, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from '../../types/Color';

interface FabProps extends ButtonProps {}

const Fab: FC<FabProps> = ({children, ...props}) => {
  return (
    <TouchableHighlight style={styles.container} {...props}>
      <LinearGradient {...Color.gradient} style={styles.gradient}>
        {children}
      </LinearGradient>
    </TouchableHighlight>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 999,
    borderRadius: 16,
  },
  gradient: {
    padding: 12,
    borderRadius: 16,
  },
});

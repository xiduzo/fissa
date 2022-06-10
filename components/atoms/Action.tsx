import React, {FC} from 'react';
import {ButtonProps, StyleSheet, TouchableHighlight, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from '../../types/Color';
import Typography from './Typography';

interface ActionProps extends ButtonProps {
  icon: JSX.Element;
  subtitle?: string;
  active?: boolean;
}

const Action: FC<ActionProps> = ({icon, title, subtitle, active, ...props}) => {
  return (
    <TouchableHighlight {...props} style={[styles.container]}>
      <View style={styles.content}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: active ? Color.dark : 'transparent',
            },
          ]}>
          {icon}
        </View>
        <View>
          <Typography variant="h4" style={[styles.text, {marginBottom: 4}]}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="bodyM" style={[styles.text, {opacity: 0.6}]}>
              {subtitle}
            </Typography>
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default Action;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Color.dark + '10',
    marginRight: 16,
  },
  text: {
    color: Color.dark,
  },
});

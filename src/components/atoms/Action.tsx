import React, {FC} from 'react';
import {ButtonProps, StyleSheet, TouchableHighlight, View} from 'react-native';
import {Color} from '../../types/Color';
import Typography from './Typography';

interface ActionProps extends ButtonProps {
  icon: JSX.Element;
  subtitle?: string;
  active?: boolean;
  inverted?: boolean;
}

const Action: FC<ActionProps> = ({
  icon,
  title,
  subtitle,
  active,
  inverted,
  ...props
}) => {
  return (
    <TouchableHighlight
      {...props}
      underlayColor="transparent"
      style={[styles.container]}>
      <View style={styles.content}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: active
                ? inverted
                  ? Color.dark
                  : Color.light
                : 'transparent',
              borderColor: (inverted ? Color.dark : Color.light) + '10',
            },
          ]}>
          {icon}
        </View>
        <View
          style={{
            opacity: props.disabled ? 0.3 : 1,
          }}>
          <Typography
            variant="h4"
            style={{
              marginBottom: 4,
              color: inverted ? Color.dark : Color.light,
            }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="bodyM"
              style={{
                opacity: 0.6,
                color: inverted ? Color.dark : Color.light,
              }}>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 12,
    marginRight: 16,
  },
});

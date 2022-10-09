import {FC} from 'react';
import {ButtonProps, StyleSheet, TouchableHighlight, View} from 'react-native';
import {Color} from '../../types/Theme';
import Typography from './Typography';

interface ActionProps extends Omit<ButtonProps, 'color'> {
  icon: JSX.Element;
  subtitle?: string;
  active?: boolean;
  inverted?: boolean;
  hidden?: boolean;
}

const Action: FC<ActionProps> = ({
  icon,
  title,
  subtitle,
  active,
  inverted,
  hidden,
  ...props
}) => {
  if (hidden) return null;

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
              opacity: props.disabled ? 0.7 : 1,
            },
          ]}>
          {icon}
        </View>
        <View
          style={{
            opacity: props.disabled ? 0.7 : 1,
          }}>
          <Typography
            variant="h4"
            color={inverted ? 'dark' : 'light'}
            style={{marginBottom: 4}}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="bodyM"
              color={inverted ? 'dark' : 'light'}
              style={{opacity: 0.6}}>
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

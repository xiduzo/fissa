import {FC} from 'react';
import {ButtonProps, StyleSheet, TouchableHighlight, View} from 'react-native';
import {Color} from '../../lib/types/Theme';
import Typography from './Typography';

interface ActionProps extends Omit<ButtonProps, 'color'> {
  icon: JSX.Element;
  subtitle?: boolean | string;
  reversed?: boolean;
  active?: boolean;
  inverted?: boolean;
  hidden?: boolean;
  layout?: 'row' | 'column';
}

const Action: FC<ActionProps> = ({
  icon,
  title,
  subtitle,
  reversed,
  active,
  inverted,
  hidden,
  layout = 'row',
  ...props
}) => {
  if (hidden) return null;

  const Icon = () => {
    return (
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
            opacity: props.disabled ? 0.3 : 1,
            marginRight: layout === 'row' ? 16 : 0,
          },
        ]}>
        {icon}
      </View>
    );
  };

  const Title = () => {
    return (
      <View
        style={{
          opacity: props.disabled ? 0.3 : 1,
          paddingVertical: layout === 'column' ? 36 : 0,
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
    );
  };

  return (
    <TouchableHighlight
      {...props}
      underlayColor="transparent"
      style={[styles.container]}>
      <View
        style={[
          styles.content,
          {
            flexDirection: layout,
          },
        ]}>
        {reversed && <Title />}
        <Icon />
        {!reversed && <Title />}
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
    alignItems: 'center',
  },
  icon: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 12,
  },
});

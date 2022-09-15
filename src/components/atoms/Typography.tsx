import {FC, useMemo} from 'react';
import {
  Animated,
  RegisteredStyle,
  StyleSheet,
  TextProps,
  TextStyle,
} from 'react-native';
import {Color} from '../../types/Color';

interface TypographyProps extends Omit<TextProps, 'style'> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'bodyL'
    | 'bodyM';
  style?:
    | false
    | RegisteredStyle<TextStyle>
    | Animated.Value
    | Animated.AnimatedInterpolation<string>
    | Animated.WithAnimatedObject<TextStyle>
    | null
    | undefined;
  gutterBottom?: boolean | number;
}

const Typography: FC<TypographyProps> = ({
  variant = 'bodyM',
  children,
  style,
  gutterBottom = false,
  ...props
}) => {
  const marginBottom = useMemo(() => {
    if (!gutterBottom) return 0;

    if (typeof gutterBottom === 'number') return gutterBottom;

    return gutterBottom ? 16 : 0;
  }, [gutterBottom]);

  return (
    <Animated.Text
      style={[
        styles.all,
        styles[variant],
        {
          marginBottom: marginBottom,
        },
        style,
      ]}
      {...props}>
      {children}
    </Animated.Text>
  );
};

export default Typography;

const styles = StyleSheet.create({
  all: {
    fontFamily: 'Inter',
    color: Color.light,
  },
  h1: {
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 32 * 1.2,
  },
  h2: {
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 24 * 1.2,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20 * 1.2,
  },
  h4: {
    fontSize: 18,
    lineHeight: 18 * 1.2,
    fontWeight: '600',
  },
  h5: {
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 24 * 1.32,
  },
  h6: {
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 18 * 1.46,
  },
  body1: {
    fontSize: 16,
    lineHeight: 16 * 1.55,
    fontWeight: '500',
  },
  body2: {
    fontSize: 14,
    lineHeight: 14 * 1.2,
    fontWeight: '500',
  },
  bodyL: {
    fontSize: 15,
    lineHeight: 15 * 1.55,
    fontWeight: '400',
  },
  bodyM: {
    fontSize: 14,
    lineHeight: 14 * 1.2,
    fontWeight: '400',
  },
});

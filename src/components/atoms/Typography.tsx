import {FC, useMemo} from 'react';
import {
  Animated,
  RegisteredStyle,
  StyleSheet,
  TextProps,
  TextStyle,
} from 'react-native';
import {Color, Theme} from '../../types/Theme';

interface TypographyProps extends Omit<TextProps, 'style'> {
  /**
   * @default bodyM
   */
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
  /**
   * @default light
   */
  color?: keyof Omit<Theme, 'name' | 'gradient'>;
  style?:
    | false
    | RegisteredStyle<TextStyle>
    | Animated.Value
    | Animated.AnimatedInterpolation<string>
    | Animated.WithAnimatedObject<TextStyle>
    | null
    | undefined;
  /**
   * Adds spacing at the bottom of the component
   * @default false
   */
  gutter?: boolean | number;
  /**
   * Where to align the text
   * @default left
   */
  align?:
    | Animated.Value
    | 'left'
    | 'right'
    | 'auto'
    | 'center'
    | 'justify'
    | Animated.AnimatedInterpolation<string | number>
    | undefined;
}

const Typography: FC<TypographyProps> = ({
  variant = 'bodyM',
  color = 'light',
  children,
  style,
  gutter = false,
  align,
  ...props
}) => {
  const marginBottom = useMemo(() => {
    if (!gutter) return 0;

    if (typeof gutter === 'number') return gutter;

    return gutter ? 16 : 0;
  }, [gutter]);

  return (
    <Animated.Text
      style={[
        styles.all,
        styles[variant],
        {
          marginBottom,
          textAlign: align,
          color: Color[color],
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

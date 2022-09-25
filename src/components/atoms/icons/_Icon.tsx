import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import {Color, Theme} from '../../../types/Theme';

export interface IconProps extends Omit<VectorImageProps, 'source'> {
  /**
   * @default light
   */
  color?: keyof Omit<Theme, 'name' | 'gradient'>;
  /**
   * In percentages from 0 to 100
   *  @default 100
   */
  colorOpacity?: number;
  /**
   * As a factor of the original size
   * @default 1
   */
  scale?: number;
}

interface LocalIconProps extends IconProps {
  source: number;
}

const Icon: FC<LocalIconProps> = ({
  style,
  color = 'light',
  scale = 1,
  colorOpacity = 100,
  ...props
}) => (
  <VectorImage
    {...props}
    style={[
      {tintColor: Color[color] + colorOpacity, transform: [{scale}]},
      style,
    ]}
  />
);

export default Icon;

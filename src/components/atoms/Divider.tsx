import {FC} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Color} from '../../lib/types/Theme';

interface DividerProps extends ViewProps {
  color?: string;
}
const Divider: FC<DividerProps> = ({style, color, ...props}) => {
  return (
    <View
      style={[
        styling.divider,
        style,
        {
          backgroundColor: color ?? Color.light,
        },
      ]}
      {...props}
    />
  );
};

export default Divider;

const styling = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
});

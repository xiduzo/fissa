import {FC} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Color} from '../../types/Theme';

const Divider: FC<ViewProps> = ({style, ...props}) => {
  return <View style={[styling.divider, style]} {...props} />;
};

export default Divider;

const styling = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Color.light,
  },
});

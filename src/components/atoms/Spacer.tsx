import React, {FC} from 'react';
import {View} from 'react-native';

interface SpacerProps {
  size: number;
}
const Spacer: FC<SpacerProps> = ({size = 300}) => (
  <View style={{paddingBottom: size}} />
);

export default Spacer;

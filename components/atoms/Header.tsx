import React, {FC, ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Color} from '../../types/Color';
import Divider from './Divider';
import Typography from './Typography';

interface HeaderProps {
  title?: string;
  start?: ReactElement;
  end?: ReactElement;
}

const Header: FC<HeaderProps> = ({title, start, end}) => {
  return (
    <View>
      <View style={styles.content}>
        <View style={styles.flex}>{start}</View>
        <Typography style={styles.title} variant="h4">
          {title}
        </Typography>
        <View style={styles.flex}>{end}</View>
      </View>
      <Divider />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  content: {
    height: 60,

    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flexGrow: 70,
    textAlign: 'center',
  },
  flex: {
    width: 32,
  },
});

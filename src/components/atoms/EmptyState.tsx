import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from './Typography';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

const EmptyState: FC<EmptyStateProps> = ({icon, title, subtitle}) => {
  return (
    <View style={styles.container}>
      <Typography
        style={{textAlign: 'center', fontSize: 90, lineHeight: 90}}
        variant="h1">
        {icon}
      </Typography>
      <Typography style={{textAlign: 'center', paddingTop: 16}} variant="h2">
        {title}
      </Typography>
      {subtitle && (
        <Typography style={{textAlign: 'center', paddingTop: 16}}>
          {subtitle}
        </Typography>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});

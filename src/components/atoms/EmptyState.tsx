import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from './Typography';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: boolean | string;
}

const EmptyState: FC<EmptyStateProps> = ({icon, title, subtitle, children}) => {
  return (
    <View style={styles.container}>
      <Typography
        style={{textAlign: 'center', fontSize: 90, lineHeight: 110}}
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
      {children && <View style={styles.subtitleView}>{children}</View>}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    minHeight: '75%',
  },
  subtitleView: {
    marginVertical: 32,
  },
});

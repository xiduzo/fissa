import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from './Typography';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string | JSX.Element;
}

const EmptyState: FC<EmptyStateProps> = ({icon, title, subtitle}) => {
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
      {typeof subtitle === 'string' && (
        <Typography style={{textAlign: 'center', paddingTop: 16}}>
          {subtitle}
        </Typography>
      )}
      {typeof subtitle !== 'string' && (
        <View style={styles.subtitleView}>{subtitle}</View>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitleView: {
    marginVertical: 32,
  },
});

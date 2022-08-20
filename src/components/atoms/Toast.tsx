import React, {FC} from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from 'react-native-toast-message';
import {Color} from '../../types/Color';
import Typography from './Typography';

interface ToastProps extends ToastConfigParams<any> {
  /**
   * Emoji which is being shown
   */
  text2?: string;
}

const Toaster: FC<ToastProps> = ({text1, text2}) => {
  return (
    <SafeAreaView style={[styles.container]} accessibilityRole="alert">
      {text2 && <Text style={styles.emoji}>{text2}</Text>}
      <Typography style={styles.text} variant="h6">
        {text1}
      </Typography>
    </SafeAreaView>
  );
};

const ToastContainer: FC = () => {
  const toastConfig: ToastConfig = {
    success: props => <Toaster {...props} />,
    error: props => <Toaster {...props} />,
    warning: props => <Toaster {...props} />,
    info: props => <Toaster {...props} />,
  };

  if (Platform.OS === 'android') return null;
  return <Toast config={toastConfig} />;
};

export default ToastContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '95%',
    backgroundColor: Color.light,
    marginTop: 24,
    borderRadius: 16,
    shadowColor: Color.dark,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: {
      height: 16,
      width: 0,
    },
  },
  emoji: {
    fontSize: 24,
    marginRight: 16,
  },
  text: {
    color: Color.dark,
    maxWidth: '87.5%',
    flexGrow: 1,
  },
});

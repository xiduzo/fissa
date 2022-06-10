import {Platform, ToastAndroid} from 'react-native';
import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'warning' | 'error' | 'info';
interface ShowProps {
  type?: ToastType;
  icon?: string;
  message: string;
}

class Notification {
  defaultIcon(type: ToastType) {
    switch (type) {
      case 'error':
        return '❌';
      case 'info':
        return '💡';
      case 'warning':
        return '⚡️';
      case 'success':
        return '👊🏻';
      default:
        return '';
    }
  }

  public show({type = 'success', message, ...props}: ShowProps) {
    const icon = props.icon ?? this.defaultIcon(type);

    switch (Platform.OS) {
      case 'ios':
      case 'macos':
        Toast.show({
          type,
          text1: message,
          text2: icon,
        });
        break;
      case 'android':
        ToastAndroid.show(message, ToastAndroid.SHORT);
        break;
    }
  }

  public hide() {
    switch (Platform.OS) {
      case 'ios':
      case 'macos':
        Toast.hide();
        break;
    }
  }
}

export default new Notification();

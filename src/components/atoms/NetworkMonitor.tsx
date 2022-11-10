import {useNetInfo} from '@react-native-community/netinfo';
import {FC, useEffect} from 'react';
import Notification from '../../lib/utils/Notification';

const NetworkMonitor: FC = () => {
  const {isConnected, isInternetReachable, type} = useNetInfo();

  useEffect(() => {
    if (type) return;
    if (!!isConnected && !!isInternetReachable) return;

    Notification.show({
      type: 'warning',
      message: 'You seem to be disconnected from the internet!',
      duration: 10000,
    });
  }, [isConnected, isInternetReachable, type]);

  return null;
};

export default NetworkMonitor;

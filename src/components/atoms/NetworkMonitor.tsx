import React, {FC, useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import Notification from '../../utils/Notification';

const NetworkMonitor: FC = () => {
  const {isConnected, isInternetReachable} = useNetInfo();

  useEffect(() => {
    if (!!isConnected && !!isInternetReachable) return;

    Notification.show({
      type: 'warning',
      message: 'You seem to be disconnected from the internet!',
      duration: 10_000,
    });
  }, [isConnected, isInternetReachable]);

  return null;
};

export default NetworkMonitor;

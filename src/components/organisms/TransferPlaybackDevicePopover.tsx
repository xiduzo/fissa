import React, {FC} from 'react';
import {GestureResponderEvent} from 'react-native';
import {useDevices} from '../../hooks/useDevices';
import Typography from '../atoms/Typography';
import ListItem from '../molecules/ListItem';
import Popover, {PopOverProps} from '../molecules/Popover';

interface TransferPlaybackDevicePopoverProps extends PopOverProps {}

export const TransferPlaybackDevicePopover: FC<
  TransferPlaybackDevicePopoverProps
> = ({visible, onRequestClose}) => {
  const {devices, transferMyPlayback} = useDevices();

  const setActiveDevice =
    (event: GestureResponderEvent) => async (device: SpotifyApi.UserDevice) => {
      onRequestClose && onRequestClose(event);
      await transferMyPlayback(device);
    };

  return (
    <Popover visible={!!visible} onRequestClose={onRequestClose}>
      <Typography variant="h2" color="dark" align="center" gutter>
        Set speaker
      </Typography>
      {devices.length <= 0 && (
        <Typography variant="bodyL" color="dark" align="center">
          No speakers found
        </Typography>
      )}
      {devices.map(device => (
        <ListItem
          key={device.id}
          inverted
          imageStyle={{width: 0, height: 0}}
          title={device.name}
          subtitle={device.is_active && 'Current speaker'}
          onPress={event => setActiveDevice(event)(device)}
        />
      ))}
    </Popover>
  );
};

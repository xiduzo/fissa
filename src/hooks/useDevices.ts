import {useCallback, useMemo, useState} from 'react';
import Notification from '../lib/utils/Notification';
import {useSpotify} from '../providers/SpotifyProvider';

export const useDevices = () => {
  const {spotify} = useSpotify();

  const [devices, setDevices] = useState<SpotifyApi.UserDevice[]>([]);

  const activeDevice = useMemo(() => {
    if (devices.length <= 0) return;

    const active = devices.find(_device => _device.is_active);
    if (active) return active;

    const device = devices[0];
    if (!device.id) return;

    spotify.transferMyPlayback([device.id]).catch(console.error);

    return device;
  }, [devices]);

  const fetchDevices = useCallback(async () => {
    const {devices} = await spotify.getMyDevices();

    setDevices(devices);
  }, [spotify]);

  const transferMyPlayback = useCallback(
    async (device: SpotifyApi.UserDevice) => {
      try {
        if (!device.id) return;
        await spotify?.transferMyPlayback([device.id]);
        await fetchDevices();
        Notification.show({
          message: `Blast those tunes through ${device.name}`,
          type: 'success',
          icon: '🔉',
        });
      } catch (error) {
        Notification.show({
          message: `${device.name} could not be set as speaker`,
          type: 'warning',
        });
      }
    },
    [spotify, fetchDevices],
  );

  useMemo(fetchDevices, [fetchDevices]);

  return {devices, activeDevice, transferMyPlayback};
};

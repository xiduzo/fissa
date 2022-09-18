import {DateTime} from 'luxon';
import {FC, useMemo} from 'react';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import ProgressBar from '../atoms/ProgressBar';
import ListItem, {ListItemProps} from './ListItem';

interface TrackProps extends Partial<ListItemProps> {
  track?: SpotifyApi.TrackObjectFull;
  progressMs?: number;
  expectedEndTime?: string;
}

const Track: FC<TrackProps> = ({
  track,
  progressMs,
  expectedEndTime,
  ...props
}) => {
  if (!track) return null;

  const progress = useMemo(() => {
    if (!expectedEndTime) return undefined;

    const {duration_ms} = track;

    const tMinus = DateTime.fromISO(expectedEndTime).diff(
      DateTime.now(),
    ).milliseconds;

    const progress = (tMinus * 100) / duration_ms;

    return 1 - progress / 100; // As percentage
  }, [expectedEndTime, track]);

  return (
    <ListItem
      imageUri={track.album.images[0]?.url ?? DEFAULT_IMAGE}
      title={track.name}
      subtitle={track.artists.map((x: any) => x.name).join(', ')}
      extra={
        <ProgressBar
          progress={progress}
          track={track}
          style={{marginTop: 16}}
        />
      }
      {...props}
    />
  );
};

export default Track;

import {FC, useEffect, useMemo, useState} from 'react';
import {View, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Track} from '../../lib/interfaces/Track';
import {Color} from '../../lib/types/Theme';

interface ProgressBarProps extends ViewProps {
  progress?: number;
  track: Track;
}

const ProgressBar: FC<ProgressBarProps> = ({progress, track, style}) => {
  const [localProgress, setLocalProgress] = useState(0);

  const duration_ms = useMemo(() => track.duration_ms, [track]);

  useEffect(() => {
    if (!progress) return;

    setLocalProgress(progress);

    // TODO: keep in mind local start time to calculate progress
    // When you leave the app the interval pauses
    // And when you come back the interval starts again
    // So you need to account for this time
    const updateFrequency = 250;
    const interval = setInterval(() => {
      setLocalProgress(prev => {
        const next = prev + updateFrequency / duration_ms;
        return Math.min(1, next);
      });
    }, updateFrequency);

    return () => {
      clearInterval(interval);
    };
  }, [duration_ms, progress]);

  if (progress === undefined) return null;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: Color.light + '20',
          borderRadius: 4,
          overflow: 'hidden',
        },
        style,
      ]}>
      <LinearGradient
        {...Color.gradient}
        style={{
          flex: localProgress,
          height: 6,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
        }}
      />
      <View style={{flex: 1 - localProgress}} />
    </View>
  );
};

export default ProgressBar;

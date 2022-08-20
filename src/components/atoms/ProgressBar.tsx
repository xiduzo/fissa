import React, {FC, useEffect, useMemo, useState} from 'react';
import {View, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from '../../types/Color';

interface ProgressBarProps extends ViewProps {
  progress?: number;
  track: SpotifyApi.TrackObjectFull;
  isPlaying?: boolean;
}

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  track,
  isPlaying,
  style,
}) => {
  const [localProgress, setLocalProgress] = useState(0);

  const duration_ms = useMemo(() => track.duration_ms, [track]);

  useEffect(() => {
    if (!progress) return;
    setLocalProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!isPlaying || !progress) return;

    const updateFrequency = 750;
    const interval = setInterval(() => {
      setLocalProgress(prev => {
        const next = prev + updateFrequency / duration_ms;
        return Math.min(1, next);
      });
    }, updateFrequency);

    return () => {
      clearInterval(interval);
    };
  }, [duration_ms, progress, isPlaying]);

  if (progress === undefined) {
    return null;
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: Color.light + '20',
          borderRadius: 4,
          overflow: 'hidden',
          opacity: isPlaying ? 1 : 0.3,
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

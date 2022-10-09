import React, {FC} from 'react';
import Typography from './Typography';

interface ScrolledHeaderTitleProps {
  title: string;
  scrollPercentage: number;
}

export const ScrolledHeaderTitle: FC<ScrolledHeaderTitleProps> = ({
  title,
  scrollPercentage,
}) => {
  if (scrollPercentage < 100) return null;

  const actualPercentage = scrollPercentage - 100;
  const opacity = actualPercentage / 100 + 0.2;
  return (
    <Typography
      variant="h4"
      style={{
        opacity: opacity > 0.7 ? 1 : opacity,
        transform: [{translateY: Math.max(0, 15 - actualPercentage / 3)}],
      }}>
      {title}
    </Typography>
  );
};

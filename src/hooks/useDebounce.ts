import {useEffect, useRef, useState} from 'react';

export const useDebounce = <T>(
  value: T,
  delay: number,
  callback?: (newValue: T) => void,
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setDebouncedValue(value);

      callback && callback(value);
    }, delay);
  }, [value, delay, callback]);

  return debouncedValue;
};

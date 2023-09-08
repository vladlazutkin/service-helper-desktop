import { useEffect, useRef } from 'react';

export const usePrevious = <T>(value: T) => {
  const prevValue = useRef<T>(value);

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return prevValue.current;
};

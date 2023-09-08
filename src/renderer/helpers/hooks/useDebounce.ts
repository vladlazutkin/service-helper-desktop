import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number) => {
  const [deferredValue, setValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setValue(value), delay);
    return () => clearTimeout(timeout);
  }, [delay, value]);

  return deferredValue;
};

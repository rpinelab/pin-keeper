import { useCallback, useEffect, useState } from 'react';

import { startupDelayStorage } from '@/utils/storage';

export function useAutoRestoreDelay(): [number, (value: number) => void] {
  const [startupDelay, setStartupDelayRaw] = useState<number>(100);

  useEffect(() => {
    void startupDelayStorage.getValue().then((delay) => {
      setStartupDelayRaw(delay);
    });
  }, []);

  useEffect(() => {
    const unwatch = startupDelayStorage.watch((delay) => {
      setStartupDelayRaw(delay);
    });

    return () => {
      unwatch();
    };
  }, []);

  const setStartupDelay = useCallback((delay: number) => {
    void startupDelayStorage.setValue(delay);
  }, []);

  return [startupDelay, setStartupDelay] as const;
}

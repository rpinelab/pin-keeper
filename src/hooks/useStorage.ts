import { useCallback, useEffect, useState } from 'react';
import { WxtStorageItem } from 'wxt/utils/storage';

export function useStorage<TValue, TMetadata extends Record<string, unknown>>(
  storage: WxtStorageItem<TValue, TMetadata>,
): [TValue, (value: TValue) => void] {
  const [state, setStateRaw] = useState<TValue>(storage.fallback);

  useEffect(() => {
    void storage.getValue().then((value) => {
      setStateRaw(value);
    });
  }, []);

  useEffect(() => {
    const unwatch = storage.watch((value) => {
      setStateRaw(value);
    });

    return () => {
      unwatch();
    };
  }, []);

  const setState = useCallback((value: TValue) => {
    void storage.setValue(value);
  }, []);

  return [state, setState] as const;
}

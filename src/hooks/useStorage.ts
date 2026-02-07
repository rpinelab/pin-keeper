import { useCallback, useEffect, useState } from 'react';
import type { WxtStorageItem } from 'wxt/utils/storage';

export function useStorage<TValue, TMetadata extends Record<string, unknown>>(
  storage: WxtStorageItem<TValue, TMetadata>,
): [TValue, (value: TValue) => void] {
  const [state, setStateRaw] = useState<TValue>(storage.fallback);

  useEffect(() => {
    void storage.getValue().then((value) => {
      setStateRaw(value);
    });
  }, [storage]);

  useEffect(() => {
    const unwatch = storage.watch((value) => {
      setStateRaw(value);
    });

    return () => {
      unwatch();
    };
  }, [storage]);

  const setState = useCallback(
    (value: TValue) => {
      void storage.setValue(value);
    },
    [storage],
  );

  return [state, setState] as const;
}

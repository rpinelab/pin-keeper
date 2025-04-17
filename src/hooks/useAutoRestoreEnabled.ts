import { useCallback, useEffect, useState } from 'react';

import { autoRestoreEnabledStorage } from '@/utils/storage';

export function useAutoRestoreEnabled() {
  const [autoRestoreEnabled, setAutoRestoreEnabled] = useState<boolean>(true);

  useEffect(() => {
    void autoRestoreEnabledStorage.getValue().then((enabled) => {
      setAutoRestoreEnabled(enabled);
    });
  }, []);

  useEffect(() => {
    const unwatch = autoRestoreEnabledStorage.watch((enabled) => {
      setAutoRestoreEnabled(enabled);
    });

    return () => {
      unwatch();
    };
  }, []);

  const updateAutoRestoreEnabled = useCallback((enabled: boolean) => {
    void autoRestoreEnabledStorage.setValue(enabled);
  }, []);

  return [autoRestoreEnabled, updateAutoRestoreEnabled] as const;
}

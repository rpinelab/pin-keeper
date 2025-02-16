import { PinnedUrlSetting, pinnedUrlSettingsStorage } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

export function usePinnedUrlSettings() {
  const [pinnedUrlSettings, rawSetPinnedUrlSettings] = useState<
    PinnedUrlSetting[]
  >([]);

  useEffect(() => {
    void pinnedUrlSettingsStorage.getValue().then((settings) => {
      rawSetPinnedUrlSettings(settings);
    });
  }, []);

  useEffect(() => {
    const unwatch = pinnedUrlSettingsStorage.watch((settings) => {
      rawSetPinnedUrlSettings(settings);
    });

    return () => {
      unwatch();
    };
  }, []);

  const setPinnedUrlSettings = useCallback((settings: PinnedUrlSetting[]) => {
    void pinnedUrlSettingsStorage.setValue(settings);
  }, []);

  return [pinnedUrlSettings, setPinnedUrlSettings] as const;
}

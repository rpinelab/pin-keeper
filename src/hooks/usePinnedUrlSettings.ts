import { pinnedUrlSettingsStorage } from '@/utils/storage';

import { useStorage } from './useStorage';

export function usePinnedUrlSettings() {
  return useStorage(pinnedUrlSettingsStorage);
}

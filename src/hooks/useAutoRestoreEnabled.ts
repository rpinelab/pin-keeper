import { autoRestoreEnabledStorage } from '@/utils/storage';

import { useStorage } from './useStorage';

export function useAutoRestoreEnabled() {
  return useStorage(autoRestoreEnabledStorage);
}

import { startupDelayStorage } from '@/utils/storage';

import { useStorage } from './useStorage';

export function useAutoRestoreDelay() {
  return useStorage(startupDelayStorage);
}

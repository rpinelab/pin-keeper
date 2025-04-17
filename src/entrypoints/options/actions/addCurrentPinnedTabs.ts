import { addCurrentPinnedTabsToSettings } from '@/utils/tabManager';

export async function addCurrentPinnedTabsToStorage() {
  try {
    await addCurrentPinnedTabsToSettings();
    return { success: true };
  } catch (error) {
    console.error('Failed to add current pinned tabs:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

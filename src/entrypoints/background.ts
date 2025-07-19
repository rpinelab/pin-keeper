import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';

import {
  autoRestoreEnabledStorage,
  startupDelayStorage,
} from '@/utils/storage';
import { restorePinnedTabs } from '@/utils/tabManager';

export default defineBackground(() => {
  // Run on extension button click
  (browser.action ?? browser.browserAction).onClicked.addListener(() => {
    console.log('Pin Keeper: Extension button clicked');
    void (async () => {
      await restorePinnedTabs();
    })();
  });

  // Run on startup
  browser.runtime.onStartup.addListener(() => {
    console.log('Pin Keeper: onStartup event triggered');
    void (async () => {
      const autoRestoreEnabled = await autoRestoreEnabledStorage.getValue();
      if (!autoRestoreEnabled) {
        console.log('Pin Keeper: Auto restore is disabled, skipping restore');
        return;
      }

      console.log('Pin Keeper: Auto restore is enabled, restoring pinned tabs');

      const delay = await startupDelayStorage.getValue();
      setTimeout(() => {
        console.log(
          `Pin Keeper: Restoring pinned tabs after ${delay.toString()}ms delay`,
        );
        void restorePinnedTabs();
      }, delay);
    })();
  });
});

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
    void (async () => {
      await restorePinnedTabs();
    })();
  });

  // Run on startup
  browser.runtime.onStartup.addListener(() => {
    void (async () => {
      const autoRestoreEnabled = await autoRestoreEnabledStorage.getValue();
      if (!autoRestoreEnabled) {
        return;
      }

      const delay = await startupDelayStorage.getValue();
      setTimeout(() => {
        void restorePinnedTabs();
      }, delay);
    })();
  });
});

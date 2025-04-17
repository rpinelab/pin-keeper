import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';

import {
  autoRestoreEnabledStorage,
  startupDelayStorage,
} from '@/utils/storage';
import { restorePinnedTabs } from '@/utils/tabManager';

export default defineBackground(() => {
  // Run on extension button click
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (browser.action ?? browser.browserAction).onClicked.addListener(async () => {
    await restorePinnedTabs();
  });

  // Run on startup
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  browser.runtime.onStartup.addListener(async () => {
    const autoRestoreEnabled = await autoRestoreEnabledStorage.getValue();
    if (!autoRestoreEnabled) {
      return;
    }

    const delay = await startupDelayStorage.getValue();
    setTimeout(() => {
      void restorePinnedTabs();
    }, delay);
  });
});

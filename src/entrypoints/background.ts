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
      try {
        await restorePinnedTabs();
      } catch (error) {
        console.error('Pin Keeper: Manual tab restoration failed:', error);
      }
    })();
  });

  // Run on startup
  browser.runtime.onStartup.addListener(() => {
    void (async () => {
      try {
        const autoRestoreEnabled = await autoRestoreEnabledStorage.getValue();

        if (!autoRestoreEnabled) {
          return;
        }

        const delay = await startupDelayStorage.getValue();

        setTimeout(() => {
          void (async () => {
            try {
              await restorePinnedTabs();
            } catch (error) {
              console.error(
                'Pin Keeper: Startup tab restoration failed:',
                error,
              );
            }
          })();
        }, delay);
      } catch (error) {
        console.error('Pin Keeper: Error in startup handler:', error);
      }
    })();
  });
});

import { type Browser, browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';

import {
  autoRestoreEnabledStorage,
  startupDelayStorage,
} from '@/utils/storage';
import { restorePinnedTabs } from '@/utils/tabManager';

const CONTEXT_MENU_OPEN_OPTIONS = 'open-options';

async function handleIconClick() {
  try {
    await restorePinnedTabs({ showNotification: true });
  } catch (error) {
    console.error('Pin Keeper: Manual tab restoration failed:', error);
  }
}

async function handleStartupTabRestore() {
  try {
    const autoRestoreEnabled = await autoRestoreEnabledStorage.getValue();

    if (!autoRestoreEnabled) {
      return;
    }

    const delay = await startupDelayStorage.getValue();

    setTimeout(() => {
      void (async () => {
        try {
          await restorePinnedTabs({ showNotification: false });
        } catch (error) {
          console.error('Pin Keeper: Startup tab restoration failed:', error);
        }
      })();
    }, delay);
  } catch (error) {
    console.error('Pin Keeper: Error in startup handler:', error);
  }
}

export default defineBackground(() => {
  // Run on extension button click
  (browser.action ?? browser.browserAction).onClicked.addListener(() => {
    void handleIconClick();
  });

  browser.runtime.onInstalled.addListener(
    (details: Browser.runtime.InstalledDetails & { temporary?: boolean }) => {
      // Run on installation (only on dev mode)
      if (details.reason === 'install' && details.temporary === true) {
        void handleStartupTabRestore();
      }
    },
  );

  browser.contextMenus.removeAll().then(() => {
    // Create context menu item on extension button
    browser.contextMenus.create(
      {
        id: CONTEXT_MENU_OPEN_OPTIONS,
        title: 'Manage Pinned Tabs...',
        contexts: [
          import.meta.env.MANIFEST_VERSION === 2 ? 'browser_action' : 'action',
        ],
      },
      () => {
        if (browser.runtime.lastError) {
          console.error(
            'Pin Keeper: Context menu creation failed:',
            browser.runtime.lastError,
          );
        }
      },
    );
  });

  // Handle context menu clicks
  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === CONTEXT_MENU_OPEN_OPTIONS) {
      void browser.runtime.openOptionsPage();
    }
  });

  // Run on startup
  browser.runtime.onStartup.addListener(() => {
    void handleStartupTabRestore();
  });
});

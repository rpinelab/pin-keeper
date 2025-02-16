import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';

import { restorePinnedTabs } from '@/utils/tabManager';

export default defineBackground(() => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (browser.action ?? browser.browserAction).onClicked.addListener(async () => {
    await restorePinnedTabs();
  });
});

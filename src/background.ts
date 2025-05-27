import { browser } from 'wxt/browser';

browser.runtime.onInstalled.addListener(() => {
  void (async () => {
    const { restorePinnedTabs } =
      await browser.storage.local.get('restorePinnedTabs');
    if (restorePinnedTabs === undefined) {
      await browser.storage.local.set({ restorePinnedTabs: true });
    }
  })();
});

browser.runtime.onStartup.addListener(() => {
  void (async () => {
    const { restorePinnedTabs } =
      await browser.storage.local.get('restorePinnedTabs');
    if (restorePinnedTabs) {
      const tabs = await browser.tabs.query({ pinned: true });
      for (const tab of tabs) {
        if (tab.url) {
          await browser.tabs.create({ url: tab.url, pinned: true });
        }
      }
    }
  })();
});

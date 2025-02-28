import { browser } from 'wxt/browser';

import { pinnedUrlSettingsStorage } from './storage';

export const restorePinnedTabs = async () => {
  const pinnedTabs = await browser.tabs.query({ pinned: true });

  const pinnedUrlConfigs = await pinnedUrlSettingsStorage.getValue();

  if (pinnedUrlConfigs.length === 0) {
    await browser.notifications.create({
      type: 'basic',
      title: 'No pinned URLs configured',
      message: 'Please configure pinned URLs in the extension settings',
    });
    return;
  }

  for (const pinnedUrlConfig of pinnedUrlConfigs) {
    const matchedTabs = pinnedTabs.filter((tab) =>
      tab.url?.startsWith(pinnedUrlConfig.url),
    );
    if (matchedTabs.length > 0) {
      continue;
    }

    // Open a new tab and pin it
    await browser.tabs.create({
      url: pinnedUrlConfig.url,
      pinned: true,
      active: false,
    });
  }
};

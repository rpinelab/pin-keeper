import { browser, Tabs } from 'wxt/browser';

import { PinnedUrlSetting, pinnedUrlSettingsStorage } from './storage';

// Main function to restore pinned tabs
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
    try {
      const tabMatcher = createTabUrlMatcher(pinnedUrlConfig);

      const tabExists = pinnedTabs.some(tabMatcher);
      if (tabExists) {
        continue;
      }

      // Open a new tab and pin it
      await browser.tabs.create({
        url: pinnedUrlConfig.url,
        pinned: true,
        active: false,
      });
    } catch (error) {
      console.error('Failed to process pinned URL config:', error);
      await browser.notifications.create({
        type: 'basic',
        title: 'Failed to process pinned URL',
        message: `Failed to process pinned URL: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
};

function createTabUrlMatcher(
  pinnedUrlConfig: PinnedUrlSetting,
): (tab: Tabs.Tab) => boolean {
  switch (pinnedUrlConfig.matchType) {
    case 'exact': {
      return (tab) =>
        tab.url === (pinnedUrlConfig.matchPattern || pinnedUrlConfig.url);
    }
    case 'startsWith': {
      return (tab) =>
        tab.url?.startsWith(
          pinnedUrlConfig.matchPattern || pinnedUrlConfig.url,
        ) ?? false;
    }
    case 'regex': {
      try {
        const urlPatternRegex = new RegExp(
          pinnedUrlConfig.matchPattern || pinnedUrlConfig.url,
        );
        return (tab) => urlPatternRegex.test(tab.url ?? '');
      } catch (error) {
        throw new Error(
          `Invalid regex pattern: ${pinnedUrlConfig.matchPattern}`,
          { cause: error },
        );
      }
    }
  }
}

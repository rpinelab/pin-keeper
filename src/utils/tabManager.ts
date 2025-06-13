import { nanoid } from 'nanoid';
import { Browser, browser } from 'wxt/browser';

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
      iconUrl: 'icon.png',
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
        iconUrl: 'icon.png',
      });
    }
  }
};

export function createTabUrlMatcher(
  pinnedUrlConfig: Omit<PinnedUrlSetting, 'id'>,
): (tab: Browser.tabs.Tab | { url: string }) => boolean {
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
          `Invalid regex pattern: ${pinnedUrlConfig.matchPattern || pinnedUrlConfig.url}`,
          { cause: error },
        );
      }
    }
  }
}

// Add current pinned tabs to settings
export const addCurrentPinnedTabsToSettings = async () => {
  try {
    const currentPinnedTabs = await browser.tabs.query({ pinned: true });

    if (currentPinnedTabs.length === 0) {
      return;
    }

    const existingSettings = await pinnedUrlSettingsStorage.getValue();

    // Process each pinned tab
    for (const tab of currentPinnedTabs) {
      if (!tab.url) {
        continue;
      }

      // Check if this URL is already in settings
      const alreadyExists = existingSettings.some((setting) =>
        createTabUrlMatcher(setting)(tab),
      );

      if (!alreadyExists) {
        // Add new setting with default values
        existingSettings.push({
          id: nanoid(),
          url: tab.url,
          matchType: 'exact',
          matchPattern: '',
        });
      }
    }

    await pinnedUrlSettingsStorage.setValue(existingSettings);
  } catch (error) {
    console.error('Failed to add pinned tabs to settings:', error);
    await browser.notifications.create({
      type: 'basic',
      title: 'Error Saving Pinned Tabs',
      message: `Failed to save pinned tabs: ${error instanceof Error ? error.message : String(error)}`,
      iconUrl: 'icon.png',
    });
  }
};

import { nanoid } from 'nanoid';
import { type Browser, browser } from 'wxt/browser';

import { type PinnedUrlSetting, pinnedUrlSettingsStorage } from './storage';

// Helper function to extract domain from URL
function extractDomain(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch {
    // If it's not a valid URL, attempt to parse as domain-only pattern
    // Reject strings with path, query, or hash components
    if (
      urlString.includes('.') &&
      !urlString.includes('://') &&
      !urlString.includes('/') &&
      !urlString.includes('?') &&
      !urlString.includes('#')
    ) {
      // Validate by attempting to parse with dummy protocol
      try {
        const testUrl = new URL(`https://${urlString}`);
        return testUrl.hostname;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export interface RestorePinnedTabsOptions {
  showNotification?: boolean;
}

// Main function to restore pinned tabs
export const restorePinnedTabs = async (options?: RestorePinnedTabsOptions) => {
  const pinnedTabs = await browser.tabs.query({ pinned: true });
  const pinnedUrlConfigs = await pinnedUrlSettingsStorage.getValue();

  if (pinnedUrlConfigs.length === 0) {
    if (options?.showNotification !== false) {
      await browser.notifications.create({
        type: 'basic',
        title: 'No pinned URLs configured',
        message: 'Please configure pinned URLs in the extension settings',
        iconUrl: 'icon.png',
      });
    }
    return;
  }

  for (const pinnedUrlConfig of pinnedUrlConfigs) {
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
  }
};

export function createTabUrlMatcher(
  pinnedUrlConfig: Omit<PinnedUrlSetting, 'id'>,
): (tab: Browser.tabs.Tab | { url: string }) => boolean {
  switch (pinnedUrlConfig.matchType) {
    case 'exact': {
      const pattern = pinnedUrlConfig.matchPattern || pinnedUrlConfig.url;
      return (tab) => tab.url === pattern;
    }
    case 'startsWith': {
      const pattern = pinnedUrlConfig.matchPattern || pinnedUrlConfig.url;
      return (tab) => tab.url?.startsWith(pattern) ?? false;
    }
    case 'domain': {
      const pattern = pinnedUrlConfig.matchPattern || pinnedUrlConfig.url;
      const targetDomain = extractDomain(pattern);
      return (tab) => {
        if (!tab.url || !targetDomain) {
          return false;
        }
        const tabDomain = extractDomain(tab.url);
        return tabDomain === targetDomain;
      };
    }
    case 'regex': {
      try {
        const pattern = pinnedUrlConfig.matchPattern || pinnedUrlConfig.url;
        const urlPatternRegex = new RegExp(pattern);
        return (tab) => urlPatternRegex.test(tab.url ?? '');
      } catch (error) {
        console.error(
          'Invalid regex pattern:',
          pinnedUrlConfig.matchPattern || pinnedUrlConfig.url,
          error,
        );
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
};

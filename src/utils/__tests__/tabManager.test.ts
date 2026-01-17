import { beforeEach, describe, expect, it, vi } from 'vitest';
import { browser } from 'wxt/browser';
import { fakeBrowser } from 'wxt/testing';

import { pinnedUrlSettingsStorage } from '../storage';
import {
  addCurrentPinnedTabsToSettings,
  createTabUrlMatcher,
  restorePinnedTabs,
} from '../tabManager';

describe('createTabUrlMatcher', () => {
  it('should match exact URLs', () => {
    const matcher = createTabUrlMatcher({
      url: 'https://example.com/test',
      matchType: 'exact',
      matchPattern: '',
    });

    expect(matcher({ url: 'https://example.com/test' })).toBe(true);
    expect(matcher({ url: 'https://example.com/page' })).toBe(false);
  });

  it('should match URLs starting with a pattern', () => {
    const matcher = createTabUrlMatcher({
      url: 'https://example.com/test',
      matchType: 'startsWith',
      matchPattern: '',
    });

    expect(matcher({ url: 'https://example.com/test' })).toBe(true);
    expect(matcher({ url: 'https://example.com/test/page?id=123' })).toBe(true);
    expect(matcher({ url: 'https://example.com/other' })).toBe(false);
    expect(matcher({ url: 'https://another.com/test' })).toBe(false);
  });

  it('should match URLs using regex', () => {
    const matcher = createTabUrlMatcher({
      url: '',
      matchType: 'regex',
      matchPattern: '^https?://example\\.com/test/.*$',
    });

    expect(matcher({ url: 'https://example.com/test/' })).toBe(true);
    expect(matcher({ url: 'http://example.com/test/page?id=123' })).toBe(true);
    expect(matcher({ url: 'https://example.com/other' })).toBe(false);
    expect(matcher({ url: 'https://another.com/test' })).toBe(false);
  });

  it('should match URLs by domain', () => {
    const matcher = createTabUrlMatcher({
      url: 'https://mail.google.com/mail/u/1/#inbox',
      matchType: 'domain',
      matchPattern: '',
    });

    expect(matcher({ url: 'https://mail.google.com/mail/u/1/#inbox' })).toBe(
      true,
    );
    expect(matcher({ url: 'https://mail.google.com/mail/u/2/#sent' })).toBe(
      true,
    );
    expect(matcher({ url: 'http://mail.google.com/' })).toBe(true);
    expect(matcher({ url: 'https://www.google.com' })).toBe(false);
    expect(matcher({ url: 'https://google.com' })).toBe(false);
  });

  it('should match domains using custom pattern', () => {
    const matcher = createTabUrlMatcher({
      url: 'https://mail.google.com',
      matchType: 'domain',
      matchPattern: 'example.com',
    });

    expect(matcher({ url: 'https://example.com' })).toBe(true);
    expect(matcher({ url: 'https://example.com/page' })).toBe(true);
    expect(matcher({ url: 'http://example.com/test?id=123#anchor' })).toBe(
      true,
    );
    expect(matcher({ url: 'https://subdomain.example.com' })).toBe(false);
    expect(matcher({ url: 'https://mail.google.com' })).toBe(false);
  });

  it('should handle domains with ports', () => {
    const matcher = createTabUrlMatcher({
      url: 'http://localhost:3000',
      matchType: 'domain',
      matchPattern: '',
    });

    // Domain matching ignores ports - only compares hostname
    expect(matcher({ url: 'http://localhost:3000' })).toBe(true);
    expect(matcher({ url: 'http://localhost:3000/page' })).toBe(true);
    expect(matcher({ url: 'https://localhost:3000' })).toBe(true);
    // Different port but same domain (localhost) - still matches
    expect(matcher({ url: 'http://localhost:8080' })).toBe(true);
  });

  it('should handle invalid URLs in domain match', () => {
    const matcher = createTabUrlMatcher({
      url: 'https://example.com',
      matchType: 'domain',
      matchPattern: '',
    });

    expect(matcher({ url: 'not-a-valid-url' })).toBe(false);
    expect(matcher({ url: '' })).toBe(false);
  });

  it('should handle invalid pattern in domain match', () => {
    const matcher = createTabUrlMatcher({
      url: '',
      matchType: 'domain',
      matchPattern: 'not-a-valid-url',
    });

    expect(matcher({ url: 'https://example.com' })).toBe(false);
  });

  it('should reject bare domain patterns with ports', () => {
    const matcher = createTabUrlMatcher({
      url: 'https://example.com',
      matchType: 'domain',
      matchPattern: 'example.com:8080',
    });

    // Port should be rejected in bare domain pattern
    expect(matcher({ url: 'https://example.com' })).toBe(false);
  });

  it('should throw an error for invalid regex patterns', () => {
    expect(() =>
      createTabUrlMatcher({
        url: '',
        matchType: 'regex',
        matchPattern: '[invalid-regex',
      }),
    ).toThrowError('Invalid regex pattern: [invalid-regex');
  });
});

describe('restorePinnedTabs', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    fakeBrowser.reset();
    vi.spyOn(browser.tabs, 'create');
    vi.spyOn(browser.tabs, 'query');
  });

  it('should create new pinned tabs for missing URL', async () => {
    vi.mocked(browser.tabs.query).mockResolvedValue([
      {
        url: 'https://example2.com',
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
    ]);
    vi.mocked(browser.tabs.create).mockResolvedValue(undefined);

    await pinnedUrlSettingsStorage.setValue([
      {
        id: '1',
        url: 'https://example1.com',
        matchType: 'exact',
        matchPattern: '',
      },
    ]);

    await restorePinnedTabs();

    expect(browser.tabs.create).toHaveBeenCalledExactlyOnceWith({
      url: 'https://example1.com',
      pinned: true,
      active: false,
    });
  });

  it('should not create tabs if all URLs already exist', async () => {
    vi.mocked(browser.tabs.query).mockResolvedValue([
      {
        url: 'https://example1.com',
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
      {
        url: 'https://example2.com/test',
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
    ]);

    await pinnedUrlSettingsStorage.setValue([
      {
        id: '1',
        url: 'https://example1.com',
        matchType: 'exact',
        matchPattern: '',
      },
      {
        id: '2',
        url: 'https://example2.com/test',
        matchType: 'startsWith',
        matchPattern: 'https://example2.com',
      },
    ]);

    await restorePinnedTabs();

    expect(browser.tabs.create).not.toBeCalled();
  });

  it('should handle multiple pinned URLs', async () => {
    vi.mocked(browser.tabs.query).mockResolvedValue([
      {
        url: 'https://example1.com',
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
      {
        url: 'https://example2.com',
        pinned: true,
        index: 1,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
    ]);
    vi.mocked(browser.tabs.create).mockResolvedValue(undefined);

    await pinnedUrlSettingsStorage.setValue([
      {
        id: '1',
        url: 'https://example1.com',
        matchType: 'exact',
        matchPattern: '',
      },
      {
        id: '2',
        url: 'https://example2.com/test',
        matchType: 'startsWith',
        matchPattern: 'https://example2.com',
      },
      {
        id: '3',
        url: 'https://example3.com/test',
        matchType: 'regex',
        matchPattern: '^https?://example3\\.com/.*$',
      },
    ]);

    await restorePinnedTabs();

    expect(browser.tabs.create).toHaveBeenCalledExactlyOnceWith({
      url: 'https://example3.com/test',
      pinned: true,
      active: false,
    });
  });

  it('should handle no pinned URLs configured', async () => {
    await restorePinnedTabs();

    expect(browser.tabs.create).not.toBeCalled();
  });

  it('should throw error for invalid pinned URL regex', async () => {
    vi.mocked(browser.tabs.query).mockResolvedValue([]);

    await pinnedUrlSettingsStorage.setValue([
      {
        id: '1',
        url: 'https://example.com',
        matchType: 'regex',
        matchPattern: '[invalid-regex',
      },
    ]);

    await expect(restorePinnedTabs()).rejects.toThrowError(
      'Invalid regex pattern: [invalid-regex',
    );

    expect(browser.tabs.create).not.toBeCalled();
  });
});

describe('addCurrentPinnedTabsToSettings', () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    fakeBrowser.reset();
    await pinnedUrlSettingsStorage.setValue([]);
    vi.spyOn(browser.tabs, 'query');
  });

  it('should add new pinned tabs to settings', async () => {
    vi.mocked(browser.tabs.query).mockResolvedValue([
      {
        url: 'https://new.com',
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
    ]);

    await addCurrentPinnedTabsToSettings();

    await expect(pinnedUrlSettingsStorage.getValue()).resolves.toEqual([
      {
        id: expect.any(String),
        url: 'https://new.com',
        matchType: 'exact',
        matchPattern: '',
      },
    ]);
  });

  it('should not add duplicate entries', async () => {
    vi.mocked(browser.tabs.query).mockResolvedValue([
      {
        url: 'https://existing.com',
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
    ]);
    await pinnedUrlSettingsStorage.setValue([
      {
        id: '1',
        url: 'https://existing.com',
        matchType: 'exact',
        matchPattern: '',
      },
    ]);

    await addCurrentPinnedTabsToSettings();

    await expect(pinnedUrlSettingsStorage.getValue()).resolves.toHaveLength(1);
  });

  it('should handle tabs without URLs gracefully', async () => {
    // await pinnedUrlSettingsStorage.setValue([]);
    vi.mocked(browser.tabs.query).mockResolvedValue([
      {
        url: undefined,
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
    ]);

    await addCurrentPinnedTabsToSettings();

    await expect(pinnedUrlSettingsStorage.getValue()).resolves.toEqual([]);
  });

  it('should handle multiple pinned tabs', async () => {
    vi.mocked(browser.tabs.query).mockResolvedValue([
      {
        url: 'https://tab1.com',
        pinned: true,
        index: 0,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
      {
        url: 'https://tab2.com',
        pinned: true,
        index: 1,
        highlighted: false,
        active: false,
        incognito: false,
        windowId: 0,
        frozen: false,
        selected: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 0,
      },
    ]);
    await pinnedUrlSettingsStorage.setValue([
      {
        id: '1',
        url: 'https://tab1.com',
        matchType: 'exact',
        matchPattern: '',
      },
    ]);

    await addCurrentPinnedTabsToSettings();

    await expect(pinnedUrlSettingsStorage.getValue()).resolves.toEqual([
      {
        id: expect.any(String),
        url: 'https://tab1.com',
        matchType: 'exact',
        matchPattern: '',
      },
      {
        id: expect.any(String),
        url: 'https://tab2.com',
        matchType: 'exact',
        matchPattern: '',
      },
    ]);
  });
});

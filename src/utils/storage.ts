export type UrlMatchType = 'exact' | 'startsWith' | 'regex';

export interface PinnedUrlSetting {
  id: string;
  url: string;
  matchType: UrlMatchType;
}

export const pinnedUrlSettingsStorage = storage.defineItem<PinnedUrlSetting[]>(
  'local:pinnedUrlSettings',
  {
    version: 1,
    fallback: [],
  },
);

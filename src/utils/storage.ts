const allUrlMatchTypes = ['exact', 'startsWith', 'regex'] as const;

export type UrlMatchType = (typeof allUrlMatchTypes)[number];

export const urlMatchTypeLabels: Record<UrlMatchType, string> = {
  exact: 'Exact Match',
  startsWith: 'Starts With',
  regex: 'Regex',
};

export const urlMatchTypes: { value: UrlMatchType; label: string }[] =
  allUrlMatchTypes.map((value) => ({
    value,
    label: urlMatchTypeLabels[value],
  }));

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

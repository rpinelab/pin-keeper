import { nanoid } from 'nanoid';

import {
  type PinnedUrlSetting,
  pinnedUrlSettingsStorage,
  type UrlMatchType,
} from '@/utils/storage';

export type AddUrlState =
  | { success: true; data: PinnedUrlSetting }
  | { success: false; error: Error }
  | null;

export async function editUrlInStorage(
  _prevState: AddUrlState,
  formData: FormData | null,
): Promise<AddUrlState> {
  if (formData === null) {
    return null;
  }

  const id = formData.get('id') as string | null; // null if adding new URL
  const url = formData.get('url') as string;
  const matchType = formData.get('matchType') as UrlMatchType;
  const matchPattern = formData.get('matchPattern') as string;

  if (url === '') {
    return { success: false, error: new Error('URL is required') };
  }

  try {
    new URL(url);
  } catch {
    return { success: false, error: new Error('Invalid URL') };
  }

  const pinnedUrlSetting: PinnedUrlSetting = {
    id: id ?? nanoid(),
    url: url,
    matchType: matchType,
    matchPattern: matchPattern,
  };

  try {
    const currentSettings = await pinnedUrlSettingsStorage.getValue();

    const updatedPinnedUrlSettings =
      id != null
        ? currentSettings.map((pinnedUrl) =>
            pinnedUrl.id === id ? pinnedUrlSetting : pinnedUrl,
          ) // Edit
        : [...currentSettings, pinnedUrlSetting]; // Add

    await pinnedUrlSettingsStorage.setValue(updatedPinnedUrlSettings);

    return {
      success: true,
      data: pinnedUrlSetting,
    };
  } catch (error) {
    console.error('Failed to edit URL:', error);

    return {
      success: false,
      error: error instanceof Error ? error : new Error('Failed to edit URL'),
    };
  }
}

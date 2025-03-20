import { pinnedUrlSettingsStorage } from '@/utils/storage';

export type DeleteUrlState =
  | { success: true; deletedId: string }
  | { success: false; error: Error }
  | null;

export async function deleteUrlFromStorage(
  _prevState: DeleteUrlState,
  id: string,
): Promise<DeleteUrlState> {
  if (!id) {
    return { success: false, error: new Error('No ID provided') };
  }

  try {
    const currentSettings = await pinnedUrlSettingsStorage.getValue();
    const updatedSettings = currentSettings.filter(
      (pinnedUrl) => pinnedUrl.id !== id,
    );
    await pinnedUrlSettingsStorage.setValue(updatedSettings);

    return { success: true, deletedId: id };
  } catch (error) {
    console.error('Failed to delete URL:', error);

    return {
      success: false,
      error: error instanceof Error ? error : new Error('Failed to delete URL'),
    };
  }
}

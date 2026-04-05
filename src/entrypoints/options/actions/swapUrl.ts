import { pinnedUrlSettingsStorage } from '@/utils/storage';

export async function swapUrlInStorage(
  initialIndex: number,
  newIndex: number,
): Promise<void> {
  const pinnedUrls = await pinnedUrlSettingsStorage.getValue();

  if (
    initialIndex < 0 ||
    initialIndex >= pinnedUrls.length ||
    newIndex < 0 ||
    newIndex >= pinnedUrls.length
  ) {
    throw new Error('Invalid indices provided for swapping.');
  }

  const [movedUrl] = pinnedUrls.splice(initialIndex, 1);
  pinnedUrls.splice(newIndex, 0, movedUrl);

  await pinnedUrlSettingsStorage.setValue(pinnedUrls);
}

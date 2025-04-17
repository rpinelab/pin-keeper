import { arrayMove } from '@dnd-kit/sortable';

import { pinnedUrlSettingsStorage } from '@/utils/storage';

export async function swapUrlInStorage(
  activeId: string,
  overId: string,
): Promise<void> {
  const pinnedUrls = await pinnedUrlSettingsStorage.getValue();

  const oldIndex = pinnedUrls.findIndex((item) => item.id === activeId);
  const newIndex = pinnedUrls.findIndex((item) => item.id === overId);

  if (oldIndex === -1 || newIndex === -1) {
    throw new Error('Invalid IDs provided for swapping.');
  }

  const newOrder = arrayMove(pinnedUrls, oldIndex, newIndex);

  await pinnedUrlSettingsStorage.setValue(newOrder);
}

import { closestCenter } from '@dnd-kit/collision';
import { useSortable } from '@dnd-kit/react/sortable';
import type { CSSProperties } from 'react';

import type { PinnedUrlSetting } from '@/utils/storage';

import { PinnedUrlItem } from './PinnedUrlItem';

export function SortablePinnedUrlItem({
  pinnedUrl,
  index,
  editUrl,
  deleteUrl,
}: {
  pinnedUrl: PinnedUrlSetting;
  index: number;
  editUrl: (id: string) => void;
  deleteUrl: (id: string) => void;
}) {
  const sortable = useSortable({
    id: pinnedUrl.id,
    index,
    collisionDetector: closestCenter,
  });

  const style = {
    touchAction: 'none',
  } satisfies CSSProperties;

  return (
    <li ref={sortable.ref} style={style}>
      <PinnedUrlItem
        editUrl={editUrl}
        deleteUrl={deleteUrl}
        pinnedUrl={pinnedUrl}
      />
    </li>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';

import type { PinnedUrlSetting } from '@/utils/storage';

import { PinnedUrlItem } from './PinnedUrlItem';

export function SortablePinnedUrlItem({
  pinnedUrl,
  editUrl,
  deleteUrl,
}: {
  pinnedUrl: PinnedUrlSetting;
  editUrl: (id: string) => void;
  deleteUrl: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: pinnedUrl.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  } satisfies CSSProperties;

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PinnedUrlItem
        editUrl={editUrl}
        deleteUrl={deleteUrl}
        pinnedUrl={pinnedUrl}
      />
    </li>
  );
}

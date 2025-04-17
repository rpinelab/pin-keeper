import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { PinnedUrlSetting } from '@/utils/storage';

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
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PinnedUrlItem
        editUrl={editUrl}
        deleteUrl={deleteUrl}
        pinnedUrl={pinnedUrl}
      />
    </div>
  );
}

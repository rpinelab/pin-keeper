import { Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type PinnedUrlSetting, urlMatchTypeLabels } from '@/utils/storage';

interface PinnedUrlItemProps {
  editUrl: (id: string) => void;
  deleteUrl: (id: string) => void;
  pinnedUrl: PinnedUrlSetting;
}

export function PinnedUrlItem({
  editUrl,
  deleteUrl,
  pinnedUrl,
}: PinnedUrlItemProps) {
  return (
    <div className='flex items-center gap-2 bg-secondary text-secondary-foreground p-2 rounded select-none'>
      <div className='flex items-center gap-2 grow min-w-0'>
        <span
          className='text-sm grow break-all line-clamp-2'
          title={pinnedUrl.url}
        >
          {pinnedUrl.url}
        </span>
        <span className='text-sm text-muted-foreground'>
          {urlMatchTypeLabels[pinnedUrl.matchType]}
        </span>
        {pinnedUrl.matchPattern && (
          <span
            className='text-sm text-muted-foreground italic break-all line-clamp-2'
            title={pinnedUrl.matchPattern}
          >
            {pinnedUrl.matchPattern}
          </span>
        )}
      </div>
      <Button
        type='button'
        variant='default'
        size='icon'
        onClick={() => {
          editUrl(pinnedUrl.id);
        }}
        className='grow-0'
      >
        <Edit2 className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant='destructive'
        size='icon'
        onClick={() => {
          deleteUrl(pinnedUrl.id);
        }}
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}

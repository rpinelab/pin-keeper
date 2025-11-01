import { Edit2, GripVertical, Trash2 } from 'lucide-react';

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
    <div className='flex items-center gap-3 bg-card border border-border hover:border-muted-foreground/50 transition-colors p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing select-none group'>
      <GripVertical className='h-5 w-5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0' />
      <div className='flex flex-col gap-2 grow min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span
            className='text-sm font-medium break-all line-clamp-1 flex-1'
            title={pinnedUrl.url}
          >
            {pinnedUrl.url}
          </span>
          <span className='text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium shrink-0'>
            {urlMatchTypeLabels[pinnedUrl.matchType]}
          </span>
        </div>
        {pinnedUrl.matchPattern && (
          <div className='flex items-center gap-1.5'>
            <span className='text-xs text-muted-foreground shrink-0'>
              Pattern:
            </span>
            <span
              className='text-xs text-muted-foreground italic break-all line-clamp-1 font-mono'
              title={pinnedUrl.matchPattern}
            >
              {pinnedUrl.matchPattern}
            </span>
          </div>
        )}
      </div>
      <div className='flex gap-2 shrink-0'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => {
            editUrl(pinnedUrl.id);
          }}
          className='hover:bg-muted'
          title='Edit this URL'
        >
          <Edit2 className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => {
            deleteUrl(pinnedUrl.id);
          }}
          className='hover:bg-destructive/10 hover:text-destructive'
          title='Delete this URL'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

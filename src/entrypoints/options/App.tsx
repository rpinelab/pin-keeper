import { Edit2, Plus, Save, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePinnedUrlSettings } from '@/hooks/usePinnedUrlSettings';
import {
  PinnedUrlSetting,
  UrlMatchType,
  urlMatchTypeLabels,
  urlMatchTypes,
} from '@/utils/storage';

function App() {
  const [pinnedUrlSettings, setPinnedUrlSettings] = usePinnedUrlSettings();
  const [editingId, setEditingId] = useState<string | null>(null);

  const addUrl = (formData: FormData) => {
    const url = formData.get('url') as string;
    const matchType = formData.get('matchType') as UrlMatchType;

    if (url == '') {
      window.alert('URL is required');
      return;
    }

    try {
      new URL(url);
    } catch {
      window.alert('Invalid URL');
      return;
    }

    setPinnedUrlSettings([
      ...pinnedUrlSettings,
      { id: nanoid(), url: url, matchType: matchType },
    ]);
  };

  const editUrl = (formData: FormData) => {
    const url = formData.get('url') as string;
    const matchType = formData.get('matchType') as UrlMatchType;

    if (url == '') {
      window.alert('URL is required');
      return;
    }

    try {
      new URL(url);
    } catch {
      window.alert('Invalid URL');
      return;
    }

    setPinnedUrlSettings(
      pinnedUrlSettings.map((pinnedUrl) => {
        if (pinnedUrl.id === editingId) {
          return { id: pinnedUrl.id, url: url, matchType: matchType };
        }
        return pinnedUrl;
      }),
    );
    setEditingId(null);
  };

  const deleteUrl = (id: string) => {
    setPinnedUrlSettings(
      pinnedUrlSettings.filter((pinnedUrl) => pinnedUrl.id !== id),
    );
  };

  const startEditUrl = (id: string) => {
    setEditingId(id);
  };

  return (
    <main className='flex flex-col gap-2 bg-background min-h-screen p-4 min-w-[800px]'>
      <header className='border-b border-foreground'>
        <h1 className='text-3xl font-bold border-b border-foreground pb-1'>
          PinKeeper Option
        </h1>
      </header>
      <h2 className='text-xl'>Pinned URLs</h2>
      <EditPinnedUrlForm action={addUrl} submitText='Add' />
      <section className='flex flex-col gap-2 mt-4'>
        <ul className='flex flex-col gap-2'>
          {pinnedUrlSettings.length === 0 && (
            <li className='text-muted-foreground'>No pinned URLs</li>
          )}
          {pinnedUrlSettings.map((pinnedUrl) => (
            <li key={pinnedUrl.id}>
              {editingId === pinnedUrl.id ? (
                <EditPinnedUrlForm
                  action={editUrl}
                  initialValue={pinnedUrl}
                  submitText='Save'
                />
              ) : (
                <PinnedUrlItem
                  editUrl={startEditUrl}
                  deleteUrl={deleteUrl}
                  pinnedUrl={pinnedUrl}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;

function EditPinnedUrlForm({
  action: addUrl,
  initialValue,
  submitText = 'Add',
}: {
  action: (formData: FormData) => void;
  initialValue?: PinnedUrlSetting;
  submitText?: string;
}) {
  return (
    <form className='flex gap-2' action={addUrl}>
      <Input
        name='url'
        type='text'
        defaultValue={initialValue?.url}
        placeholder='Enter URL to pin'
      />
      <Select
        defaultValue={initialValue?.matchType ?? 'exact'}
        name='matchType'
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Match Strategy' />
        </SelectTrigger>
        <SelectContent>
          {urlMatchTypes.map((matchType) => (
            <SelectItem key={matchType.value} value={matchType.value}>
              {matchType.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type='submit'>
        {submitText === 'Add' ? (
          <Plus className='h-4 w-4' />
        ) : (
          <Save className='h-4 w-4' />
        )}
        {submitText}
      </Button>
    </form>
  );
}

interface PinnedUrlItemProps {
  editUrl: (id: string) => void;
  deleteUrl: (id: string) => void;
  pinnedUrl: PinnedUrlSetting;
}

function PinnedUrlItem({ editUrl, deleteUrl, pinnedUrl }: PinnedUrlItemProps) {
  return (
    <div className='flex items-center gap-2 bg-secondary text-secondary-foreground p-2 rounded'>
      <span className='text-sm grow'>{pinnedUrl.url}</span>
      <span className='text-sm text-muted-foreground'>
        {urlMatchTypeLabels[pinnedUrl.matchType]}
      </span>
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

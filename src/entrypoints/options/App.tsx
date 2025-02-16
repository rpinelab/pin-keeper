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
import { UrlMatchType } from '@/utils/storage';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

function App() {
  const [pinnedUrlSettings, setPinnedUrlSettings] = usePinnedUrlSettings();

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

  const deleteUrl = (id: string) => () => {
    setPinnedUrlSettings(
      pinnedUrlSettings.filter((pinnedUrl) => pinnedUrl.id !== id),
    );
  };

  return (
    <main className='flex flex-col gap-2 bg-background min-h-screen p-4 min-w-[800px]'>
      <header className='border-b border-foreground'>
        <h1 className='text-3xl font-bold border-b border-foreground pb-1'>
          PinKeeper Option
        </h1>
      </header>
      <h2 className='text-xl'>Pinned URLs</h2>
      <form className='flex gap-2 m-2' action={addUrl}>
        <Input name='url' type='text' placeholder='Enter URL to pin' />
        <Select defaultValue='exact' name='matchType'>
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
          <Plus className='h-4 w-4' />
          Add
        </Button>
      </form>
      <section className='flex flex-col gap-2'>
        <ul className='flex flex-col gap-2 mx-2'>
          {pinnedUrlSettings.length === 0 && (
            <li className='text-muted-foreground'>No pinned URLs</li>
          )}
          {pinnedUrlSettings.map((pinnedUrl) => (
            <li
              key={pinnedUrl.id}
              className='flex items-center gap-2 bg-secondary text-secondary-foreground p-2 rounded'
            >
              <span className='text-sm grow'>{pinnedUrl.url}</span>
              <span className='text-sm text-muted-foreground'>
                {urlMatchTypeLabels[pinnedUrl.matchType]}
              </span>
              <Button
                type='button'
                variant='destructive'
                size='icon'
                onClick={deleteUrl(pinnedUrl.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;

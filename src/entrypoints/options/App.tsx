import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePinnedUrlSettings } from '@/hooks/usePinnedUrlSettings';
import { nanoid } from 'nanoid';

function App() {
  const [pinnedUrlSettings, setPinnedUrlSettings] = usePinnedUrlSettings();

  const addUrl = (formData: FormData) => {
    const url = formData.get('url') as string;

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
      { id: nanoid(), url: url, matchType: 'exact' },
    ]);
  };

  const deleteUrl = (id: string) => () => {
    setPinnedUrlSettings(
      pinnedUrlSettings.filter((pinnedUrl) => pinnedUrl.id !== id),
    );
  };

  return (
    <main className='flex flex-col gap-2 bg-background min-h-screen p-4'>
      <h1 className='text-3xl'>PinKeeper Option</h1>
      <h2 className='text-xl'>Pinned URLs</h2>
      <section className='flex flex-col gap-2'>
        <ul className='flex flex-col gap-2 mx-2'>
          {pinnedUrlSettings.length === 0 && (
            <li className='text-muted-foreground'>No pinned URLs</li>
          )}
          {pinnedUrlSettings.map((pinnedUrl) => (
            <li key={pinnedUrl.id} className='flex gap-2'>
              <Input name='url' type='text' readOnly value={pinnedUrl.url} />
              <Button type='button' onClick={deleteUrl(pinnedUrl.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
        <form className='flex gap-2 m-2' action={addUrl}>
          <Input name='url' type='text' placeholder='URL' />
          <Button type='submit'>Add</Button>
        </form>
      </section>
    </main>
  );
}

export default App;

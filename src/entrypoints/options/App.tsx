import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function App() {
  const [pinnedUrls, setPinnedUrls] = useState<string[]>([
    'https://www.google.com',
  ]);

  const addUrl = (formData: FormData) => {
    const url = formData.get('url') as string;

    if (url == '') {
      return;
    }

    setPinnedUrls([...pinnedUrls, url]);
  };

  return (
    <main className='flex flex-col gap-4 bg-background min-h-screen p-4'>
      <h1 className='text-3xl'>PinKeeper Option</h1>
      <h2 className='text-xl'>Pinned URLs</h2>
      <section className='flex flex-col gap-2'>
        <ul className='m-2 p-2'>
          {pinnedUrls.map((url, index) => (
            <li key={index}>
              <Input name='url' type='text' readOnly value={url} />
            </li>
          ))}
        </ul>
        <form className='flex gap-2 p-2' action={addUrl}>
          <Input name='url' type='text' placeholder='URL' />
          <Button type='submit'>Add</Button>
        </form>
      </section>
    </main>
  );
}

export default App;

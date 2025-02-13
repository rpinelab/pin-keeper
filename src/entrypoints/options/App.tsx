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
    <main className='p-4'>
      <h1 className='text-3xl my-2'>PinKeeper Option</h1>
      <h2 className='text-xl my-2'>Pinned URLs</h2>
      <ul className='list-disc ml-4 my-2'>
        {pinnedUrls.map((url, index) => (
          <li key={index}>{url}</li>
        ))}
      </ul>
      <form className='my-2' action={addUrl}>
        <input name='url' type='text' className='bg-white text-black' />
        <button
          type='submit'
          className='bg-gray-300 text-black rounded-sm mx-2 px-2 py-1'
        >
          Add
        </button>
      </form>
    </main>
  );
}

export default App;

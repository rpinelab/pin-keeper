import './App.css';

function App() {
  const [pinnedUrls, setPinnedUrls] = useState<string[]>(['https://www.google.com']);

  const addUrl = (formData: FormData) => {
    const url = formData.get('url') as string;

    if (url == '') {
      return;
    }

    setPinnedUrls([...pinnedUrls, url]);
  }

  return (
    <>
      <h1>PinKeeper Option</h1>
      <h2>Pinned URLs</h2>
      <ul>
        {pinnedUrls.map((url, index) => (
          <li key={index}>{url}</li>
        ))}
      </ul>
      <form action={addUrl}>
        <input name='url' type="text" />
        <button type='submit'>Add</button>
      </form>
    </>
  );
}

export default App;

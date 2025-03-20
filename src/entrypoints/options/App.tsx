import { useActionState, useEffect, useState } from 'react';

import { usePinnedUrlSettings } from '@/hooks/usePinnedUrlSettings';

import { deleteUrlFromStorage } from './actions/deleteUrl';
import { editUrlInStorage } from './actions/editUrl';
import { EditPinnedUrlForm } from './components/EditPinnedUrlForm';
import { PinnedUrlItem } from './components/PinnedUrlItem';

function App() {
  const [pinnedUrlSettings] = usePinnedUrlSettings();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editUrlState, editUrl] = useActionState(
    editUrlInStorage.bind(null),
    null,
  );

  useEffect(() => {
    if (editUrlState?.success === false && editUrlState.error) {
      window.alert(editUrlState.error.message);
    }
    if (editUrlState?.success) {
      setEditingId(null);
    }
  }, [editUrlState]);

  const [deleteUrlState, deleteUrl] = useActionState(
    deleteUrlFromStorage,
    null,
  );

  useEffect(() => {
    if (deleteUrlState?.success === false && deleteUrlState.error) {
      window.alert(deleteUrlState.error.message);
    }
  }, [deleteUrlState]);

  const startEditUrl = (id: string) => {
    setEditingId(id);
  };

  return (
    <main className='flex flex-col gap-2 bg-background min-h-screen p-4 min-w-[600px]'>
      <header className='border-b border-foreground'>
        <h1 className='text-3xl font-bold border-b border-foreground pb-1'>
          PinKeeper Option
        </h1>
      </header>
      <h2 className='text-xl'>Pinned URLs</h2>
      <EditPinnedUrlForm action={editUrl} submitText='Add' />
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

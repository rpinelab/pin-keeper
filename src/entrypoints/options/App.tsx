import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useActionState, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAutoRestoreEnabled } from '@/hooks/useAutoRestoreEnabled';
import { usePinnedUrlSettings } from '@/hooks/usePinnedUrlSettings';

import { addCurrentPinnedTabsToStorage } from './actions/addCurrentPinnedTabs';
import { deleteUrlFromStorage } from './actions/deleteUrl';
import { editUrlInStorage } from './actions/editUrl';
import { swapUrlInStorage } from './actions/swapUrl';
import { EditPinnedUrlForm } from './components/EditPinnedUrlForm';
import { SortablePinnedUrlItem } from './components/SortablePinnedUrlItem';

function App() {
  const [pinnedUrlSettings] = usePinnedUrlSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [autoRestoreEnabled, updateAutoRestoreEnabled] =
    useAutoRestoreEnabled();

  const onToggleAutoRestoreEnabled = (value: boolean) => {
    updateAutoRestoreEnabled(value);
  };

  const [editUrlState, editUrl] = useActionState(editUrlInStorage, null);

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

  const [addCurrentTabsState, addCurrentTabs] = useActionState(
    addCurrentPinnedTabsToStorage,
    null,
  );

  useEffect(() => {
    if (addCurrentTabsState?.success === false && addCurrentTabsState.error) {
      window.alert(addCurrentTabsState.error.message);
    }
  }, [addCurrentTabsState]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over !== null && active.id !== over.id) {
      void swapUrlInStorage(active.id as string, over.id as string);
    }
  };

  return (
    <main className='flex flex-col gap-4 bg-background min-h-screen p-4 min-w-[600px]'>
      <header className='border-b border-foreground'>
        <h1 className='text-3xl font-bold border-b border-foreground pb-1'>
          PinKeeper Option
        </h1>
      </header>
      <div className='flex items-center space-x-2'>
        <Switch
          id='auto-restore-toggle'
          checked={autoRestoreEnabled}
          onCheckedChange={onToggleAutoRestoreEnabled}
        />
        <Label htmlFor='auto-restore-toggle'>
          Enable Auto-Restore Pinned URLs on Browser Startup
        </Label>
      </div>
      <h2 className='text-xl'>Pinned URLs</h2>
      <EditPinnedUrlForm action={editUrl} submitText='Add' />
      <div className='flex justify-end'>
        <Button type='button' variant='secondary' onClick={addCurrentTabs}>
          Add Current Pinned Tabs
        </Button>
      </div>
      <section className='flex flex-col gap-2 mt-4'>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pinnedUrlSettings}
            strategy={verticalListSortingStrategy}
          >
            <ul className='flex flex-col gap-2'>
              {pinnedUrlSettings.length === 0 && (
                <li className='text-muted-foreground'>No pinned URLs</li>
              )}
              {pinnedUrlSettings.map((pinnedUrl) => (
                <li key={pinnedUrl.id}>
                  {editingId === pinnedUrl.id ? (
                    <EditPinnedUrlForm
                      cancelEdit={() => {
                        setEditingId(null);
                      }}
                      action={editUrl}
                      initialValue={pinnedUrl}
                      submitText='Save'
                    />
                  ) : (
                    <SortablePinnedUrlItem
                      pinnedUrl={pinnedUrl}
                      editUrl={setEditingId}
                      deleteUrl={deleteUrl}
                    />
                  )}
                </li>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </section>
    </main>
  );
}

export default App;

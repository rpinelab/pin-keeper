import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useActionState, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAutoRestoreDelay } from '@/hooks/useAutoRestoreDelay';
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
  const [autoRestoreDelay, updateAutoRestoreDelay] = useAutoRestoreDelay();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onToggleAutoRestoreEnabled = (value: boolean) => {
    updateAutoRestoreEnabled(value);
  };

  const onChangeAutoRestoreDelay = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      updateAutoRestoreDelay(value);
    }
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
          Enable Auto-Restore of Pinned Tabs on Browser Startup
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
          sensors={sensors}
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
      <div className='flex items-center'>
        <Label htmlFor='auto-restore-delay'>Startup Auto-Restore Delay</Label>
        <Input
          id='auto-restore-delay'
          type='number'
          value={autoRestoreDelay}
          onChange={onChangeAutoRestoreDelay}
          className='border rounded ml-4 mr-1 px-2 py-1 w-24'
          min={0}
          max={10000}
        />
        <span>ms</span>
      </div>
    </main>
  );
}

export default App;

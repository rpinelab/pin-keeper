import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ChevronDown } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);
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
    const value = Number.parseInt(event.target.value, 10);
    if (!Number.isNaN(value)) {
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
    <main className='flex flex-col gap-4 bg-background min-h-screen p-4 min-w-[600px] select-none'>
      <header>
        <h1 className='text-3xl font-bold border-b border-foreground pb-2'>
          PinKeeper Options
        </h1>
      </header>
      <section className='flex flex-col gap-4 border border-gray-200 rounded-lg p-4'>
        <h2 className='text-xl font-semibold'>Auto-Restore Settings</h2>
        <div className='flex items-center space-x-2'>
          <Switch
            id='auto-restore-toggle'
            checked={autoRestoreEnabled}
            onCheckedChange={onToggleAutoRestoreEnabled}
          />
          <Label htmlFor='auto-restore-toggle'>
            Automatically restore pinned tabs when browser starts
          </Label>
        </div>
        <div className='flex items-center gap-2'>
          <Label htmlFor='auto-restore-delay' className='min-w-fit'>
            Delay before restoring tabs
          </Label>
          <Input
            id='auto-restore-delay'
            type='number'
            value={autoRestoreDelay}
            onChange={onChangeAutoRestoreDelay}
            className='w-24'
            min={0}
            max={10000}
          />
          <span className='text-sm text-muted-foreground'>ms</span>
        </div>
      </section>
      <section className='flex flex-col gap-4 border border-gray-200 rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Pinned URLs</h2>
          <Button type='button' variant='secondary' onClick={addCurrentTabs}>
            Add Current Pinned Tabs
          </Button>
        </div>
        <Collapsible
          open={isAddFormExpanded}
          onOpenChange={setIsAddFormExpanded}
        >
          <CollapsibleTrigger asChild>
            <Button
              type='button'
              variant='outline'
              className='w-full justify-between'
            >
              Add New URL
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isAddFormExpanded ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='mt-2'>
            <EditPinnedUrlForm action={editUrl} submitText='Add' />
          </CollapsibleContent>
        </Collapsible>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={pinnedUrlSettings}
            strategy={verticalListSortingStrategy}
          >
            <ul className='flex flex-col gap-2'>
              {pinnedUrlSettings.length === 0 && (
                <li className='text-muted-foreground'>No pinned URLs</li>
              )}
              {pinnedUrlSettings.map((pinnedUrl) =>
                editingId === pinnedUrl.id ? (
                  <li key={pinnedUrl.id}>
                    <EditPinnedUrlForm
                      cancelEdit={() => {
                        setEditingId(null);
                      }}
                      action={editUrl}
                      initialValue={pinnedUrl}
                      submitText='Save'
                    />
                  </li>
                ) : (
                  <SortablePinnedUrlItem
                    key={pinnedUrl.id}
                    pinnedUrl={pinnedUrl}
                    editUrl={setEditingId}
                    deleteUrl={deleteUrl}
                  />
                ),
              )}
            </ul>
          </SortableContext>
        </DndContext>
      </section>
    </main>
  );
}

export default App;

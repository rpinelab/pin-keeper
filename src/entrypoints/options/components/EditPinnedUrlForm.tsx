import { Plus, Save, X } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PinnedUrlSetting, urlMatchTypes } from '@/utils/storage';

export function EditPinnedUrlForm({
  action: addUrl,
  initialValue,
  submitText = 'Add',
  cancelEdit,
}: {
  action: (formData: FormData) => void;
  initialValue?: PinnedUrlSetting;
  submitText?: string;
  cancelEdit?: () => void;
}) {
  return (
    <form className='grid grid-cols-[1fr_auto] gap-3' action={addUrl}>
      {initialValue && (
        <input type='hidden' name='id' value={initialValue.id} />
      )}
      <Input
        name='url'
        type='text'
        defaultValue={initialValue?.url}
        placeholder='URL to pin'
        className='flex-grow'
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
      <Input
        name='matchPattern'
        type='text'
        defaultValue={initialValue?.matchPattern}
        placeholder='Match pattern (defaults to URL if left empty)'
        className='flex-grow'
      />
      <div className='flex justify-end gap-2'>
        <SubmitButton submitText={submitText} />
        {cancelEdit && (
          <Button type='button' variant='outline' onClick={cancelEdit}>
            <X className='h-4 w-4' />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function SubmitButton({ submitText }: { submitText: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {submitText === 'Add' ? (
        <Plus className='h-4 w-4' />
      ) : (
        <Save className='h-4 w-4' />
      )}
      {submitText}
    </Button>
  );
}

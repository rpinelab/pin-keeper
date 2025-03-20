import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select';
import { Plus, Save } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PinnedUrlSetting, urlMatchTypes } from '@/utils/storage';

export function EditPinnedUrlForm({
  action: addUrl,
  initialValue,
  submitText = 'Add',
}: {
  action: (formData: FormData) => void;
  initialValue?: PinnedUrlSetting;
  submitText?: string;
}) {
  return (
    <form className='flex gap-2' action={addUrl}>
      {initialValue && (
        <input type='hidden' name='id' value={initialValue.id} />
      )}
      <Input
        name='url'
        type='text'
        defaultValue={initialValue?.url}
        placeholder='Enter URL to pin'
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
      <SubmitButton submitText={submitText} />
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

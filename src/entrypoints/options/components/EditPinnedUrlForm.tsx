import { Plus, Save, X, TestTubeDiagonal } from 'lucide-react';
import { useState } from 'react';
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
import { PinnedUrlSetting, UrlMatchType, urlMatchTypes } from '@/utils/storage';
import { createTabUrlMatcher } from '@/utils/tabManager';

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
  const [url, setUrl] = useState(initialValue?.url ?? '');
  const [matchType, setMatchType] = useState(
    initialValue?.matchType ?? 'exact',
  );
  const [matchPattern, setMatchPattern] = useState(
    initialValue?.matchPattern ?? '',
  );
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestSectionVisible, setIsTestSectionVisible] = useState(false);

  const handleTestUrlChange = (value: string) => {
    setTestUrl(value);

    if (!value) {
      setTestResult(null);
      return;
    }

    try {
      const matcher = createTabUrlMatcher({
        url,
        matchType,
        matchPattern,
      });

      const isMatch = matcher({ url: value });
      setTestResult(
        isMatch
          ? 'The URL matches the pattern.'
          : 'The URL does not match the pattern.',
      );
    } catch (error) {
      setTestResult(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <form
      className='grid grid-cols-[auto_1fr_auto] gap-3 border p-2'
      action={addUrl}
    >
      {initialValue && (
        <input type='hidden' name='id' value={initialValue.id} />
      )}
      <Input
        name='url'
        type='text'
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        placeholder='URL to pin'
        className='col-span-3'
      />
      <Select
        value={matchType}
        onValueChange={(value) => {
          setMatchType(value as UrlMatchType);
        }}
        name='matchType'
      >
        <SelectTrigger className='w-36 min-w-fit'>
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
        value={matchPattern}
        onChange={(e) => {
          setMatchPattern(e.target.value);
        }}
        placeholder='Match pattern (defaults to URL if left empty)'
        className='flex-grow'
      />
      <div className='flex justify-end gap-2'>
        <Button
          type='button'
          variant='outline'
          onClick={() => {
            setIsTestSectionVisible(!isTestSectionVisible);
          }}
        >
          <TestTubeDiagonal className='h-4 w-4' />
          {isTestSectionVisible ? 'Hide Test' : 'Test Pattern'}
        </Button>
        <SubmitButton submitText={submitText} />
        {cancelEdit && (
          <Button type='button' variant='outline' onClick={cancelEdit}>
            <X className='h-4 w-4' />
            Cancel
          </Button>
        )}
      </div>
      {isTestSectionVisible && (
        <div className='col-span-3 mt-4'>
          <Input
            name='testUrl'
            type='text'
            value={testUrl}
            onChange={(e) => {
              handleTestUrlChange(e.target.value);
            }}
            placeholder='Enter a URL to test'
            className='w-full'
          />
          {testResult && <p className='mt-2 text-sm'>{testResult}</p>}
        </div>
      )}
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

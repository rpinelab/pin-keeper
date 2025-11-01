import { Plus, Save, TestTubeDiagonal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type PinnedUrlSetting,
  type UrlMatchType,
  urlMatchTypes,
} from '@/utils/storage';
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

  useEffect(() => {
    if (!testUrl) {
      setTestResult(null);
      return;
    }

    try {
      const matcher = createTabUrlMatcher({
        url,
        matchType,
        matchPattern,
      });

      const isMatch = matcher({ url: testUrl });
      setTestResult(
        isMatch
          ? 'The URL matches the pattern.'
          : 'The URL does not match the pattern.',
      );
    } catch (error) {
      setTestResult(`Error: ${(error as Error).message}`);
    }
  }, [url, matchType, matchPattern, testUrl]);

  return (
    <form
      className='flex flex-col border border-border rounded-lg p-4 gap-4 bg-card shadow-sm'
      action={addUrl}
    >
      {initialValue && (
        <input type='hidden' name='id' value={initialValue.id} />
      )}
      <div className='space-y-2'>
        <Label htmlFor='url' className='text-sm font-medium'>
          URL
        </Label>
        <Input
          id='url'
          name='url'
          type='text'
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          placeholder='https://example.com'
        />
      </div>
      <div className='space-y-2'>
        <Label className='text-sm font-medium'>Match Pattern</Label>
        <div className='grid grid-cols-[auto_1fr] gap-2'>
          <Select
            value={matchType}
            onValueChange={(value) => {
              setMatchType(value as UrlMatchType);
            }}
            name='matchType'
          >
            <SelectTrigger className='w-36 min-w-fit'>
              <SelectValue placeholder='Match Type' />
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
            placeholder='Custom pattern (optional)'
            className='grow'
          />
        </div>
      </div>
      {isTestSectionVisible && (
        <div className='space-y-2 p-3 bg-muted/50 rounded-md'>
          <Label htmlFor='testUrl' className='text-sm font-medium'>
            Test URL
          </Label>
          <Input
            id='testUrl'
            type='text'
            value={testUrl}
            onChange={(e) => {
              setTestUrl(e.target.value);
            }}
            placeholder='Enter URL to test'
            className='w-full'
          />
          {testResult && (
            <p
              className={`text-sm font-medium ${
                testResult.startsWith('Error')
                  ? 'text-destructive'
                  : testResult.includes('matches')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-600 dark:text-orange-400'
              }`}
            >
              {testResult}
            </p>
          )}
        </div>
      )}
      <div className='flex justify-between items-center gap-2'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => {
            setIsTestSectionVisible(!isTestSectionVisible);
          }}
        >
          <TestTubeDiagonal className='h-4 w-4 mr-2' />
          {isTestSectionVisible ? 'Hide Test' : 'Test Pattern'}
        </Button>
        <div className='flex gap-2'>
          {cancelEdit && <CancelButton cancelEdit={cancelEdit} />}
          <SubmitButton submitText={submitText} />
        </div>
      </div>
    </form>
  );
}

function SubmitButton({ submitText }: { submitText: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {submitText === 'Add' ? (
        <Plus className='h-4 w-4 mr-2' />
      ) : (
        <Save className='h-4 w-4 mr-2' />
      )}
      {submitText}
    </Button>
  );
}

function CancelButton({ cancelEdit }: { cancelEdit: () => void }) {
  return (
    <Button type='button' variant='outline' onClick={cancelEdit}>
      <X className='h-4 w-4 mr-2' />
      Cancel
    </Button>
  );
}

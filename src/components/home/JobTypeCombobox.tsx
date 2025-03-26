// components/JobTypeCombobox.tsx
'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import JobTypeSelect from './JobTypeSelect';

export function JobTypeCombobox({
  value,
  onChangeAction,
  error,
}: {
  value: string;
  onChangeAction: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  console.log('JobTypeSelect.length', JobTypeSelect.length);
  return (
    <div className='space-y-2 w-full'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {value
              ? JobTypeSelect.find((job) => job.value === value)?.label
              : 'Select surgery type...'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-full p-0'
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command className='w-[100%]'>
            <CommandInput
              placeholder='Search surgery type...'
              className='my-3'
            />
            <CommandList>
              <CommandEmpty>No surgery type found.</CommandEmpty>
              <CommandGroup>
                {JobTypeSelect.map((job) => (
                  <CommandItem
                    key={job.value}
                    value={job.value}
                    onSelect={() => {
                      onChangeAction(job.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === job.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {job.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
}

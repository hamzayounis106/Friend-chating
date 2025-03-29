'use client';
import { useState } from 'react';
import { Check, ChevronsUpDown, X, AlertCircle } from 'lucide-react';
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
import locationsTypeSelect from './LocationTypeSelect';

interface LocationComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const LocationCombobox = ({
  value = [],
  onChange,
  error,
}: LocationComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredLocations = locationsTypeSelect.filter((location) =>
    location.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (selectedLabel: string) => {
    if (!value.includes(selectedLabel)) {
      onChange([...value, selectedLabel]);
    }
    setSearchValue('');
    setOpen(false);
  };

  const handleRemove = (index: number) => {
    const newValues = [...value];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className='space-y-2 col-span-2'>
      <label className='flex items-center text-sm font-medium text-gray-700'>
        Locations
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between font-normal'
          >
            <span className='truncate'>{'Select location near you'}</span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-full p-0'
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command className='w-[100%]'>
            <CommandInput
              placeholder='Search locations...'
              value={searchValue}
              onValueChange={setSearchValue}
              className='my-3'
            />
            <CommandList>
              <CommandEmpty>No locations found.</CommandEmpty>
              <CommandGroup>
                {filteredLocations.map((location) => (
                  <CommandItem
                    key={location.value}
                    onSelect={() => handleSelect(location.label)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(location.label)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {location.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className='flex flex-wrap gap-2 mt-2'>
        {value.map((location, index) => (
          <div
            key={index}
            className='flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm'
          >
            {location}
            <button
              type='button'
              onClick={() => handleRemove(index)}
              className='ml-2 text-indigo-500 hover:text-indigo-700'
            >
              <X className='w-3 h-3' />
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className='text-sm text-red-600 flex items-start'>
          <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
          {error}
        </p>
      )}
    </div>
  );
};

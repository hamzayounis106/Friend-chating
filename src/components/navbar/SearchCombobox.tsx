// 'use client';

// import { ChevronDown, Search } from 'lucide-react';
// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Command,
//   CommandInput,
//   CommandList,
//   CommandItem,
// } from '@/components/ui/command';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import locationData from '../locations/LocationData';
// import articleData from '../articles/ArticlesData';
// import proceduresData from '../procedures/proceduresData';

// interface SearchComboboxProps {
//   type: 'locations' | 'articles' | 'procedures';
//   onSelect?: () => void; // Add this prop
// }

// export const SearchCombobox = ({ type, onSelect }: SearchComboboxProps) => {
//   const [open, setOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const router = useRouter();
//   const popoverRef = useRef<HTMLDivElement>(null);

//   // Get the appropriate data based on type
//   const getData = () => {
//     switch (type) {
//       case 'locations':
//         return locationData;
//       case 'articles':
//         return articleData;
//       case 'procedures':
//         return proceduresData;
//       default:
//         return [];
//     }
//   };

//   const filteredItems = getData().filter((item) =>
//     item.postTitle.toLowerCase().includes(searchValue.toLowerCase())
//   );

//   return (
//     <div className='relative inline-block' ref={popoverRef}>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <button className='flex items-center gap-1 group cursor-pointer bg-transparent border-none p-0'>
//             <Link
//               href={`/${type}`}
//               className='font-medium hover:text-primary transition-colors'
//               onClick={(e) => e.preventDefault()} // Prevent default to handle with Popover
//             >
//               {type.charAt(0).toUpperCase() + type.slice(1)}
//             </Link>
//             <ChevronDown className='w-4 h-4 text-gray-500 group-hover:text-primary transition-colors' />
//           </button>
//         </PopoverTrigger>
//         <PopoverContent className='w-[300px] p-0' align='start' sideOffset={5}>
//           <Command shouldFilter={false}>
//             {' '}
//             {/* Disable internal filtering since we do it manually */}
//             <div className='flex items-center border-b px-3'>
//               {/* <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' /> */}
//               <CommandInput
//                 placeholder={`Search ${type}...`}
//                 value={searchValue}
//                 onValueChange={setSearchValue}
//                 className='border-none focus:ring-0'
//               />
//             </div>
//             <CommandList>
//               {filteredItems.length === 0 ? (
//                 <div className='py-6 text-center text-sm'>No {type} found</div>
//               ) : (
//                 <div className='max-h-[300px] overflow-y-auto'>
//                   {filteredItems.map((item) => (
//                     <CommandItem
//                       key={item.id}
//                       value={item.postTitle}
//                       onSelect={() => {
//                         router.push(`/${type}/${item.postSlug}`);
//                         setOpen(false);
//                       }}
//                       className='cursor-pointer'
//                     >
//                       {item.postTitle}
//                     </CommandItem>
//                   ))}
//                 </div>
//               )}
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import locationData from '../locations/LocationData';
import articleData from '../articles/ArticlesData';
import proceduresData from '../procedures/proceduresData';

interface SearchComboboxProps {
  type: 'locations' | 'articles' | 'procedures';
  onSelect?: () => void;
}

export const SearchCombobox = ({ type, onSelect }: SearchComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Get the appropriate data based on type
  const getData = () => {
    switch (type) {
      case 'locations':
        return locationData;
      case 'articles':
        return articleData;
      case 'procedures':
        return proceduresData;
      default:
        return [];
    }
  };

  const filteredItems = getData().filter((item) =>
    item.postTitle.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleItemSelect = (slug: string) => {
    router.push(`/${type}/${slug}`);
    setOpen(false);
    onSelect?.(); // Close the sidebar when an item is selected
  };

  const handleHeadingClick = (e: React.MouseEvent) => {
    // Only navigate if clicking directly on the link text
    if (e.currentTarget === e.target) {
      router.push(`/${type}`);
      onSelect?.(); // Close the sidebar when heading is clicked
    }
  };

  return (
    <div className='relative inline-block' ref={popoverRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className='flex items-center gap-1 group'>
          <Link
            href={`/${type}`}
            onClick={handleHeadingClick}
            className='font-medium hover:text-primary transition-colors'
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Link>
          <PopoverTrigger asChild>
            <button className='flex items-center bg-transparent border-none p-0 cursor-pointer'>
              <ChevronDown className='w-4 h-4 text-gray-500 group-hover:text-primary transition-colors' />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent className='w-[300px] p-0' align='start' sideOffset={5}>
          <Command shouldFilter={false}>
            <div className='flex items-center border-b px-3'>
              <CommandInput
                placeholder={`Search ${type}...`}
                value={searchValue}
                onValueChange={setSearchValue}
                className='border-none focus:ring-0'
              />
            </div>
            <CommandList>
              {filteredItems.length === 0 ? (
                <div className='py-6 text-center text-sm'>No {type} found</div>
              ) : (
                <div className='max-h-[300px] overflow-y-auto'>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.postTitle}
                      onSelect={() => handleItemSelect(item.postSlug)}
                      className='cursor-pointer'
                    >
                      {item.postTitle}
                    </CommandItem>
                  ))}
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

'use client';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  className?: string;
}

const SearchInput = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className={`flex w-full max-w-md items-center space-x-2 ${className}`}>
      <Input
        type='text'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchIcon className='h-4 w-4 text-gray-500' />
    </div>
  );
};

export default SearchInput;

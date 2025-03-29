'use client';
import { Input } from '@/components/ui/input';
import { SearchIcon, XCircle } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div
      className={`relative w-full max-w-md transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-200 ring-opacity-50' : ''
      } rounded-lg ${className}`}
    >
      <div className="flex items-center h-10 bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-400 transition-colors">
        <div className="flex items-center justify-center pl-3 pr-2">
          <SearchIcon className="h-4 w-4 text-gray-400" />
        </div>
        
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 h-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
        />
        
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="flex items-center justify-center h-full px-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
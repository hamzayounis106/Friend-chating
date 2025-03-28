'use client';
import { useState, useMemo } from 'react';
import locationData from '@/components/locations/LocationData';
import SearchInput from '@/app/(blogs)/SearchInput';
import BlogCard from '@/app/(blogs)/BlogCard';
const LocationGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locationData;

    return locationData.filter((location) => {
      const searchContent =
        `${location.postTitle} ${location.postPara1} ${location.postPara2}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  return (
    <>
      <div className='mb-8'>
        <SearchInput
          placeholder='Search locations by name or description...'
          onSearch={setSearchTerm}
        />
      </div>

      <p className='text-sm text-gray-500 mb-4'>
        Showing {filteredLocations.length} of {locationData.length} locations
      </p>

      <div className='grid  sm:grid-cols-2  gap-6'>
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <BlogCard key={location.id} data={location} link={'locations'} />
          ))
        ) : (
          <div className='col-span-full text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No locations found matching &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default LocationGrid;

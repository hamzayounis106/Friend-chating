'use client';
import BlogCard from '@/app/(blogs)/BlogCard';
import SearchInput from '@/app/(blogs)/SearchInput';
import { useState, useMemo } from 'react';
import proceduresData from './proceduresData';

const ProcedureGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProcedures = useMemo(() => {
    if (!searchTerm.trim()) return proceduresData;

    return proceduresData.filter((procedure) => {
      console.log('Filtering procedure:', procedure);
      const searchContent =
        `${procedure?.postTitle} ${procedure?.postPara1} ${procedure?.postPara2}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  return (
    <>
      <div className='mb-8'>
        <SearchInput
          placeholder='Search procedures by title or content...'
          onSearch={setSearchTerm}
        />
      </div>

      <p className='text-sm text-gray-500 mb-4'>
        Showing {filteredProcedures.length} of {proceduresData.length}{' '}
        procedures
      </p>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProcedures.length > 0 ? (
          filteredProcedures.map((procedure) => (
            <BlogCard key={procedure.id} data={procedure} link={'procedures'} />
          ))
        ) : (
          <div className='col-span-full text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No procedures found matching &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProcedureGrid;

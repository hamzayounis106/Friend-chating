'use client';
import { useState, useMemo } from 'react';
import proceduresData from '@/components/procedures/proceduresData';
import SearchInput from '@/app/(blogs)/SearchInput';
import BlogCard from '@/app/(blogs)/BlogCard';

const ProcedureGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProcedures = useMemo(() => {
    if (!searchTerm.trim()) return proceduresData;

    return proceduresData.filter((procedure) => {
      const searchContent =
        `${procedure.postTitle} ${procedure.postPara1} `.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  return (
    <>
      <div className='mb-8'>
        <SearchInput
          placeholder='Search procedures by name or description...'
          onSearch={setSearchTerm}
        />
      </div>

      <p className='text-sm text-gray-500 mb-4'>
        Showing {filteredProcedures.length} of {proceduresData.length} procedures
      </p>

      <div className='grid sm:grid-cols-2 gap-6'>
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
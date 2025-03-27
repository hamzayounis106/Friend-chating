import proceduresData from '@/components/procedures/proceduresData';
import Image from 'next/image';
import Link from 'next/link';

const ProceduresPage = () => {
  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-8'>
        Our Surgical Procedures
      </h1>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {proceduresData.map((procedure) => (
          <Link
            key={procedure.id}
            href={`/procedures/${procedure.slug}`}
            className='bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105'
          >
            <div className='relative w-full h-56'>
              <Image
                src={procedure.images[0]} // Show the first image
                alt={procedure.title}
                layout='fill'
                objectFit='cover'
                className='rounded-t-2xl'
              />
            </div>
            <div className='p-4'>
              <h2 className='text-xl font-semibold mb-2'>{procedure.title}</h2>
              <p className='text-gray-600 text-sm'>{procedure.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProceduresPage;

import proceduresData from '@/components/procedures/proceduresData';
import ProcedureGrid from '@/components/procedures/ProceduresGrid';
import Image from 'next/image';
import Link from 'next/link';
import TopBarComp from '../TopBarComp';

const ProceduresPage = () => {
  return (
    <section>
      <TopBarComp title='Procedures' />
      <main className='container mt-12'>
        {/* <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {proceduresData.map((procedure) => (
            <Link
              key={procedure?.id}
              href={`/procedures/${procedure?.postSlug}`}
              className='bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105'
            >
              <div className='relative w-full h-56'>
                <Image
                  src={procedure?.featureImage}
                  alt={procedure?.postTitle}
                  fill
                  style={{ objectFit: 'cover' }}
                  className='rounded-t-2xl'
                />
              </div>
              <div className='p-4'>
                <h2 className='text-xl font-semibold mb-2'>
                  {procedure?.postTitle}
                </h2>
                <p className='text-gray-600 text-sm'>{procedure?.postDate}</p>
                <p className='text-gray-700 mt-2 line-clamp-2'>
                  {procedure?.postPara1}
                </p>
              </div>
            </Link>
          ))}
        </div> */}
        <ProcedureGrid />
      </main>
    </section>
  );
};

export default ProceduresPage;

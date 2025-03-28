import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Button from '../ui/button';

const surgeonsProcedures = [
  {
    title: 'Rhinoplasty (Nose Job)',
    image: '/home/topsurgeons/Rhinoplasty (Nose Job).png',
  },
  {
    title: 'Breast Augmentation',
    image: '/home/topsurgeons/Breast Augmentation.png',
  },
  {
    title: 'Hair Transplant',
    image: '/home/topsurgeons/Hair Transplant.png',
  },
  {
    title: 'Tummy Tuck',
    image: '/home/topsurgeons/Tummy Tuck.png',
  },
  {
    title: 'Liposuction',
    image: '/home/topsurgeons/Liposuction.png',
  },
  {
    title: 'Facelift',
    image: '/home/topsurgeons/Facelift.png',
  },
  {
    title: 'Dental Implants',
    image: '/home/topsurgeons/Dental Implants.png',
  },
  {
    title: 'Brazilian Butt Lift (BBL)',
    image: '/home/topsurgeons/Brazilian Butt Lift (BBL).png',
  },
];
const TopSurgeons = () => {
  return (
    <section
      className='max-w-screen-lg mx-auto mb-20 px-4 '
      id='cosmetic-procedures'
    >
      <h1 className='text-center text-4xl font-semibold my-8'>
        Find Top Surgeons for Popular Procedures
      </h1>
      <main className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {surgeonsProcedures.map((item) => {
          return (
            <div
              className='relative flex items-center justify-center pb-16'
              key={item.title}
            >
              <div className='w-full'>
                <Image
                  src={item.image}
                  alt='secition'
                  width={400}
                  height={400}
                  className='w-full'
                />
              </div>
              <div className='bg-white font-semibold text-center px-2 py-10  absolute bottom-4 w-[90%]  rounded shadow-lg'>
                <h1>{item.title}</h1>
              </div>
            </div>
          );
        })}
      </main>
      <div className='flex justify-center mt-4'>
        <Button className='flex items-center gap-2 '>
          Explore all Procedures <ArrowRight />
        </Button>
      </div>
    </section>
  );
};
export default TopSurgeons;

import Button from '@/components/ui/button';
import Link from 'next/link';

const QuestionBanner = () => {
  return (
    <div className='bg-[#18162B] rounded-lg  p-4 text-white'>
      <div className='max-w-4xl mx-auto flex flex-col  items-center justify-between gap-6'>
        <div className='space-y-1 md:space-y-2 flex-1'>
          <h1 className='text-2xl md:text-3xl font-bold'>Have any Question?</h1>
          <p className='text-gray-300 text-base md:text-lg '>
            Have any questions or need assistance? Feel free to reach
            out—we&apos;re here to help!
          </p>
        </div>

        <Button
          asChild
          className='bg-white hover:bg-gray-100 text-[#18162B] font-medium px-8 py-6 text-lg transition-colors'
        >
          <Link href='/contact'>Contact Us</Link>
        </Button>
      </div>
    </div>
  );
};

export default QuestionBanner;

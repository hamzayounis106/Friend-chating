import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const QuestionBanner = () => {
  return (
    <div className='bg-[#18162B] rounded-lg p-6 md:p-8 text-white'>
      <div className='max-w-4xl mx-auto flex flex-col gap-6 md:gap-8'>
        <div className='space-y-2 md:space-y-3 flex-1'>
          <h1 className='text-2xl md:text-3xl font-bold'>Have any Question?</h1>
          <p className='text-gray-300 text-base md:text-lg'>
            Have any questions or need assistance? Feel free to reach
            out—we&apos;re here to help!
          </p>
        </div>

        <Button
          asChild
          className='bg-white hover:bg-gray-100 text-[#18162B] font-medium px-6 py-3 text-lg transition-colors w-max shadow-md hover:shadow-lg flex items-center gap-2'
        >
          <Link href='/contact'>
            Contact Us
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default QuestionBanner;
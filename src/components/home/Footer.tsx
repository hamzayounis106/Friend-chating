import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';
import Newsletter from './NewsLetter';

const Footer = () => {
  // Links that should scroll to sections
  const scrollLinks = [
    { id: 1, link: 'how-it-works', title: 'How it works' },
    { id: 2, link: 'cosmetic-procedures', title: 'Cosmetic Procedures' },
    { id: 3, link: 'post-job', title: 'Post Job' },
    { id: 5, link: 'faq-link', title: 'FAQs' },
  ];

  // Links that should navigate to pages
  const pageLinks = [{ id: 6, link: '/contact', title: 'Contact us' }];

  const usefulLinks = [
    { id: 1, link: '/refund-returns', title: 'Refund & Returns Policy' },
    { id: 2, link: '/terms', title: 'Terms and Conditions' },
    { id: 4, link: '/privacy', title: 'Privacy Policy' },
  ];

  // const socialLinks = [
  //   { id: 1, icon: Facebook, link: 'https://facebook.com' },
  //   { id: 2, icon: Twitter, link: 'https://twitter.com' },
  //   { id: 3, icon: Instagram, link: 'https://instagram.com' },
  //   { id: 4, icon: Linkedin, link: 'https://linkedin.com' },
  // ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className='bg-[#E9E9E9] text-gray-800'>
      <section className='container mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          {/* Logo and Social */}
          <div className='space-y-4 lg:w-1/4'>
            <Image
              src={'/navbar/logo.png'}
              alt='logo of this site'
              width={120}
              height={40}
              quality={100}
              className='h-10 w-auto'
            />
            <p className='text-sm'>
              Connecting patients with top cosmetic surgeons worldwide.
            </p>
            {/* <div className='flex gap-4'>
              {socialLinks.map(({ id, icon: Icon, link }) => (
                <Link
                  key={id}
                  href={link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  <Icon className='h-5 w-5' />
                </Link>
              ))}
            </div> */}
          </div>

          {/* Main Links Container */}
          <div className='flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-12 lg:w-3/4'>
            {/* Quick Links */}
            <div className='space-y-4 w-full md:w-auto'>
              <h3 className='text-lg font-semibold'>Quick Links</h3>
              <div className='grid grid-cols-1 gap-x-4 gap-y-2'>
                {/* Scroll links */}
                {scrollLinks.map(({ id, link, title }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(link)}
                    className='text-left text-gray-600 hover:text-primary transition-colors'
                  >
                    {title}
                  </button>
                ))}

                {/* Page navigation links */}
                {pageLinks.map(({ id, link, title }) => (
                  <Link
                    key={id}
                    href={link}
                    className='text-gray-600 hover:text-primary transition-colors'
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div className='space-y-4 w-full md:w-auto'>
              <h3 className='text-lg font-semibold'>Useful Links</h3>
              <div className='grid grid-cols-1 gap-x-4 gap-y-2'>
                {usefulLinks.map(({ id, link, title }) => (
                  <Link
                    key={id}
                    href={link}
                    className='text-gray-600 hover:text-primary transition-colors'
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </div>

            <Newsletter />
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-gray-300 mt-12 pt-8 text-center text-gray-600'>
          <p>© {new Date().getFullYear()} SurgeonTrust. All rights reserved.</p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;

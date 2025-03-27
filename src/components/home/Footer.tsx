import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';
import Newsletter from './NewsLetter';

const Footer = () => {
  const usefulLinks = [
    { id: 1, link: '/privacy', title: 'Privacy Policy' },
    { id: 2, link: '/faq', title: 'FAQ' },
    { id: 3, link: '/terms', title: 'Terms & Conditions' },
  ];

  const socialLinks = [
    { id: 1, icon: Facebook, link: 'https://facebook.com' },
    { id: 2, icon: Twitter, link: 'https://twitter.com' },
    { id: 3, icon: Instagram, link: 'https://instagram.com' },
    { id: 4, icon: Linkedin, link: 'https://linkedin.com' },
  ];

  const baseLinks = [
    { id: 41, link: '/', title: 'Home' },
    { id: 21, link: '/about', title: 'About Us' },
    { id: 646, link: '/services', title: 'Services' },
    { id: 60, link: '/pricing', title: 'Pricing' },
    { id: 23, link: '/contact', title: 'Contact Us' },
  ];

  return (
    <footer className='bg-[#1B192A] text-white'>
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
            <div className='flex gap-4'>
              {socialLinks.map(({ id, icon: Icon, link }) => (
                <Link
                  key={id}
                  href={link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white hover:text-primary transition-colors'
                >
                  <Icon className='h-5 w-5' />
                </Link>
              ))}
            </div>
          </div>

          {/* Main Links Container */}
          <div className='flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-12 lg:w-3/4'>
            {/* Quick Links */}
            <div className='space-y-4 w-full md:w-auto'>
              <h3 className='text-lg font-semibold'>Quick Links</h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-x-4 gap-y-2'>
                {baseLinks.map(({ id, link, title }) => (
                  <Link
                    key={id}
                    href={link}
                    className='text-white hover:text-primary transition-colors'
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </div>
            {/* Useful Links */}
            <div className='space-y-4 w-full md:w-auto'>
              <h3 className='text-lg font-semibold'>Useful Links</h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-x-4 gap-y-2'>
                {usefulLinks.map(({ id, link, title }) => (
                  <Link
                    key={id}
                    href={link}
                    className='text-white hover:text-primary transition-colors'
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
        <div className='border-t border-gray-800 mt-12 pt-8 text-center text-white'>
          <p>© {new Date().getFullYear()} SurgeonTrust. All rights reserved.</p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NavLinks } from './NavLinks';
import { UserDropdown, AuthButtons } from './UserAuthSection';
import { MobileMenu } from './MobileMenu';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <nav className='w-full  bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0 w-44'>
            <Link href='/' className='flex items-center'>
              <Image
                src='/navbar/logo.png'
                alt='RTraders Logo'
                width={120}
                height={40}
                quality={100}
                className='h-10 w-auto'
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-8'>
            <div className='flex gap-8'>
              <NavLinks />
            </div>
          </div>

          {/* Auth Section */}
          <div className='flex items-center justify-end gap-4 w-44'>
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <div className='hidden md:block'>
                <AuthButtons />
              </div>
            )}
            <MobileMenu isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

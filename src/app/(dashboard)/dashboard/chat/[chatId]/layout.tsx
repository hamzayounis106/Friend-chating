'use client';

import React, { ReactNode, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { MessageSquare, Clipboard, CreditCard, ChevronLeft, Menu } from 'lucide-react';
import Button from '@/components/ui/Button';

interface LayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = useMemo(() => session?.data?.user?.role, [session]);

  // Extract chatId and current page from URL
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  const chatId = pathSegments[2] || '';
  const currentPage = pathSegments[3] || '';

  // Define navigation buttons with icons
  const navItems = [
    {
      label: 'Chat',
      path: `/dashboard/chat/${chatId}`,
      active: currentPage === '',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      label: 'Job Details',
      path: `/dashboard/chat/${chatId}/job-detail`,
      active: currentPage === 'job-detail',
      icon: <Clipboard className="w-4 h-4" />
    },
    {
      label: userRole === 'patient' ? 'See Offers' : 'Send Offer',
      path: `/dashboard/chat/${chatId}/offer`,
      active: currentPage === 'offer',
      icon: <CreditCard className="w-4 h-4" />
    },
  ];

  const handleBack = () => {
    router.push('/dashboard/chat');
  };

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* Header */}
      <header className='px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm'>
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to chat list"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className='text-lg font-semibold text-gray-800'>
            {currentPage === '' && 'Conversation'}
            {currentPage === 'job-detail' && 'Job Details'}
            {currentPage === 'offer' && (userRole === 'patient' ? 'Offers Received' : 'Send Offer')}
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex space-x-3'>
          {navItems.map(({ label, path, active, icon }) => (
            <Button
              key={label}
              onClick={() => chatId && router.push(path)}
              className={clsx(
                'px-4 py-2 rounded-md transition flex items-center gap-2',
                active
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden p-2 rounded-md border border-gray-200 bg-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      <div 
        className={clsx(
          'md:hidden bg-white border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden',
          mobileMenuOpen ? 'max-h-60' : 'max-h-0'
        )}
      >
        <nav className="px-4 py-2 space-y-2">
          {navItems.map(({ label, path, active, icon }) => (
            <button
              key={label}
              onClick={() => {
                chatId && router.push(path);
                setMobileMenuOpen(false);
              }}
              className={clsx(
                'w-full px-4 py-3 rounded-md transition flex items-center gap-2 text-left',
                active
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>
        {children}
      </main>
      
      {/* Bottom navigation for mobile */}
      <div className="md:hidden flex bg-white border-t border-gray-200 shadow-md">
        {navItems.map(({ label, path, active, icon }) => (
          <button
            key={label}
            onClick={() => chatId && router.push(path)}
            className={clsx(
              'flex-1 py-3 flex flex-col items-center justify-center transition-colors',
              active 
                ? 'text-blue-600 border-t-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-800'
            )}
          >
            {React.cloneElement(icon, { className: "w-5 h-5 mb-1" })}
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatLayout;
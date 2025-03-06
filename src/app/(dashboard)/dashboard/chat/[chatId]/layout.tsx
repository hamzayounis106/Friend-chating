'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';

interface LayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const userRole = useMemo(() => session?.data?.user?.role, [session]);

  // Extract chatId and current page from URL
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  const chatId = pathSegments[2] || '';
  const currentPage = pathSegments[3] || '';

  // Define navigation buttons
  const navItems = [
    {
      label: 'Chat',
      path: `/dashboard/chat/${chatId}`,
      active: currentPage === '',
    },
    {
      label: 'Job Details',
      path: `/dashboard/chat/${chatId}/job-detail`,
      active: currentPage === 'job-detail',
    },
    {
      label: userRole === 'patient' ? 'See Offers' : 'Send Offer',
      path: `/dashboard/chat/${chatId}/offer`,
      active: currentPage === 'offer',
    },
  ];

  return (
    <div className='flex flex-col h-screen'>
      {/* Header */}
      <header className='p-4 bg-gray-100 flex justify-between items-center shadow-sm'>
        <h1 className='text-lg font-semibold'>Chat</h1>
        <div className='flex space-x-4'>
          {navItems.map(({ label, path, active }) => (
            <Button
              key={label}
              onClick={() => chatId && router.push(path)}
              className={clsx(
                'px-4 py-2 rounded-md transition',
                active
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>{children}</main>
    </div>
  );
};

export default ChatLayout;

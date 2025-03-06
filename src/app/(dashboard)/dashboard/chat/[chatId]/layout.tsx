'use client';
import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

interface LayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const session = useSession();
  const userRole = session?.data?.user?.role;

  const pathSegments = pathname.split('/').filter(Boolean);
  const chatId = pathSegments.length > 2 ? pathSegments[2] : '';
  const currentPage = pathSegments.length > 3 ? pathSegments[3] : '';

  return (
    <div className='flex flex-col h-screen'>
      {/* Header with Navigation Buttons */}
      <div className='p-4 bg-gray-100 flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Chat</h1>
        <div className='flex space-x-4'>
          {/* Chat Button */}
          <Button
            onClick={() => router.push(`/dashboard/chat/${chatId}`)}
            className={
              currentPage === ''
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }
          >
            Chat
          </Button>

          {/* Job Details Button */}
          <Button
            onClick={() => router.push(`/dashboard/chat/${chatId}/job-detail`)}
            className={
              currentPage === 'job-detail'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }
          >
            Job Details
          </Button>

          {/* Send Offer Button (Only for Surgeons) */}
          {userRole === 'surgeon' && (
            <Button
              onClick={() => router.push(`/dashboard/chat/${chatId}/offer`)}
              className={
                currentPage === 'offer'
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
              }
            >
              Send Offer
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>{children}</div>
    </div>
  );
};

export default ChatLayout;

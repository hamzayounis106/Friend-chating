'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { Icons } from '@/components/Icons';
import SignOutButton from '@/components/SignOutButton';
import { SidebarOption } from '@/types/typings';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import JobNotificationsSidebar from '@/components/JobNotificationsSidebar';
import ActiveLink from '@/components/ActiveLink';
import Button, { buttonVariants } from './custom-ui/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import SidebarChatList from '@/components/SidebarChatList'; // Import SidebarChatList
import { JobData } from '@/components/jobs/job'; // Import JobData type
import NotificationBell from './NotificationBell';

interface MobileChatLayoutProps {
  session: Session;
  sidebarOptions: SidebarOption[];
  unseenRequestCount: number;
  jobs: JobData[]; // Add jobs prop
  doesPatientHaveCredits: number;
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
  session,
  sidebarOptions,
  unseenRequestCount,
  jobs, // Destructure jobs prop
  doesPatientHaveCredits,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const userRole = session.user.role;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className='fixed bg-white border-b border-gray-200 top-0 inset-x-0 py-2 px-4 z-50'>
      <div className='w-full flex justify-between items-center'>
        <Link
          href='/dashboard'
          className={buttonVariants({ variant: 'ghost' })}
        >
          {Icons.Logo ? (
            <Icons.Logo className='h-6 w-auto text-blue-600' />
          ) : (
            <span className='h-6 w-auto text-blue-600 font-bold'>SC</span>
          )}
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setOpen(true)} className='gap-4'>
              Menu <Menu className='h-6 w-6' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-full max-w-md flex flex-col'>
            <SheetHeader>
              <SheetTitle className='text-base font-semibold leading-6 text-gray-900'>
                <div className='flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-100'>
                  <Link href='/dashboard' className='flex items-center gap-2'>
                    {Icons.Logo ? (
                      <Icons.Logo className='h-8 w-auto text-blue-600' />
                    ) : (
                      <span className='h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-md font-bold text-lg'>
                        SC
                      </span>
                    )}
                  </Link>
                  <Link href={'/dashboard'}>
                    <span className='font-semibold text-lg text-gray-800'>
                      SecureCosmetic
                    </span>
                  </Link>
                  <NotificationBell />
                </div>
              </SheetTitle>
              <SheetDescription>
                <span></span>
              </SheetDescription>
            </SheetHeader>
            <div className='flex-1 overflow-y-auto px-4 sm:px-6'>
              <nav className='flex flex-col'>
                {/* Chats Section */}
                {jobs?.length > 0 && (
                  <div className='py-4 border-b border-gray-100'>
                    <div className='flex items-center justify-between mb-2'>
                      <h2 className='text-sm font-medium text-gray-900'>
                        Your chats
                      </h2>
                      {userRole === 'patient' && (
                        <button className='px-3 py-1 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition'>
                          {doesPatientHaveCredits ?? 0} Credits
                        </button>
                      )}
                    </div>
                    <div className='space-y-1'>
                      <SidebarChatList
                        sessionId={session.user.id.toString()}
                        sessionEmail={session.user.email as string}
                        jobs={jobs}
                        session={session}
                      />
                    </div>
                  </div>
                )}

                {/* Main Menu */}
                <ul role='list' className='flex flex-col gap-y-7'>
                  <li>
                    <div className='text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider px-2'>
                      Main Menu
                    </div>
                    <ul role='list' className='-mx-2 mt-2 space-y-1'>
                      {sidebarOptions.map((option) => (
                        <li key={option.id}>
                          <ActiveLink
                            href={option.href}
                            unseenJobCount={
                              option.href === '/dashboard/requests'
                                ? unseenRequestCount
                                : 0
                            }
                            icon={option.Icon}
                          >
                            {option.name}
                          </ActiveLink>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* Show JobNotificationsSidebar for surgeons */}
                  {userRole === 'surgeon' && (
                    <li>
                      <JobNotificationsSidebar
                        initialUnseenJobCount={unseenRequestCount}
                        sessionEmail={session.user.email as string}
                      />
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            {/* Profile & SignOut */}
            <div className='mt-auto px-4 sm:px-6  border-t border-gray-200'>
              <div className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm'>
                    <Image
                      referrerPolicy='no-referrer'
                      className='object-cover h-full w-full'
                      src={session.user.image || '/default.png'}
                      alt='Your profile picture'
                      width={24}
                      height={24}
                      sizes='(max-width: 768px) 100vw, 24px'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold text-gray-800 truncate'>
                      {session.user.name}
                    </span>
                    <span className='text-xs text-gray-500 truncate max-w-[150px]'>
                      {session.user.email}
                    </span>
                  </div>
                </div>
                <SignOutButton className='ml-2' />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileChatLayout;

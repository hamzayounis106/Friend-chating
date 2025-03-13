'use client';

import { Transition, Dialog } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, Fragment, useEffect, useState } from 'react';
import { Icons } from '@/components/Icons';
import SignOutButton from '@/components/SignOutButton';
import { SidebarOption } from '@/types/typings';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import JobNotificationsSidebar from '@/components/JobNotificationsSidebar';
import { cn } from '@/lib/utils';
import ActiveLink from '@/components/ActiveLink'; // Import ActiveLink
import Button, { buttonVariants } from './custom-ui/Button';

interface MobileChatLayoutProps {
  session: Session;
  sidebarOptions: SidebarOption[];
  unseenRequestCount: number;
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
  session,
  sidebarOptions,
  unseenRequestCount,
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
        <Button onClick={() => setOpen(true)} className='gap-4'>
          Menu <Menu className='h-6 w-6' />
        </Button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={setOpen}>
          <div className='fixed inset-0 bg-black/30 transition-opacity' />

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-auto bg-white py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-base font-semibold leading-6 text-gray-900'>
                            Dashboard
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                              onClick={() => setOpen(false)}
                            >
                              <X className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        <nav className='flex flex-1 flex-col'>
                          <ul
                            role='list'
                            className='flex flex-1 flex-col gap-y-7'
                          >
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

                            {/* General Section */}
                            {/* <li>
                              <div className='text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider px-2'>
                                General
                              </div>
                              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {[
                                  {
                                    id: 1,
                                    name: 'Dashboard',
                                    href: '/dashboard',
                                    Icon: 'Home',
                                  },
                                  {
                                    id: 2,
                                    name: 'My Surgeries',
                                    href: '/dashboard/surgeries',
                                    Icon: 'Calendar',
                                  },
                                  {
                                    id: 3,
                                    name: 'Settings',
                                    href: '/dashboard/settings',
                                    Icon: 'Settings',
                                  },
                                  {
                                    id: 4,
                                    name: 'Help & Support',
                                    href: '/dashboard/support',
                                    Icon: 'HelpCircle',
                                  },
                                ].map((option) => (
                                  <li key={option.id}>
                                    <ActiveLink
                                      href={option.href}
                                      icon={option.Icon}
                                    >
                                      {option.name}
                                    </ActiveLink>
                                  </li>
                                ))}
                              </ul>
                            </li> */}

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
                      <li className='-mx-6 mt-auto'>
                        <div className='flex items-center justify-between bg-gray-50 p-3 mx-6 rounded-lg'>
                          <div className='flex items-center gap-3'>
                            <div className='relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm'>
                              <Image
                                referrerPolicy='no-referrer'
                                className='object-cover'
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
                      </li>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;

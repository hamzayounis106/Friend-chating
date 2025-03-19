import { Icons } from '@/components/Icons';
import SignOutButton from '@/components/SignOutButton';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import JobNotificationsSidebar from '@/components/JobNotificationsSidebar';
import SidebarChatList from '@/components/SidebarChatList';
import MobileChatLayout from '@/components/MobileChatLayout';
import { SidebarOption } from '@/types/typings';
import NotificationBell from '@/components/NotificationBell';
import {
  getJobCountBySurgeon,
  getJobsForSurgeon,
} from '@/helpers/get-jobs-of-surgeon';
import { getJobsByUserId } from '@/helpers/get-jobs-by-user-id';
import {
  MessageSquare,
  PlusCircle,
  ClipboardList,
  Home,
  Calendar,
  Settings,
  HelpCircle,
  Inbox,
} from 'lucide-react';
import ActiveLink from '@/components/ActiveLink';
import { checkIfHaveCredits } from '@/helpers/check-if-have-credits';
import { JobData } from '@/components/jobs/job';

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'Secure Cosmetics | Dashboard',
  description: 'Your dashboard',
};

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  const doesPatientHaveCredits = await checkIfHaveCredits();

  if (!session) notFound();

  const userRole = session.user.role;
  let jobs: JobData[] = [];

  if (userRole === 'surgeon') {
    jobs = await getJobsForSurgeon(session.user.email as string);
  } else if (userRole === 'patient') {
    jobs = await getJobsByUserId(session.user.id as string);
  }

  // Define sidebar options with direct icon references for safety
  const bothUserOptions: SidebarOption[] = [
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
      id: 5,
      name: 'Update Profile',
      href: '/dashboard/update-profile',
      Icon: 'HelpCircle',
    },
  ];

  const patientOptions: SidebarOption[] = [
    {
      id: 5,
      name: 'Add Post',
      href: '/dashboard/add',
      Icon: 'PlusCircle',
    },
    {
      id: 6,
      name: 'My Posts',
      href: '/dashboard/myPosts',
      Icon: 'ClipboardList',
    },
    {
      id: 7,
      name: 'Buy Credits',
      href: '/dashboard/buyCredits',
      Icon: 'ClipboardList',
    },
  ];

  // Combine appropriate options based on user role
  const sidebarOptions: SidebarOption[] =
    userRole === 'patient' ? patientOptions : [];

  const unseenJobCount =
    userRole === 'surgeon'
      ? await getJobCountBySurgeon(session.user.email as string)
      : 0;

  // Helper function to get the appropriate icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className='h-4 w-4' />;
      case 'Calendar':
        return <Calendar className='h-4 w-4' />;
      case 'Settings':
        return <Settings className='h-4 w-4' />;
      case 'HelpCircle':
        return <HelpCircle className='h-4 w-4' />;
      case 'PlusCircle':
        return <PlusCircle className='h-4 w-4' />;
      case 'ClipboardList':
        return <ClipboardList className='h-4 w-4' />;
      case 'Inbox':
        return <Inbox className='h-4 w-4' />;
      default:
        return <MessageSquare className='h-4 w-4' />;
    }
  };

  return (
    <div className='w-full flex h-screen bg-gray-50'>
      {/* Mobile Sidebar */}
      <div className='md:hidden'>
        <MobileChatLayout
          session={session}
          sidebarOptions={[...sidebarOptions, ...bothUserOptions]}
          unseenRequestCount={unseenJobCount}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className='hidden md:flex h-full w-full max-w-72 flex-col bg-white border-r border-gray-200 shadow-sm'>
        {/* Header with logo */}

        <div className='flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-100'>
          <Link href='/dashboard' className='flex items-center gap-2'>
            {Icons.Logo ? (
              <Icons.Logo className='h-8 w-auto text-blue-600' />
            ) : (
              <span className='h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-md font-bold text-lg'>
                SC
              </span>
            )}
            <span className='font-semibold text-lg text-gray-800'>
              SecureCosmetic
            </span>
          </Link>
          <NotificationBell />
        </div>

        <div className='flex flex-col flex-1 overflow-y-auto'>
          {/* Chats section */}
          {jobs?.length > 0 && (
            <div className='px-4 py-4 border-b border-gray-100'>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='text-sm font-medium text-gray-900'>
                  Your chats
                </h2>
                {userRole === 'patient' && (
                  <button className='px-3 py-1 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition'>
                    {doesPatientHaveCredits.availableCredits ?? 0} Credits Left
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

          {/* Main navigation */}
          <nav className='flex-1 px-4 py-4'>
            <div className='space-y-4'>
              {/* Main Menu */}
              <div>
                <ul className='mt-2 space-y-1'>
                  {sidebarOptions.map((option) => (
                    <li key={option.id}>
                      <ActiveLink
                        href={option.href}
                        unseenJobCount={
                          option.href === '/dashboard/requests'
                            ? unseenJobCount
                            : 0
                        }
                        icon={option.Icon}
                      >
                        {option.name}
                      </ActiveLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* General */}
              <div>
                <h3 className='px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  General
                </h3>
                <ul className='mt-2 space-y-1'>
                  {bothUserOptions.map((option) => (
                    <li key={option.id}>
                      <ActiveLink
                        href={option.href}
                        unseenJobCount={
                          option.href === '/dashboard/requests'
                            ? unseenJobCount
                            : 0
                        }
                        icon={option.Icon}
                      >
                        {option.name}
                      </ActiveLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special components */}
              {userRole === 'surgeon' && (
                <div>
                  <h3 className='px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Notifications
                  </h3>
                  <div className='mt-2'>
                    <JobNotificationsSidebar
                      initialUnseenJobCount={unseenJobCount}
                      sessionEmail={session?.user?.email as string}
                    />
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Profile & SignOut */}
          <div className='mt-auto border-t border-gray-200 p-4'>
            <div className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center gap-3'>
                <div className='relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='object-cover'
                    src={session.user.image || '/default.png'}
                    alt='Your profile picture'
                    sizes='(max-width: 48px) 100vw'
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
        </div>
      </div>

      {/* Main content area */}
      <main className='flex-1 overflow-y-auto'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

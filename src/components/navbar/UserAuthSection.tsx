'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Home,
  Calendar,
  HelpCircle,
  PlusCircle,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export const UserDropdown = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  // Define sidebar options with Lucide icons
  const bothUserOptions: SidebarOption[] = [
    {
      id: 1,
      name: 'Dashboard',
      href: '/dashboard',
      Icon: Home,
    },
    {
      id: 2,
      name: 'My Surgeries',
      href: '/dashboard/surgeries',
      Icon: Calendar,
    },
    {
      id: 5,
      name: 'Update Profile',
      href: '/dashboard/update-profile',
      Icon: HelpCircle,
    },
  ];

  const patientOptions: SidebarOption[] = [
    {
      id: 20,
      name: 'Add Post',
      href: '/dashboard/add',
      Icon: PlusCircle,
    },
    {
      id: 6,
      name: 'My Posts',
      href: '/dashboard/myPosts',
      Icon: ClipboardList,
    },
    {
      id: 7,
      name: 'Buy Credits',
      href: '/dashboard/buyCredits',
      Icon: ClipboardList,
    },
  ];

  // Combine options based on role
  const options = [
    ...bothUserOptions,
    ...(session.user.role === 'patient' ? patientOptions : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center gap-2 focus:outline-none'>
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt='User avatar'
              width={36}
              height={36}
              className='rounded-full'
            />
          ) : (
            <div className='w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center'>
              {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-56 p-2 mt-2 shadow-lg rounded-md border border-gray-200 bg-white'
      >
        {/* User info */}
        <div className='px-2 py-1.5 text-sm font-medium'>
          <p className='truncate'>{session.user.name || session.user.email}</p>
          <p className='text-xs text-gray-500 truncate'>
            {session.user.role === 'patient' ? 'Patient' : 'Surgeon'}
          </p>
        </div>

        {/* Menu items */}
        {options.map((option) => (
          <Link href={option.href} key={option.id} legacyBehavior passHref>
            <DropdownMenuItem className='cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded-md'>
              <option.Icon className='mr-2 h-4 w-4' />
              <span>{option.name}</span>
            </DropdownMenuItem>
          </Link>
        ))}

        {/* Logout */}
        <DropdownMenuItem
          onClick={() => signOut()}
          className='cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded-md text-red-600'
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const AuthButtons = () => {
  return (
    <div className='flex gap-4'>
      <Link href='/login' passHref legacyBehavior>
        <Button
          variant='outline'
          className='w-full rounded-full px-12 border border-black'
        >
          Login
        </Button>
      </Link>
      <Link href='/signup' passHref legacyBehavior>
        <Button className='w-full bg-black hover:bg-black/80 rounded-full px-12'>
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

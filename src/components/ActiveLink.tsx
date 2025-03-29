'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Settings,
  HelpCircle,
  PlusCircle,
  ClipboardList,
  Inbox,
  Briefcase,
  PhoneOutgoing,
  LayoutDashboard,
  UserCog,
} from 'lucide-react';

interface ActiveLinkProps {
  href: string;
  unseenJobCount?: number;
  icon: string; // Change this to string
  children: React.ReactNode;
}

// Map string names to actual icons
const iconMap: Record<string, React.ElementType> = {
  Home,
  Calendar,
  Settings,
  HelpCircle,
  PlusCircle,
  ClipboardList,
  Inbox,
  Briefcase,
  PhoneOutgoing,
  LayoutDashboard,
  UserCog,
};

const ActiveLink = ({
  href,
  unseenJobCount = 0,
  icon,
  children,
}: ActiveLinkProps) => {
  const currentPath = usePathname();
  const isActive = currentPath === href;

  // Get the correct icon component from the map
  const IconComponent = iconMap[icon] || Home; // Default to Home if not found

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
      )}
    >
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-gray-500 border border-gray-200 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors',
          href === '/dashboard/requests' &&
            unseenJobCount > 0 &&
            'bg-blue-50 text-blue-600 border-blue-200'
        )}
      >
        <IconComponent className='h-5 w-5' />
      </span>

      <span className='truncate'>{children}</span>

      {href === '/dashboard/requests' && unseenJobCount > 0 && (
        <span className='inline-block ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
          {unseenJobCount}
        </span>
      )}
    </Link>
  );
};

export default ActiveLink;

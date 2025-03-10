import { Icon } from '@/components/Icons';

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon:
    | 'Logo'
    | 'UserPlus'
    | 'Home'
    | 'Calendar'
    | 'Settings'
    | 'HelpCircle'
    | 'PlusCircle'
    | 'ClipboardList'
    | 'Inbox';
}

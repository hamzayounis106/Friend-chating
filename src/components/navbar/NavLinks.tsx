'use client';

import Link from 'next/link';
import { SearchCombobox } from './SearchCombobox';

interface NavLink {
  id: number;
  title: string;
  hasCombobox?: boolean;
  type?: 'locations' | 'articles' | 'procedures';
  link?: string;
}

interface NavLinksProps {
  onLinkClick?: () => void;
}

export const NavLinks = ({ onLinkClick }: NavLinksProps) => {
  const baseLinks: NavLink[] = [
    { id: 41, title: 'How it works', link: '/#how-it-works' },
    {
      id: 60,
      title: 'Locations',
      hasCombobox: true,
      type: 'locations',
    },
    {
      id: 646,
      title: 'Articles',
      hasCombobox: true,
      type: 'articles',
    },
    {
      id: 21,
      title: 'Procedures',
      hasCombobox: true,
      type: 'procedures',
    },
    { id: 23, title: 'Contact Us', link: '/contact' },
  ];

  return (
    <>
      {baseLinks.map((item) => (
        <div key={item.id} className='relative group'>
          {item.hasCombobox ? (
            <div className='flex flex-col'>
              <div className='font-medium hover:text-primary transition-colors mb-1'>
                <SearchCombobox
                  type={item.type!}
                  onSelect={() => onLinkClick?.()}
                />
              </div>
            </div>
          ) : (
            <Link
              onClick={onLinkClick}
              href={item.link!}
              className='font-medium hover:text-primary transition-colors block'
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </>
  );
};

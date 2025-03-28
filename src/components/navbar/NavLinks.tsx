'use client';

import Link from 'next/link';

interface NavLink {
  id: number;
  link: string;
  title: string;
}

export const NavLinks = () => {
  const baseLinks: NavLink[] = [
    { id: 41, link: '/', title: 'Home' },
    { id: 60, link: '/locations', title: 'Locations' },
    { id: 646, link: '/articles', title: 'Articles' },
    { id: 21, link: '/procedures', title: 'Procedures' },
    { id: 23, link: '/contact', title: 'Contact Us' },
  ];

  return (
    <>
      {baseLinks.map((item) => (
        <Link
          href={item.link}
          key={item.id}
          className='font-medium hover:text-primary transition-colors'
        >
          {item.title}
        </Link>
      ))}
    </>
  );
};

// 'use client';

// import { Menu } from 'lucide-react';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import Link from 'next/link';
// import { NavLinks } from './NavLinks';
// import Button from '@/components/ui/button';

// interface MobileMenuProps {
//   isAuthenticated: boolean;
// }

// export const MobileMenu = ({ isAuthenticated }: MobileMenuProps) => {
//   return (
//     <Sheet>
//       <SheetTrigger className='lg:hidden'>
//         <Menu className='text-2xl' />
//       </SheetTrigger>
//       <SheetContent className='p-4'>
//         <SheetHeader>
//           <SheetTitle>
//             <Link href='/' className='font-extrabold hover:text-primary'>
//               Logo
//             </Link>
//           </SheetTitle>
//           <SheetDescription>
//             <span></span>
//           </SheetDescription>
//         </SheetHeader>

//         <div className='flex flex-col mt-10 font-bold space-y-4'>
//           <NavLinks />

//           {/* Auth Buttons for Mobile */}
//           {!isAuthenticated && (
//             <div className='flex flex-col gap-3 mt-6'>
//               <Link href='/login' passHref legacyBehavior>
//                 <Button
//                   variant='outline'
//                   className='w-full rounded-full px-12 border border-black'
//                 >
//                   Login
//                 </Button>
//               </Link>
//               <Link href='/signup' passHref legacyBehavior>
//                 <Button className='w-full bg-black hover:bg-black/80 rounded-full px-12'>
//                   Sign Up
//                 </Button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };
'use client';

import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { NavLinks } from './NavLinks';
import Button from '@/components/ui/button';
import { useState } from 'react';

interface MobileMenuProps {
  isAuthenticated: boolean;
}

export const MobileMenu = ({ isAuthenticated }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className='lg:hidden'>
        <Menu className='text-2xl' />
      </SheetTrigger>
      <SheetContent className='p-4'>
        <SheetHeader>
          <SheetTitle>
            <SheetClose asChild>
              <Link href='/' className='font-extrabold hover:text-primary'>
                Logo
              </Link>
            </SheetClose>
          </SheetTitle>
          <SheetDescription>
            <span></span>
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col mt-10 font-bold space-y-4'>
          {/* Remove SheetClose wrapper from NavLinks */}
          <NavLinks onLinkClick={() => setOpen(false)} />

          {/* Auth Buttons for Mobile */}
          {!isAuthenticated && (
            <div className='flex flex-col gap-3 mt-6'>
              <SheetClose asChild>
                <Link href='/login' passHref legacyBehavior>
                  <Button
                    variant='outline'
                    className='w-full rounded-full px-12 border border-black'
                  >
                    Login
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href='/signup' passHref legacyBehavior>
                  <Button className='w-full bg-black hover:bg-black/80 rounded-full px-12'>
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
    role?: 'patient' | 'surgeon' | 'pending';
    isVerified?: boolean;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId;
      role?: 'patient' | 'surgeon' | 'pending';
      isVerified?: boolean;
      phone?: string;
      city?: string;
      country?: string;
      description?: string;
      address?: string;
    };
  }
}

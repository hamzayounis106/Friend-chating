import {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
} from 'next-auth/adapters';
import mongoose, { ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/app/models/User';

type UserRole = 'patient' | 'surgeon' | 'pending';

export interface CustomAdapterUser extends AdapterUser {
  role?: UserRole;
  verificationToken?: string;
  isVerified?: boolean;
}

const transformUser = (user: IUser): CustomAdapterUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  emailVerified: null,
  image: user.image,
  role: user.role,
  verificationToken: user.verificationToken,
  isVerified: user.isVerified,
});

export function MongoDBAdapter(): Adapter {
  return {
    async createUser(
      user: Omit<AdapterUser, 'id'> & {
        password?: string;
        role?: string;
        friends?: ObjectId[];
      }
    ): Promise<CustomAdapterUser> {
      const hashedPassword = user.password
        ? await bcrypt.hash(user.password, 12)
        : null;

      const newUser = new User({
        ...user,
        password: hashedPassword,
        role: user.role || 'pending',
        friends: user.friends || [],
        isVerified: false,
      });

      await newUser.save();
      return transformUser(newUser);
    },

    async getUser(id: string): Promise<CustomAdapterUser | null> {
      const user = await User.findById(id);
      return user ? transformUser(user) : null;
    },

    async getUserByEmail(email: string): Promise<CustomAdapterUser | null> {
      const user = await User.findOne({ email });
      return user ? transformUser(user) : null;
    },

    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<CustomAdapterUser | null> {
      const account = await mongoose
        .model('Account')
        .findOne({ providerAccountId, provider });

      if (!account) return null;
      const user = await User.findById(account.userId);
      return user ? transformUser(user) : null;
    },
    async updateUser(
      user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>
    ): Promise<AdapterUser> {
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { $set: user },
        { new: true }
      ).lean<IUser>(); // Explicitly type `lean<IUser>()`

      if (!updatedUser) throw new Error('User not found');

      return transformUser(updatedUser); // Now correctly typed as `IUser`
    },
    async deleteUser(id: string): Promise<void> {
      await User.findByIdAndDelete(id);
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      await mongoose.model('Account').create(account);
    },

    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<void> {
      await mongoose
        .model('Account')
        .deleteOne({ providerAccountId, provider });
    },

    async createSession(
      session: AdapterSession
    ): Promise<AdapterSession & { id: string }> {
      const newSession = await mongoose.model('Session').create(session);
      return { ...session, id: newSession._id.toString() };
    },

    async getSessionAndUser(sessionToken: string): Promise<{
      session: AdapterSession & { id: string };
      user: CustomAdapterUser;
    } | null> {
      const session = await mongoose.model('Session').findOne({ sessionToken });

      if (!session) return null;
      const user = await User.findById(session.userId);
      return user
        ? {
            session: { ...session.toObject(), id: session._id.toString() },
            user: transformUser(user),
          }
        : null;
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ): Promise<AdapterSession> {
      const updatedSession = await mongoose
        .model('Session')
        .findOneAndUpdate(
          { sessionToken: session.sessionToken },
          { $set: session },
          { new: true }
        );

      if (!updatedSession) throw new Error('Session not found after update');
      return {
        ...updatedSession.toObject(),
        id: updatedSession._id.toString(),
      };
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await mongoose.model('Session').deleteOne({ sessionToken });
    },
  };
}

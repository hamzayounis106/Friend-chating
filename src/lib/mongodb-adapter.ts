import {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
} from 'next-auth/adapters';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

type UserRole = 'patient' | 'surgeon' | 'pending';

// Extend AdapterUser to include the role field
export interface CustomAdapterUser extends AdapterUser {
  role?: UserRole;
  isVerified?: boolean;
  creditIds?: ObjectId[];
}
// Utility function to transform a MongoDB user document into an AdapterUser
const transformUser = (user: any): CustomAdapterUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
  image: user.image,
  role: user.role, // Include the role field
  creditIds: user.creditIds || [], // ✅ Ensure it exists
});

const transformSession = (session: any): AdapterSession & { id: string } => ({
  id: session._id.toString(),
  sessionToken: session.sessionToken,
  userId: session.userId,
  expires: session.expires,
});

export function MongoDBAdapter(clientPromise: Promise<MongoClient>): Adapter {
  return {
    async createUser(
      user: Omit<AdapterUser, 'id'> & {
        password?: string;
        role?: string;
        friends?: any[];
        creditIds?: ObjectId[]; // ✅ Add this line to the type
      }
    ): Promise<CustomAdapterUser> {
      const client = await clientPromise;
      const db = client.db();

      // Hash the password before saving
      const hashedPassword = user.password
        ? await bcrypt.hash(user.password, 12)
        : null;

      const newUser = {
        ...user,
        password: hashedPassword, // Use the hashed password
        role: user.role || 'pending', // Default role if not provided
        friends: user.friends || [],
        creditIds: user.creditIds || [], //from here or
      };

      const result = await db.collection('users').insertOne(newUser);
      return {
        ...newUser,
        id: result.insertedId.toString(),
      } as CustomAdapterUser;
    },
    async getUser(id: string): Promise<CustomAdapterUser | null> {
      const client = await clientPromise;
      const db = client.db();
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(id) });
      return user ? transformUser(user) : null;
    },
    async getUserByEmail(email: string): Promise<CustomAdapterUser | null> {
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection('users').findOne({ email });
      return user ? transformUser(user) : null;
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<CustomAdapterUser | null> {
      const client = await clientPromise;
      const db = client.db();
      const account = await db
        .collection('accounts')
        .findOne({ providerAccountId, provider });
      if (!account) return null;
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(account.userId) });
      return user ? transformUser(user) : null;
    },

    // Accept a partial update object along with the required id.
    async updateUser(
      user: Partial<AdapterUser> &
        Pick<AdapterUser, 'id'> & { creditIds?: ObjectId[] } // ✅ Add creditIds here
    ): Promise<AdapterUser> {
      const client = await clientPromise;
      const db = client.db();
      // Use $set to update only the provided fields.
      await db
        .collection('users')
        .updateOne({ _id: new ObjectId(user.id) }, { $set: user });
      // Optionally, return the merged user object.
      return { ...user, creditIds: user.creditIds || [] } as AdapterUser; //here also
    },

    async deleteUser(id: string): Promise<void> {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('accounts').insertOne(account);
    },

    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<void> {
      const client = await clientPromise;
      const db = client.db();
      await db
        .collection('accounts')
        .deleteOne({ providerAccountId, provider });
    },

    async createSession(
      session: AdapterSession
    ): Promise<AdapterSession & { id: string }> {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('sessions').insertOne(session);
      // Merge the generated id into the session object.
      return { ...session, id: result.insertedId.toString() };
    },

    async getSessionAndUser(sessionToken: string): Promise<{
      session: AdapterSession & { id: string };
      user: CustomAdapterUser;
    } | null> {
      const client = await clientPromise;
      const db = client.db();
      const session = await db.collection('sessions').findOne({ sessionToken });
      if (!session) return null;
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(session.userId) });
      return user
        ? { session: transformSession(session), user: transformUser(user) }
        : null;
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ): Promise<AdapterSession> {
      const client = await clientPromise;
      const db = client.db();
      await db
        .collection('sessions')
        .updateOne({ sessionToken: session.sessionToken }, { $set: session });
      // Re-fetch the session after updating
      const updated = await db
        .collection('sessions')
        .findOne({ sessionToken: session.sessionToken });
      if (!updated) throw new Error('Session not found after update'); // or return null based on your needs
      return transformSession(updated);
    },

    async deleteSession(sessionToken: string): Promise<void> {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('sessions').deleteOne({ sessionToken });
    },
  };
}

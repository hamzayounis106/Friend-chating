import {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
} from 'next-auth/adapters';
import { MongoClient, ObjectId } from 'mongodb';

// Utility function to transform a MongoDB user document into an AdapterUser
const transformUser = (user: any): AdapterUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
  image: user.image,
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
      }
    ): Promise<AdapterUser> {
      const client = await clientPromise;
      const db = client.db();
      const newUser = {
        ...user,
        // Provide default values if missing:
        password: user.password || null,
        role: user.role || 'pending',
        friends: user.friends || [],
      };
      const result = await db.collection('users').insertOne(newUser);
      return { ...newUser, id: result.insertedId.toString() } as AdapterUser;
    },
    async getUser(id: string): Promise<AdapterUser | null> {
      const client = await clientPromise;
      const db = client.db();
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(id) });
      return user ? transformUser(user) : null;
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
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
    }): Promise<AdapterUser | null> {
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
      user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>
    ): Promise<AdapterUser> {
      const client = await clientPromise;
      const db = client.db();
      // Use $set to update only the provided fields.
      await db
        .collection('users')
        .updateOne({ _id: new ObjectId(user.id) }, { $set: user });
      // Optionally, return the merged user object.
      return { ...user } as AdapterUser;
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
      user: AdapterUser;
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

import { NextAuthOptions } from 'next-auth';
import dbConnect from '@/lib/db'; // This should be a function that awaits mongoose.connect()
import GoogleProvider from 'next-auth/providers/google';
import User from '@/app/models/User';
import { MongoDBAdapter } from './mongodb-adapter';

async function ensureDB() {
  // Await the connection; you can also check connection status if needed.
  return await dbConnect();
}

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID');
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET');
  }

  return { clientId, clientSecret };
}

const clientPromise = (async () => {
  const connection = await ensureDB();
  return connection.connection.getClient();
})();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ensure the DB connection is established before any query
      await ensureDB();

      const dbUser = await User.findById(token.id);
      if (!dbUser) {
        if (user) {
          token.id = user.id.toString();
        }
        return token;
      }
      return {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      // Make sure DB is connected if needed here
      await ensureDB();

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return '/dashboard';
    },
  },
  events: {
    async createUser(message) {
      // Ensure DB is connected before performing any operations
      await ensureDB();

      // Ensure the friends field is initialized
      const user = await User.findById(message.user.id);
      if (user) {
        user.friends = user.friends || [];
        await user.save();
      }
    },
  },
};

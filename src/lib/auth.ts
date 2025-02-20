import { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import dbConnect from '@/lib/db'; // Import your MongoDB connection
import GoogleProvider from 'next-auth/providers/google';
import User from '@/app/models/User';

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

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(
    dbConnect().then((client) => client.connection.getClient())
  ),
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
      // Perform additional actions when a user is created
      console.log('User created:', message.user);

      // Ensure the friends field is initialized
      const user = await User.findById(message.user.id);
      if (user) {
        user.friends = user.friends || [];
        await user.save();
        console.log('User friends initialized:', user.friends);
      }
    },
  },
};

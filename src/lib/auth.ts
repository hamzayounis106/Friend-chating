import { NextAuthOptions } from 'next-auth';
import dbConnect from '@/lib/db'; // A function that awaits mongoose.connect()
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/app/models/User';
import { MongoDBAdapter } from './mongodb-adapter';
import { verifyPassword } from '@/lib/verifyPassword'; // Implement your password compare logic

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
    // Credentials provider for form-based login.
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await ensureDB();

        // Find the user by email
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify the password (assumes user.password exists and is hashed)
        const isValid = await verifyPassword(
          credentials!.password,
          user.password
        );
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // If the user is found and the password is correct, return the user object.
        return user;
      },
    }),
    // Google provider for OAuth login.
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      await ensureDB();
      if (user) {
        token.id = user.id.toString();
      }

      const dbUser = await User.findById(token.id);
      if (!dbUser) {
        return token;
      }
      return {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role, // include the role field
      };
    },
    async session({ session, token }) {
      await ensureDB();

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role; // pass role to session
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

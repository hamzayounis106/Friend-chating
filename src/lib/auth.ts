import { NextAuthOptions } from 'next-auth';
import dbConnect from '@/lib/db'; // A function that awaits mongoose.connect()
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/app/models/User';
import { CustomAdapterUser, MongoDBAdapter } from './mongodb-adapter';
import { verifyPassword } from '@/lib/verifyPassword'; // Implement your password compare logic
import { JWT } from 'next-auth/jwt';

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
    error: '/login', // Add error page from Bolt.new
  },
  providers: [
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        try {
          await ensureDB();

          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          });
          if (!user) {
            throw new Error('User Not Found');
          }
          if (!user.password) {
            console.log('User found but associated with google:', user);
            throw new Error(
              'Your account is associated with Google. Please log in with Google'
            );
          }
          if (!user.isVerified) {
            throw new Error('Email not verified');
          }
          console.log('User found:', user);

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error('Invalid email or password');
          }
          console.log('Email verified user from the authozide', user);

          // Return a simplified user object
          return {
            id: user._id.toString(), // Convert ObjectId to string
            role: user.role, // Include any additional fields you need
            isVerified: user.isVerified,
          } as CustomAdapterUser; // Cast to CustomAdapterUser
        } catch (error) {
          console.error('Authorize error:', error);
          throw error; // Propagate the error
        }
      },
    }),
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      await ensureDB();
      if (user) {
        token.id = user.id.toString();
        token.role = (user as CustomAdapterUser).role;
        token.isVerified = (user as CustomAdapterUser).isVerified; // Set isVerified from user object
      }

      const dbUser = await User.findById(token.id);
      if (dbUser && token.role !== dbUser.role) {
        token.role = dbUser.role;
        token.isVerified = dbUser.isVerified;
      }

      if (trigger === 'signIn') {
        const freshUser = await User.findById(token.id);
        if (freshUser) {
          token.role = freshUser.role;
          token.isVerified = freshUser.isVerified;
        }
      }
      return {
        id: token.id,
        role: token.role,
        isVerified: token.isVerified,
      };
    },

    async session({ session, token }) {
      await ensureDB();
      const dbUser = await User.findById(token.id).select('-password'); // Exclude password

      if (dbUser) {
        session.user = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image,
          role: dbUser.role,
          isVerified: dbUser.isVerified, // Include isVerified
          phone: dbUser.phone,
          city: dbUser.city,
          country: dbUser.country,
          description: dbUser.description,
          address: dbUser.address,
        };
      }
      return session;
    },
    async redirect({
      url,
      baseUrl,
      token,
    }: {
      url: string;
      baseUrl: string;
      token?: JWT;
    }) {
      const role = (token as JWT)?.role;
      // console.log('token: is comming inside the redirects', token);
      if (url.includes('/login') || url.includes('/api/auth')) {
        if (role === 'pending') {
          return `${baseUrl}/update-role`;
        } else if (role === 'surgeon') {
          return `${baseUrl}/dashboard`;
        } else if (role === 'patient') {
          return `${baseUrl}/dashboard/add`;
        }
        return `${baseUrl}/dashboard`; // Default redirect
      }
      // If not a login-related URL, respect the original URL or fallback to baseUrl
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  events: {
    async createUser(message) {
      // Ensure DB is connected before performing any operations
      await ensureDB();

      // Ensure the friends field is initialized
      const user = await User.findById(message.user.id);
      if (user) {
        user.isVerified = true;
        user.friends = user.friends || [];
        await user.save();
      }
    },
  },
};

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
              'Your account is associated with Google. Please log in with Google auth'
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

          // Return a simplified user object
          return {
            id: user._id.toString(), // Convert ObjectId to string
            name: user.name,
            email: user.email,
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
    async jwt({ token, user }) {
      await ensureDB();
      if (user) {
        token.id = user.id.toString();
        token.role = (user as CustomAdapterUser).role;
        token.isVerified = (user as CustomAdapterUser).isVerified; // Set isVerified from user object
      }

      // Fetch additional user data from the database
      const dbUser = await User.findById(token.id);
      if (!dbUser) {
        return token;
      }
      return {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image, // Keep your existing field
        role: dbUser.role, // include the role field
        isVerified: true, // include the isVerified field
      };
    },
    async session({ session, token }) {
      await ensureDB();

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture; // Keep your existing field
        session.user.role = token.role; // pass role to session
        session.user.isVerified = token.isVerified; // include the isVerified field
      }
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Custom redirect logic from Bolt.new
    //   if (url.startsWith('/')) {
    //     return `${baseUrl}${url}`;
    //   } else if (new URL(url).origin === baseUrl) {
    //     return url;
    //   }
    //   return baseUrl + '/dashboard';
    // },
    // async redirect({ url, baseUrl }) {
    //   // Redirect to /dashboard after successful login
    //   if (url.startsWith('/login')) {
    //     return `${baseUrl}/dashboard/add`;
    //   }
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
    // async redirect({ url, baseUrl }) {
    //   // Redirect to /update-role if the role is pending
    //   if (url.startsWith('/login')) {
    //     return `${baseUrl}/update-role`;
    //   }
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },

    async redirect({
      url,
      baseUrl,
      token,
    }: {
      url: string;
      baseUrl: string;
      token?: JWT;
    }) {
      const role = (token as JWT)?.role || 'pending';

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

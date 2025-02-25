import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/db"; // A function that awaits mongoose.connect()
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import { CustomAdapterUser, MongoDBAdapter } from "./mongodb-adapter";
import { verifyPassword } from "@/lib/verifyPassword"; // Implement your password compare logic

async function ensureDB() {
  // Await the connection; you can also check connection status if needed.
  return await dbConnect();
}

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
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
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login", // Add error page from Bolt.new
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        try {
          console.log("Credentials:", credentials);
          await ensureDB();

          const isUserExist = await User.findOne({
            email: credentials.email,
            password: null,
          });
          if (isUserExist) {
            throw new Error(
              "Your account is assosiated with google account, please login with google"
            );
          }

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Invalid email or password");
          }

          console.log("User found:", user);

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid email or password");
          }
          // Check if the email is verified
          if (!user.isVerified) {
            throw new Error(
              "Email not verified. A verification email has been sent."
            );
          }
          console.log("is valid ", isValid);
          console.log("User authenticated:", user);

          // Return a simplified user object
          return {
            id: user._id.toString(), // Convert ObjectId to string
            name: user.name,
            email: user.email,
            role: user.role, // Include any additional fields you need
            isVerified: user.isVerified, // Include the isVerified
          } as CustomAdapterUser; // Cast to CustomAdapterUser
        } catch (error) {
          console.error("Authorize error:", error);
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
        token.role = (user as CustomAdapterUser).role; // here is the
        token.isVerified = true; // new code
      }

      // Fetch additional user credentials from the credentialsbase
      const dbUser = await User.findById(token.id);
      console.log("DB User:", dbUser);
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
        session.user.isVerified = true; // include the isVerified field
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Custom redirect logic from Bolt.new
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl + "/dashboard";
    },
  },
  events: {
    async createUser(message) {
      // Ensure DB is connected before performing any operations
      await ensureDB();

      // Ensure the friends field is initialized
      const user = await User.findById(message.user.id);

      if (user) {
        console.log("Creating user:", user);
        user.isVerified = true;
        user.friends = user.friends || [];
        await user.save();
      }
    },
  },
};

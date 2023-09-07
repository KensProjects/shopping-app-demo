import NextAuth from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "Name",
          type: "text",
          placeholder: "Enter username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "*********",
        },
      },
      async authorize(credentials) {

        if (!credentials) {
          throw new Error("Missing credentials!")
        }
        const { username, password } = credentials as any;
        

        // check to see if email and password is there
        if (!credentials.username) {
          throw new Error("Please enter a username");
        }

        // check to see if user exists
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        // if no user was found
        if (!user) {
          throw new Error("Signin error!");
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          throw new Error("Signin error!");
        }

        await prisma.$disconnect();
        
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      session.user.id = token.uid;

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;

        token.uid = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "@/lib/zod"; // Validation schema for credentials
import { getUserFromDb } from "@/utils/db";
import { saltAndHashPassword, comparePasswords } from "@/utils/password";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate input
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Retrieve user from the database
          const user = await getUserFromDb(email);

          if (!user || !user.password) {
            throw new Error("Invalid credentials.");
          }

          // Compare provided password with stored password hash
          const isValid = comparePasswords(password, user.password);
          if (!isValid) {
            throw new Error("Invalid credentials.");
          }

          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation failed:", error.errors);
          }
          return null; // Return null for invalid credentials
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});

import { db } from "./prismaClient";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } =  NextAuth({
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/pages/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    const error = new Error()
                    error.status = 400;
                    error.message = "Invalid Credentials"
                    throw error;
                }

                const existingUser = await db.user.findUnique({ where: { email: credentials?.email } });
                if (existingUser?.status === 'blocked'){
                    const error = new Error()
                    error.status = 400;
                    error.message = "Account Blocked"
                    throw error;
                }
                if (!existingUser) return null;

                const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password);
                if (!passwordMatch) return null;

                const { password, _id, ...userWithoutPassword } = existingUser;
                return userWithoutPassword;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    user: JSON.parse(JSON.stringify(user)),
                };
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: token.user,
            };
        }
    }
});
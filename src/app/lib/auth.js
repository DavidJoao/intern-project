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
                try {
                    if (!credentials.email || !credentials.password) return null
    
                    const existingUser = await db.user.findUnique({ where: { email: credentials?.email } });
                    if (!existingUser) return null;
    
                    const passwordMatch = bcrypt.compare(credentials.password, existingUser.password);
                    if (!passwordMatch) return null;
    
                    const { password, _id, ...userWithoutPassword } = existingUser;
                    return userWithoutPassword;
                } catch (error) {
                    return error
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    }
});
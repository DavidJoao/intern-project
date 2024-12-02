"use server"
import { signIn, signOut, auth } from "../auth";
import { AuthError } from "next-auth";

export async function logSession() {
    try {
      const session = await auth();
      return session;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }

export async function logoutUser () {
    await signOut({ redirect: true, redirectTo: '/pages/login' });
    const session = await auth();
    return session
}

export async function authenticate ( formData ) {
    try {
        await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: true,
            redirectTo: '/'
          })
    } catch (error) {
        if (error) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return error;
                default:
                    return error
            }
        }
        throw error;
    }
}
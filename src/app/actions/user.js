import axios from 'axios'
import { signIn } from 'next-auth/react';

export const registerUser = async (form) => {
    try { 
        const response = await axios.post("/api/user/signup", form, { headers: { "Content-Type": "application/json" } })
        return response;
    } catch (error) {
        return error;
    }
}

export const signInUser = async (email, password) => {
    try {
        const response = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
        return response
    } catch (error) {
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}
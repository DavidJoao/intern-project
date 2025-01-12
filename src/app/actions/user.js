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

export const fetchAllUsers = async () => {
    try {
        const response = await axios.get("/api/user/all")
        return response;
    } catch (error) {
        return error;
    }
}

export const fetchUserStatusByEmail = async (email) => {
    try {
        const response = await axios.get(`/api/user/${email}`)
        return response;
    } catch (error) {
        return error
    }
}

export const switchRoles = async (userId) => {
    try {
        const response = await axios.patch(`/api/user/switchRole?userId=${userId}`)
        return response;
    } catch (error) {
        return error
    }
}

export const switchBlock = async (userId) => {
    try {
        const response = await axios.patch(`/api/user/switchBlock?userId=${userId}`)
        return response;
    } catch (error) {
        return error
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axios.post(`/api/user/delete?userId=${userId}`)
        return response;
    } catch (error) {
        return error;
    }
}

export const authenticateWithSalesforceAPI = async (data) => {
    try {
        const response = await axios.post(`/api/salesforce/create`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
        return response;
    } catch (error) {
        return error;
    }
}

export const checkForRegisteredUser = async (email) => {
    try {
        const response = await axios.post(`/api/salesforce/registeredContact?email=${email}`)
        return response
    } catch (error) {
        return error
    }
}
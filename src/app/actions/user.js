import axios from 'axios'

export const registerUser = async (form) => {
    try { 
        const response = await axios.post("/api/user/signup", form, { headers: { "Content-Type": "application/json" } })
        return response;
    } catch (error) {
        return error;
    }
}
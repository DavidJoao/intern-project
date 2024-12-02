import axios from 'axios'

export const registerUser = async (user) => {
    try { 
        const response = await axios.post("/api/user/register", user, { headers: { "Content-Type": "application/json" } })
        return response;
    } catch (error) {
        return { error: true, msg: error }
    }
}
import axios from "axios";

export const createForm = async (userId, templateId, answers) => {
    try {
        const response = await axios.post(`/api/forms/create?userId=${userId}&templateId=${templateId}`, answers, { headers: { 'Content-Type': 'application/json' } });
        return response;
    } catch (error) {
        console.log(error);
        return error
    }
}
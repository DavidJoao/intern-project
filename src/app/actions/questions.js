import axios from "axios";

export const createQuestion = async (data) => {
    try {
        const response = await axios.post("/api/questions/create", data, { headers: { "Content-Type":"application/json" } })
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const getQuestionsByTemplate = async (templateId) => {
    try {
        const response = await axios.get(`/api/questions/getByTemplate?templateId=${templateId}`)
        return response
    } catch (error) {
        console.log(error);
        return error;
    }
}
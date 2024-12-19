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

export const editQuestionById = async (questionId, data) => {
    try {
        const response = await axios.patch(`/api/questions/edit?questionId=${questionId}`, data, { headers: { 'Content-Type': 'application/json' } });
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const deleteQuestionById = async (questionId) => {
    try {
        const response = await axios.delete(`/api/questions/delete?questionId=${questionId}`);
        return response;
    } catch (error){
        console.log(error);
        return error;
    }
}

export const updateOrder = async (templateId, data) => {
    try {
        const response = await axios.post(`/api/questions/updateOrder?templateId=${templateId}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
        return response;
    } catch (error) {
        console.log(error);
        return error
    }
}
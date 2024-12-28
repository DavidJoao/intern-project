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

export const fetchFormsByTemplateId = async (templateId) => {
    try {
        const response = await axios.get(`/api/forms/getByTemplateId?templateId=${templateId}`)
        return response;
    } catch (error) {
        console.log(error);
        return error
    }
}

export const editAnswerById = async (answerId, data) => {
    try {
        const response = await axios.patch(`/api/forms/editAnswer?answerId=${answerId}`, { data }, { headers: { "Content-Type": 'application/json'} })
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteAnswerById = async (answerId) => {
    try {
        const response = await axios.delete(`/api/forms/deleteAnswer?answerId=${answerId}`);
        return response;
    } catch (error) {
        console.log(error);
        return error;  
    }
}

export const deleteFormById = async (formId) => {
    try {
        const response = await axios.delete(`/api/forms/delete?formId=${formId}`)
        return response
    } catch (error) {
        console.log(error);
        return error
    }
}

export const sendFormThroughEmail = async (emailData) => {
    try {
        const response = await axios.post(`/api/forms/email`, { emailData: emailData }, { headers: { "Content-Type":"application/json" } })
        return response
    } catch (error) {
        console.log(error);
        return error
    }
}
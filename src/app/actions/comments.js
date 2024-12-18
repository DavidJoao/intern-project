import axios from "axios";

export const createComment = async (data) => {
    try {
        const response = await axios.post("/api/comments/create", data, { headers: { 'Content-Type':'application/json' } })
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const getCommentsByTemplate = async (templateId) => {
    try {
        const response = await axios.get(`/api/comments/getById?templateId=${templateId}`)
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}

export const deleteCommentById = async (commentId) => {
    try {
        const response = await axios.delete(`/api/comments/delete?commentId=${commentId}`)
        return response
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const editCommentById = async (commentId, data) => {
    try {
        const response = await axios.patch(`/api/comments/edit?commentId=${commentId}`, data, { headers: { 'Content-Type':'application/json' } });
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}
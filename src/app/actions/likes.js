import axios from "axios";

export const likeTemplate = async (userId, templateId) => {
    try {
        const response = await axios.post(`/api/likes/likeTemplate?userId=${userId}&templateId=${templateId}`);
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const getLikeInfo = async (userId, templateId) => {
    try {
        const response = await axios.post(`/api/likes/likeData?userId=${userId}&templateId=${templateId}`);
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}
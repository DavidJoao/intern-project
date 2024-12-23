import axios from "axios";
import s3 from "../lib/s3Config";
import { v4 as uuidv4 } from 'uuid'

export async function fetchTopics () {
    try {
        const response = await axios.get("/api/templates/topics")
        return response
    } catch (error) {
        return error;
    }
} 

export async function createTemplate (data) {
    try {
        const response = await axios.post('/api/templates/create', data, { headers: { 'Content-Type':'application/json' } })
        return response
    } catch (error) {
        return error;
    }
}

export async function uploadImage (image) {
    return new Promise((resolve, reject) => {
        try {
            const byteString = atob(image.split(',')[1]);
            const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
            const arrayBuffer = new Uint8Array(byteString.length);
    
            for (let i = 0; i < byteString.length; i++) {
                arrayBuffer[i] = byteString.charCodeAt(i);
            }
    
            const blob = new Blob([arrayBuffer], { type: mimeString });
    
            const s3Params = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
                Key: `images/${uuidv4()}-${Date.now()}.jpg`,
                Body: blob,
                ContentType: mimeString,
            };
    
            s3.upload(s3Params, (error, data) => {
                if (error) {
                    console.error('S3 upload error:', error);
                    reject(error);
                } else {
                    console.log('S3 upload successful:', data.Location);
                    resolve(data.Location);
                }
            });
        } catch (error) {
            console.error('Error processing image:', error);
            reject(error);
        }
    })
}

export const getTemplateById = async (templateId) => {
    try {
        const response = await axios.get(`/api/templates/getById?templateId=${templateId}`);
        return response;
    } catch (error) {
        console.log(error)
        return error
    }
}

export const fetchTemplates = async () => {
    try {
        const response = await axios.get('/api/templates/all');
        return response;
    } catch (error) {
        console.log(error)
        return error
    }
}

export const updateTemplateById = async (templateId, data) => {
    try {
        const response = await axios.patch(`/api/templates/edit?templateId=${templateId}`, data, { headers: { 'Content-Type': 'application/json' } })
        return response;
    } catch (error) {
        console.log(error);
        return error
    }
}

export const getTemplatesByUserId = async (userId) => {
    try {
        const response = await axios.get(`/api/templates/getByUserId?userId=${userId}`)
        return response;
    } catch (error){
        console.log(error);
        return error;
    }
}

export const updateTemplatesOrderAPI = async (templates) => {
    try {
        const response = await axios.post(`/api/templates/updateOrder`, templates, { headers: { 'Content-Type':'application/json' } })
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const deleteTemplateById = async (templateId) => {
    try {
        const response = await axios.delete(`/api/templates/delete?templateId=${templateId}`)
        return response;
    } catch (error) {
        console.log(error)
        return error
    }
}

export const fetchTopTemplates = async () => {
    try {
        const response = await axios.get('/api/templates/topTemplates')
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}
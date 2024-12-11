import axios from "axios";

export async function fetchTopics () {
    try {
        const response = await axios.get("/api/templates/topics")
        return response
    } catch (error) {
        return error;
    }
} 
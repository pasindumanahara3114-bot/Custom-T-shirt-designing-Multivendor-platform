import axios from 'axios';

const API_URL = 'http://localhost:8080/api/designs';

export const designService = {
    saveDesign: async (userId, designData) => {
        const response = await axios.post(`${API_URL}/user/${userId}`, designData);
        return response.data;
    },

    getUserDesigns: async (userId) => {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    },

    getDesignById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    deleteDesign: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
    }
};

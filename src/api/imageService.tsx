// src/api/imageService.tsx
import apiClient from './client';

export const imageService = {
    getAll: async (page = 0, limit = 10) => {
        const response = await apiClient.get(`/images?page=${page}&limit=${limit}`);
        console.log("The response: "+response)
        return response.data; 
    },

    getSecureImageUrl: async (id: string): Promise<string> => {
        const response = await apiClient.get(`/images/${id}`, {
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    }
};
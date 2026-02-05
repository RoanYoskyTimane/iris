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
    },

    upload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file); 
        
        const response = await apiClient.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
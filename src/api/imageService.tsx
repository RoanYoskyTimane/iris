// src/api/imageService.tsx
import apiClient from './client';

export const imageService = {
    getAll: async (page = 0, limit = 10) => {
        const response = await apiClient.get(`/images?page=${page}&limit=${limit}`);
        
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
    },

    downloadImage: async (key: string) => {
        try {
            // 1. Makes request the data as a blob
            const response = await apiClient.get(`/images/${key}`, {
                responseType: 'blob', 
            });

            // 2. Creates a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // 3. Creates a temporary anchor element
            const link = document.createElement('a');
            link.href = url;
            
            // This forces the browser to download instead of navigate
            link.setAttribute('download', key); 
            
            // 4. Append to body, click, and cleanup
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            throw error;
        }
    },

    deleteImage: async (key: string) => {
        const response = await apiClient.delete(`/images/${key}`);
        return response;
    },

    transform: async (key: string, payload: any): Promise<string> => {
        const response = await apiClient.post(`/images/${key}/transform`, payload, {
            responseType: 'blob' // Essential for receiving the image data
        });
        
        // Convert the result into a URL the browser can display
        return URL.createObjectURL(response.data);
    }
};
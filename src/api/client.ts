import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    // List endpoints that MUST NOT have an Authorization header
    const authEndpoints = ['/auth/login', '/auth/register'];
    const isAuthRequest = authEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (token && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;
import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Verify this matches backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
    (config) => {
        // Check if we are in the browser
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors (e.g., token expired)
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Optional: Redirect to login page
                // window.location.href = '/auth'; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;

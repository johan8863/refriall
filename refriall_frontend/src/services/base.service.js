import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiBase = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiBase.interceptors.request.use(
    (config) => {
        const access = localStorage.getItem('refriall_auth_access_token')
        if (access) {
            config.headers.Authorization = `Bearer ${access}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

export default apiBase;
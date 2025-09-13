import axios from "axios";

const apiBase = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:8000'
});

export default apiBase;
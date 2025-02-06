import axios from "axios"

const api = axios.create({
    baseURL: 'https://desafio-fullstack-efraim.onrender.com',
    timeout: 20000,
    // baseURL: "http://127.0.0.1:8000",
    // timeout: 10 * 1000,
});

export default api
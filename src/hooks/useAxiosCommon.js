// src/hooks/useAxiosCommon.js
import axios from 'axios';

const axiosCommon = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const useAxiosCommon = () => {
    return axiosCommon;
};

export default useAxiosCommon;
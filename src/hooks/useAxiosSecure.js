// src/hooks/useAxiosSecure.jsx
import axios from 'axios';


const axiosSecure = axios.create({

    baseURL: 'http://localhost:3000', 
});


axiosSecure.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


axiosSecure.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const status = error.response?.status;
        const navigate = useNavgiate(); 
        if (status === 401 || status === 403) {
        
            localStorage.removeItem('access-token');
          
        return Promise.reject(error);
    }
);


const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;
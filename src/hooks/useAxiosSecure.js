// src/hooks/useAxiosSecure.jsx
import axios from 'axios';

// 1. Create the secure Axios instance
const axiosSecure = axios.create({
    // MUST BE THE BACKEND PORT (3000)
    baseURL: 'http://localhost:3000', 
});

// 2. Add Request Interceptor (to attach JWT from local storage)
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

// 3. Add Response Interceptor (to handle 401/403 errors)
axiosSecure.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const status = error.response?.status;
        const navigate = useNavgiate(); // Assuming you have imported and used this hook correctly in your full file
        
        // Handle 401 (Unauthorized) or 403 (Forbidden) for secure routes
        if (status === 401 || status === 403) {
            // Log out the user and clear token
            // NOTE: You would typically need access to the logOut function from AuthProvider here,
            // but for a simple fix, we'll just remove the token and redirect.
            localStorage.removeItem('access-token');
            // navigate('/login'); // Uncomment if you have navigation logic available here
        }
        return Promise.reject(error);
    }
);


const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;
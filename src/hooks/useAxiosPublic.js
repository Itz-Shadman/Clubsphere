// src/hooks/useAxiosPublic.jsx
import axios from "axios";

const axiosPublic = axios.create({
    // CRITICAL FIX: Ensure this is the backend port
    baseURL: "http://localhost:3000", 
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;

// NOTE: useAxiosSecure.jsx should also use baseURL: "http://localhost:3000"
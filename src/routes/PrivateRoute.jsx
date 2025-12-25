// src/routes/PrivateRoute.jsx
// CORRECTED IMPORT: useAuth is a default export from the hooks folder
import useAuth from '../hooks/useAuth'; 
// CORRECT: use 'react-router-dom'
import { Navigate, useLocation } from 'react-router'; 
import LoadingSpinner from '../components/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    // Correct usage: Call the hook directly
    const { user, loading } = useAuth();
    const location = useLocation();
    
    // Show Loading Spinner while auth state is resolving (Deployment Guideline)
    if (loading) {
        return <LoadingSpinner />;
    }
    
    // If user is logged in, show the requested page
    if (user) {
        return children;
    }
    
    // If user is not logged in, redirect to login, storing the current path
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
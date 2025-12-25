import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';


const useAuth = () => {
    const auth = useContext(AuthContext);

    if (!auth) {
        console.error("useAuth must be used within an AuthProvider");
    }

    return auth;
};

export default useAuth;
import { createContext, useContext, useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    updateProfile,
    signInWithPopup
} from 'firebase/auth';

import { auth, googleProvider } from '../firebase.config'; 
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { mockUsers } from '../data/mockUsers'; // Import your mock data

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // --- MODIFIED SIGN IN ---
    const signIn = async (email, password) => {
        setLoading(true);

        // 1. Check if the user exists in our local JSON (Development Bypass)
        const localUser = mockUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (localUser) {
            console.warn("Development Mode: Logged in via Mock Data");
            const mockSession = {
                email: localUser.email,
                displayName: localUser.name,
                photoURL: localUser.image,
                isMock: true // Helps us identify this session
            };
            setUser(mockSession);
            setDbUser(localUser); // Set the role (admin/manager) directly from JSON
            setLoading(false);
            return Promise.resolve({ user: mockSession });
        }

        // 2. If not found in JSON, proceed to real Firebase login
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logOut = () => {
        setLoading(true);
        localStorage.removeItem('access-token');
        if (user?.isMock) {
            setUser(null);
            setDbUser(null);
            setLoading(false);
            return Promise.resolve();
        }
        return signOut(auth);
    };
    
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, 
            photoURL: photo
        });
    };

    const fetchDbUser = async (email) => {
        try {
            const res = await axiosSecure.get(`/users/${email}`);
            setDbUser(res.data);
            return res.data;
        } catch (error) {
            console.error("Error fetching database user:", error);
            setDbUser(null);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async currentUser => {
            // If we are in a mock session, don't let Firebase overwrite it with 'null'
            if (user?.isMock) {
                setLoading(false);
                return;
            }

            setUser(currentUser);
            if (currentUser) {
                try {
                    const tokenRes = await axiosPublic.post('/jwt', { email: currentUser.email });
                    if (tokenRes.data.token) {
                        localStorage.setItem('access-token', tokenRes.data.token);
                        await fetchDbUser(currentUser.email); 
                    }
                } catch (error) {
                    console.error("JWT Error:", error);
                    localStorage.removeItem('access-token');
                }
            } else {
                localStorage.removeItem('access-token');
                setDbUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [axiosPublic, user?.isMock]); // Added user?.isMock to dependency array

    const authInfo = {
        user,
        dbUser,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile,
        fetchDbUser,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
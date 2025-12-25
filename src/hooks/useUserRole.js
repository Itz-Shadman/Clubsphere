// src/hooks/useUserRole.js
import useAuth from './useAuth'; // **CORRECT IMPORT:** Imports the hook from its file.
// NOTE: For a production app, this hook would typically use TanStack Query 
// to manage the dbUser state, but here we access it directly from AuthContext.

/**
 * Custom hook to easily retrieve the authenticated user's details and role.
 */
const useUserRole = () => {
    const { user, dbUser, loading } = useAuth();
    
    // Check if loading is true OR if the Firebase user exists but we haven't fetched the DB user yet.
    const isRoleLoading = loading || (user && !dbUser);

    return { 
        user, 
        dbUser, 
        isRoleLoading,
        // Helper booleans for easy checking
        isAdmin: dbUser?.role === 'admin',
        isManager: dbUser?.role === 'clubManager',
        isMember: dbUser?.role === 'member',
    };
};

export default useUserRole;
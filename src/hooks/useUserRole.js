// src/hooks/useUserRole.js
import useAuth from './useAuth';
const useUserRole = () => {
    const { user, dbUser, loading } = useAuth();
    
   
    const isRoleLoading = loading || (user && !dbUser);

    return { 
        user, 
        dbUser, 
        isRoleLoading,

        isAdmin: dbUser?.role === 'admin',
        isManager: dbUser?.role === 'clubManager',
        isMember: dbUser?.role === 'member',
    };
};

export default useUserRole;
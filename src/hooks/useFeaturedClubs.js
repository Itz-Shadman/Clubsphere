// src/hooks/useFeaturedClubs.js
import { useQuery } from '@tanstack/react-query';
import useAxiosCommon from './useAxiosCommon';

const useFeaturedClubs = () => {
    const axiosCommon = useAxiosCommon();
    
    // Fetch up to 6 approved clubs, sorted by createdAt (newest first)
    // NOTE: This assumes you will create an API route /clubs/featured 
    // that handles server-side filtering and limit.
    const { data: featuredClubs = [], isLoading: isFeaturedClubsLoading } = useQuery({
        queryKey: ['featuredClubs'],
        queryFn: async () => {
            // For now, let's hit the main clubs endpoint and filter/slice on client, 
            // but the final solution should be server-side filtering for performance.
            const res = await axiosCommon.get('/clubs'); 
            
            // Client-side filtering/slicing for dynamic section (TEMP)
            // Filter to approved clubs and limit to 6
            return res.data
                .filter(club => club.status === 'approved')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort newest first
                .slice(0, 6); 
        },
        staleTime: 1000 * 60, // Refetch every 1 minute
    });

    return { featuredClubs, isFeaturedClubsLoading };
};

export default useFeaturedClubs;
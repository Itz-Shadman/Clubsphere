// src/hooks/useFeaturedClubs.js
import { useQuery } from '@tanstack/react-query';
import useAxiosCommon from './useAxiosCommon';

const useFeaturedClubs = () => {
    const axiosCommon = useAxiosCommon();
    
    const { data: featuredClubs = [], isLoading: isFeaturedClubsLoading } = useQuery({
        queryKey: ['featuredClubs'],
        queryFn: async () => {

            const res = await axiosCommon.get('/clubs'); 

            return res.data
                .filter(club => club.status === 'approved')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                .slice(0, 6); 
        },
        staleTime: 1000 * 60, 
    });

    return { featuredClubs, isFeaturedClubsLoading };
};

export default useFeaturedClubs;
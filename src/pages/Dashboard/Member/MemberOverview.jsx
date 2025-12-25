import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaCalendarAlt, FaDollarSign, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MemberOverview = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth(); // Using Firebase user directly for the email

    const { data: summary = {}, isLoading } = useQuery({
        queryKey: ['memberSummary', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/member/summary/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return <LoadingSpinner />;

    const stats = [
        { title: 'Clubs Joined', value: summary.clubsJoined || 0, icon: FaUsers, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Events', value: summary.eventsRegistered || 0, icon: FaCalendarAlt, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Total Paid', value: `$${summary.totalPayments || 0}`, icon: FaDollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div className="p-6">
            <Helmet><title>Dashboard | ClubSphere</title></Helmet>
            
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                    <FaUserCircle className="text-blue-500" /> Welcome, {user?.displayName}!
                </h1>
                <p className="text-gray-500">Here is a summary of your club activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx} 
                        className={`p-6 rounded-2xl shadow-sm border border-gray-100 bg-white`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MemberOverview;
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useUserRole from '../../../hooks/useUserRole';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaClipboardList, FaCheckCircle, FaHourglassHalf, FaUserShield, FaDollarSign, FaCreditCard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { dbUser, isRoleLoading } = useUserRole();

    const { data: adminSummary = {}, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['adminSummary'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/summary');
            return res.data;
        },
        enabled: !!dbUser?.email && dbUser?.role === 'admin',
    });

    if (isRoleLoading || isSummaryLoading) return <LoadingSpinner />;
    
    const { totalUsers, pendingClubs, approvedClubs, totalRevenue } = adminSummary;

    const stats = [
        { title: 'Total Revenue', value: `$${totalRevenue}`, icon: FaDollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { title: 'Total Users', value: totalUsers, icon: FaUsers, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { title: 'Pending Clubs', value: pendingClubs, icon: FaHourglassHalf, color: 'text-amber-600', bgColor: 'bg-amber-50' },
        { title: 'Active Clubs', value: approvedClubs, icon: FaCheckCircle, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    ];

    return (
        <div className="p-4 md:p-8">
            <Helmet><title>Admin Dashboard | ClubSphere</title></Helmet>
            
            <header className="mb-10">
                <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
                    <FaUserShield className='text-blue-600' /> Admin Overview
                </h1>
                <p className='text-gray-500 mt-2 text-lg'>Welcome back, <span className="text-blue-600 font-bold">{dbUser?.name}</span></p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-3xl border border-gray-100 shadow-sm ${stat.bgColor}`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-400">{stat.title}</p>
                                <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                            </div>
                            <stat.icon className={`text-3xl ${stat.color} opacity-30`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className='mt-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>System Controls</h2>
                <div className='flex flex-wrap gap-4'>
                    <button onClick={() => navigate('/dashboard/manage-clubs')} className='btn btn-primary rounded-xl px-8'>Review Pending Clubs</button>
                    <button onClick={() => navigate('/dashboard/manage-users')} className='btn btn-outline rounded-xl px-8'>Manage Users</button>
                    <button onClick={() => navigate('/dashboard/manage-payments')} className='btn bg-emerald-600 text-white border-none rounded-xl px-8 hover:bg-emerald-700 flex items-center gap-2'>
                        <FaCreditCard /> View All Payments
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
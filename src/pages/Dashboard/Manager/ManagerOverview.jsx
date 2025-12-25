import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUserRole from "../../../hooks/useUserRole";
import { FaClipboardList, FaUsers, FaCalendarAlt, FaDollarSign, FaUserShield, FaPlus, FaPlusCircle } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";

const ManagerOverview = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { dbUser, isRoleLoading } = useUserRole();

    
    const { data: managerSummary, isLoading: isSummaryLoading, isFetching } = useQuery({

        queryKey: ['managerSummary', dbUser?.email], 
        queryFn: async () => {
            const res = await axiosSecure.get(`/manager/summary/${dbUser.email}`); 
            return res.data;
        },
   
        enabled: !!dbUser?.email && dbUser?.role === 'manager', 
    });


    if (isRoleLoading || isSummaryLoading) return <LoadingSpinner />;

    const { 
        clubsManaged = 0, 
        totalMembers = 0, 
        totalEvents = 0, 
        totalRevenue = 0 
    } = managerSummary || {};

    const stats = [
        { title: 'Clubs Managed', value: clubsManaged, icon: FaClipboardList, color: 'text-blue-600' },
        { title: 'Total Members', value: totalMembers, icon: FaUsers, color: 'text-cyan-500' },
        { title: 'Total Events', value: totalEvents, icon: FaCalendarAlt, color: 'text-green-500' },
        { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: FaDollarSign, color: 'text-orange-500' },
    ];

    return (
        <div className="p-4 md:p-8">
            <Helmet><title>Manager Dashboard | ClubSphere</title></Helmet>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                    <FaUserShield className="text-blue-600" /> Manager Dashboard
                </h1>
                {isFetching && <span className="loading loading-dots loading-sm text-blue-600"></span>}
            </div>
            
         
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                        </div>
                        <stat.icon className={`w-10 h-10 opacity-20 ${stat.color}`} />
                    </div>
                ))}
            </div>

           
            <div className="mt-12 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Management Controls</h3>
                <p className="text-gray-500 mb-8">Direct access to your club operations and event planning.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/dashboard/add-event')} className="btn btn-primary rounded-xl gap-2 h-16">
                        <FaPlus /> Create New Event
                    </button>
                    <button onClick={() => navigate('/dashboard/add-club')} className="btn btn-secondary rounded-xl gap-2 h-16">
                        <FaPlusCircle /> Register New Club
                    </button>
                    <button onClick={() => navigate('/dashboard/club-members')} className="btn btn-outline border-gray-200 rounded-xl gap-2 h-16 hover:bg-blue-50">
                        <FaUsers /> View Members
                    </button>
                    <button onClick={() => navigate('/dashboard/manager-events')} className="btn btn-outline border-gray-200 rounded-xl gap-2 h-16 hover:bg-green-50">
                        <FaCalendarAlt /> Manage Events
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerOverview;
// src/pages/Dashboard/Member/MyMemberships.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useUserRole from '../../../hooks/useUserRole';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaCheckCircle, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';

const MyMemberships = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { dbUser, isRoleLoading } = useUserRole();

    const { 
        data: memberships = [], 
        isLoading: isMembershipsLoading, 
        error: membershipsError 
    } = useQuery({
        queryKey: ['myMemberships', dbUser?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/memberships/${dbUser.email}`);
            return res.data;
        },
        enabled: !!dbUser?.email && dbUser?.role === 'member',
    });

    if (isRoleLoading || isMembershipsLoading) return <LoadingSpinner />;
    if (dbUser?.role !== 'member') {
        return <div className="p-10 text-center text-error font-bold">Access Denied: Member role required.</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="p-4 md:p-8">
            <Helmet><title>My Memberships | ClubSphere</title></Helmet>
            
            <header className="mb-10">
                <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
                    <FaUsers className='text-blue-600' /> My Memberships
                </h1>
                <p className='text-gray-500 mt-2'>You have active memberships in {memberships.length} communities.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {memberships.length > 0 ? (
                    memberships.map((membership) => (
                        <div key={membership._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">
                                            <div className="w-16 h-16 rounded-2xl ring ring-blue-50 ring-offset-2">
                                                <img src={membership.clubLogo || 'https://via.placeholder.com/150'} alt="Club" />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{membership.clubName}</h2>
                                            <span className="badge badge-success badge-sm text-white font-bold uppercase tracking-wider">Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><FaCalendarAlt /> Joined On</span>
                                        <span className="font-semibold">{formatDate(membership.joinDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><FaDollarSign /> Membership Fee</span>
                                        <span className="font-bold text-blue-700">${membership.membershipFee || 0}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => navigate(`/clubs/${membership.clubId}`)}
                                        className="flex-1 btn btn-primary rounded-xl text-white font-bold"
                                    >
                                        Enter Club
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-2 flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <FaUsers className="text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-600">No Memberships Found</h3>
                        <p className="text-gray-400 mb-6 text-center">Ready to find your tribe? Explore the available clubs.</p>
                        <Link to="/clubs" className="btn btn-primary px-8 rounded-xl text-white">Explore Clubs</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyMemberships;
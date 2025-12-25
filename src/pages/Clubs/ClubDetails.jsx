import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router'; 
import useAxiosCommon from '../../hooks/useAxiosCommon';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import { FaUserPlus, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth'; 
import Swal from 'sweetalert2';

const ClubDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosCommon = useAxiosCommon();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: club, isLoading } = useQuery({
        queryKey: ['clubDetails', id],
        queryFn: async () => {
            const res = await axiosCommon.get(`/clubs/${id}`);
            return res.data;
        },
    });

    const handleJoinClub = () => {
        if (!user) {
            return navigate('/login', { state: { from: location } });
        }

        if (club.membershipFee > 0) {
            // REDIRECT TO PAYMENT
            navigate('/dashboard/payment', { 
                state: { 
                    price: club.membershipFee, 
                    clubId: club._id, 
                    clubName: club.clubName,
                    type: 'membership' 
                } 
            });
        } else {
            // Handle free join logic here via axiosSecure.post('/memberships', ...)
            Swal.fire("Success", "You joined this free club!", "success");
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <Helmet><title>{club.clubName} | Details</title></Helmet>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <img src={club.bannerImage} className="w-full h-80 object-cover" alt="" />
                <div className="p-10">
                    <h1 className="text-4xl font-black text-gray-800 mb-4">{club.clubName}</h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">{club.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-2xl">
                            <FaDollarSign className="text-blue-600 text-2xl" />
                            <div>
                                <p className="text-sm text-gray-500">Membership Fee</p>
                                <p className="font-bold text-xl">${club.membershipFee}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-green-50 rounded-2xl">
                            <FaCalendarAlt className="text-green-600 text-2xl" />
                            <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <p className="font-bold text-xl">{club.category}</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleJoinClub} className="btn btn-primary btn-lg w-full rounded-2xl gap-2">
                        <FaUserPlus /> Join Club Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;
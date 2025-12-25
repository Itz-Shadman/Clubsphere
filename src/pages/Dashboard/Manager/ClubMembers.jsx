import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Swal from 'sweetalert2';
import { FaUserTag, FaClock } from 'react-icons/fa';

const ClubMembers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: members = [], isLoading } = useQuery({
        queryKey: ['managerMembers', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/manager/members/${user?.email}`);
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (id) => {
            return await axiosSecure.patch(`/memberships/status/${id}`, { status: 'expired' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['managerMembers']);
            Swal.fire('Updated!', 'Membership marked as expired.', 'success');
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><FaUserTag /> Managed Club Members</h2>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border">
                <table className="table w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th>User Email</th>
                            <th>Club</th>
                            <th>Join Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member._id}>
                                <td>{member.userEmail}</td>
                                <td>{member.clubName}</td>
                                <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${member.status === 'expired' ? 'badge-error' : 'badge-success text-white'}`}>
                                        {member.status || 'Active'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => mutation.mutate(member._id)}
                                        disabled={member.status === 'expired'}
                                        className="btn btn-xs btn-outline btn-error"
                                    >
                                        Mark Expired
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClubMembers;
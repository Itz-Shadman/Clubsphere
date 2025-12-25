// src/pages/Dashboard/Admin/ManageClubs.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUserRole from "../../../hooks/useUserRole";
import toast from "react-hot-toast";
import { FaCheckCircle, FaClipboardList, FaTimesCircle, FaUserTag } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageClubs = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { dbUser, isRoleLoading } = useUserRole();

    if (isRoleLoading) return <LoadingSpinner />;
    if (dbUser?.role !== 'admin') {
        return <div className="p-10 text-center text-error">Access Denied: Admin role required.</div>;
    }
    
    // 1. Fetch all clubs (Admin gets all, regardless of status)
    const { data: clubs = [], isLoading: isClubsLoading } = useQuery({
        queryKey: ['adminAllClubs'],
        // NOTE: This assumes a secure /admin/clubs route is implemented 
        // that fetches ALL clubs (pending, approved, rejected).
        queryFn: async () => {
            const res = await axiosSecure.get('/clubs?adminView=true'); 
            return res.data;
        },
        staleTime: 1000 * 60,
    });

    // 2. Mutation for changing club status (Approve/Reject)
    const changeStatusMutation = useMutation({
        mutationFn: ({ clubId, newStatus }) => {
            // NOTE: This assumes a secure PATCH /clubs/:id route is implemented 
            // and verifies the Admin role.
            return axiosSecure.patch(`/clubs/${clubId}`, { status: newStatus });
        },
        onSuccess: (data) => {
            const clubName = data.data.clubName;
            const newStatus = data.data.status;
            toast.success(`${clubName} status updated to ${newStatus}.`);
            queryClient.invalidateQueries(['adminAllClubs', 'featuredClubs']); // Refetch lists
        },
        onError: () => {
            toast.error("Failed to update club status.");
        }
    });

    const handleStatusChange = (club, newStatus) => {
        Swal.fire({
            title: `Set status to ${newStatus}?`,
            text: `Do you want to change the status of ${club.clubName} to ${newStatus}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                changeStatusMutation.mutate({ clubId: club._id, newStatus });
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return 'badge-success';
            case 'rejected': return 'badge-error';
            default: return 'badge-warning';
        }
    };

    if (isClubsLoading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FaClipboardList /> Manage All Clubs
            </h1>
            <p className="mb-6 text-gray-600">Total Clubs: <span className="font-bold text-clubsphere-primary">{clubs.length}</span></p>

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="table w-full">
                    <thead>
                        <tr className="text-clubsphere-primary text-lg">
                            <th>#</th>
                            <th>Club Name</th>
                            <th>Manager Email</th>
                            <th>Fee</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map((club, index) => (
                            <tr key={club._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="font-bold">{club.clubName}</div>
                                </td>
                                <td>{club.managerEmail}</td>
                                <td>${club.membershipFee}</td>
                                <td>
                                    <span className={`badge ${getStatusBadge(club.status)} text-white`}>
                                        {club.status}
                                    </span>
                                </td>
                                <td>
                                    {club.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button 
                                                className="btn btn-sm btn-success text-white" 
                                                onClick={() => handleStatusChange(club, 'approved')}
                                                disabled={changeStatusMutation.isPending}
                                            >
                                                <FaCheckCircle /> Approve
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-error text-white" 
                                                onClick={() => handleStatusChange(club, 'rejected')}
                                                disabled={changeStatusMutation.isPending}
                                            >
                                                <FaTimesCircle /> Reject
                                            </button>
                                        </div>
                                    )}
                                    {(club.status === 'approved' || club.status === 'rejected') && (
                                        <span className="text-gray-500 text-sm">Action Complete</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageClubs;
// src/pages/Dashboard/Admin/ManageUsers.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUserRole from "../../../hooks/useUserRole";
import toast from "react-hot-toast";
import { FaUserShield, FaUsersCog, FaUserEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { dbUser, isRoleLoading } = useUserRole();

    // 1. Role Check
    if (isRoleLoading) return <LoadingSpinner />;
    if (dbUser?.role !== 'admin') {
        return <div className="p-10 text-center text-red-600 font-bold">Access Denied: Admin only.</div>;
    }

    // 2. Fetch Users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users'); // No role param to get everyone
            return res.data;
        }
    });

    // 3. Mutation to update user role
    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, newRole }) => {
            return axiosSecure.patch(`/users/role/${userId}`, { role: newRole });
        },
        onSuccess: () => {
            toast.success("User role updated successfully!");
            queryClient.invalidateQueries(['allUsers']);
        }
    });

    const handleMakeAdmin = (user) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Make ${user.name} an Admin?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, promote!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ userId: user._id, newRole: 'admin' });
            }
        });
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="p-4 md:p-8">
            <Helmet><title>Manage Users | Admin</title></Helmet>
            <h1 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
                <FaUsersCog className="text-blue-600" /> Manage Users
            </h1>

            <div className="overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100">
                <table className="table w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr className="text-gray-600 uppercase text-xs tracking-widest">
                            <th className="p-4">User</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-10 h-10">
                                                <img src={user.image || "https://i.ibb.co/vY7608H/admin-avatar.png"} alt={user.name} />
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-700">{user.name}</span>
                                    </div>
                                </td>
                                <td className="text-gray-500">{user.email}</td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                                        user.role === 'clubManager' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {user.role !== 'admin' ? (
                                        <button 
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                            title="Promote to Admin"
                                        >
                                            <FaUserShield size={18} />
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Full Access</span>
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

export default ManageUsers;
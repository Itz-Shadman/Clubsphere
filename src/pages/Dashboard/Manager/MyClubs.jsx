// src/pages/Dashboard/Manager/MyClubs.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUserRole from "../../../hooks/useUserRole";
import { FaPlus, FaEdit, FaTrashAlt, FaClipboardList } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import Swal from "sweetalert2";

const ClubCategories = ['Photography', 'Sports', 'Tech', 'Book', 'Hiking', 'Other'];

const ClubFormModal = ({ clubToEdit, onClose, refetchClubs }) => {
    const isEditMode = !!clubToEdit;
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: clubToEdit || {}
    });
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const clubMutation = useMutation({
        mutationFn: (data) => {
            if (isEditMode) {
                // PATCH /clubs/:id (Update existing club)
                return axiosSecure.patch(`/clubs/${clubToEdit._id}`, data);
            } else {
                // POST /clubs (Create new club)
                return axiosSecure.post('/clubs', data);
            }
        },
        onSuccess: () => {
            toast.success(isEditMode ? "Club updated successfully!" : "Club created successfully! Awaiting Admin approval.");
            queryClient.invalidateQueries(['managerMyClubs']); // Refetch the list
            onClose();
            reset();
        },
        onError: (err) => {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} club.`);
            console.error(err);
        }
    });

    const onSubmit = (data) => {
        // Ensure membershipFee is a number
        data.membershipFee = parseFloat(data.membershipFee) || 0;
        
        // Ensure status is correctly set on creation
        if (!isEditMode) {
            data.status = 'pending'; 
        }

        // The managerEmail will be injected on the backend from the token (secure method) 
        // or taken from the auth context (less secure, used here for simplicity):
        // data.managerEmail = user.email; // Assuming you pass user from useAuth to this component

        clubMutation.mutate(data);
    };

    return (
        <div className="modal-box w-11/12 max-w-4xl">
            <h3 className="font-bold text-2xl text-clubsphere-primary">{isEditMode ? 'Edit Club Details' : 'Create New Club'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="form-control">
                    <label className="label">Club Name*</label>
                    <input type="text" placeholder="Photography Enthusiasts" className="input input-bordered" 
                        {...register("clubName", { required: "Name is required" })} />
                    {errors.clubName && <p className="text-error text-sm">{errors.clubName.message}</p>}
                </div>

                <div className="form-control">
                    <label className="label">Location (City/Area)*</label>
                    <input type="text" placeholder="Dhaka, Bangladesh" className="input input-bordered" 
                        {...register("location", { required: "Location is required" })} />
                    {errors.location && <p className="text-error text-sm">{errors.location.message}</p>}
                </div>
                
                <div className="form-control">
                    <label className="label">Category*</label>
                    <select className="select select-bordered" 
                        {...register("category", { required: "Category is required" })}>
                        <option value="">Select Category</option>
                        {ClubCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.category && <p className="text-error text-sm">{errors.category.message}</p>}
                </div>
                
                <div className="form-control">
                    <label className="label">Membership Fee ($)*</label>
                    <input type="number" step="0.01" placeholder="0.00" className="input input-bordered" 
                        {...register("membershipFee", { 
                            required: "Fee is required", 
                            min: { value: 0, message: "Fee cannot be negative" } 
                        })} />
                    {errors.membershipFee && <p className="text-error text-sm">{errors.membershipFee.message}</p>}
                </div>

                <div className="form-control md:col-span-2">
                    <label className="label">Banner Image URL*</label>
                    <input type="url" placeholder="http://example.com/banner.jpg" className="input input-bordered" 
                        {...register("bannerImage", { required: "Image URL is required" })} />
                    {errors.bannerImage && <p className="text-error text-sm">{errors.bannerImage.message}</p>}
                </div>

                <div className="form-control md:col-span-2">
                    <label className="label">Description*</label>
                    <textarea placeholder="Tell us about your club..." className="textarea textarea-bordered h-24" 
                        {...register("description", { required: "Description is required" })} />
                    {errors.description && <p className="text-error text-sm">{errors.description.message}</p>}
                </div>

                <div className="form-control mt-6 md:col-span-2 flex flex-row gap-4 justify-end">
                    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={clubMutation.isPending}>Cancel</button>
                    <button 
                        type="submit" 
                        className="btn bg-clubsphere-primary text-white hover:bg-clubsphere-accent" 
                        disabled={clubMutation.isPending}
                    >
                        {clubMutation.isPending ? 'Saving...' : (isEditMode ? 'Update Club' : 'Create Club')}
                    </button>
                </div>
            </form>
        </div>
    );
};

const MyClubs = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { dbUser, isRoleLoading } = useUserRole();
    const [editClub, setEditClub] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isRoleLoading) return <LoadingSpinner />;
    if (dbUser?.role !== 'clubManager') {
        return <div className="p-10 text-center text-error">Access Denied: Club Manager role required.</div>;
    }

    // 1. Fetch clubs managed by this user
    const { data: myClubs = [], isLoading: isMyClubsLoading, refetch: refetchMyClubs } = useQuery({
        queryKey: ['managerMyClubs', dbUser?.email],
        queryFn: async () => {
            // NOTE: This assumes a secure route /manager/clubs/:email is implemented
            // that filters clubs by managerEmail and is protected by verifyManager role.
            const res = await axiosSecure.get(`/manager/clubs/${dbUser.email}`); 
            return res.data;
        },
        enabled: !!dbUser?.email,
        staleTime: 1000 * 30,
    });

    // 2. Mutation for deleting a club
    const deleteClubMutation = useMutation({
        mutationFn: (clubId) => {
            // NOTE: This assumes a secure DELETE /clubs/:id route is implemented.
            return axiosSecure.delete(`/clubs/${clubId}`);
        },
        onSuccess: () => {
            toast.success("Club deleted successfully.");
            queryClient.invalidateQueries(['managerMyClubs']);
        },
        onError: () => {
            toast.error("Failed to delete club.");
        }
    });

    const handleDelete = (club) => {
        Swal.fire({
            title: `Delete ${club.clubName}?`,
            text: "This action cannot be undone. All related events and memberships should ideally be handled (e.g., soft deleted).",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteClubMutation.mutate(club._id);
            }
        });
    };
    
    const openModal = (club = null) => {
        setEditClub(club);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditClub(null);
        setIsModalOpen(false);
    };


    if (isMyClubsLoading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FaClipboardList /> My Managed Clubs
            </h1>
            
            <div className="flex justify-end mb-6">
                <button 
                    className="btn bg-clubsphere-accent text-white hover:bg-clubsphere-primary"
                    onClick={() => openModal()}
                >
                    <FaPlus /> Create New Club
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.length > 0 ? (
                    myClubs.map(club => (
                        <div key={club._id} className="card bg-base-100 shadow-xl overflow-hidden">
                            <figure className="h-48">
                                <img src={club.bannerImage} alt={club.clubName} className="w-full h-full object-cover" />
                            </figure>
                            <div className="card-body p-6">
                                <h2 className="card-title text-clubsphere-primary">{club.clubName}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
                                <p className="font-semibold mt-2">Fee: <span className="text-clubsphere-accent">${club.membershipFee}</span></p>
                                <p className="text-sm">Status: <span className={`badge ${club.status === 'approved' ? 'badge-success' : club.status === 'rejected' ? 'badge-error' : 'badge-warning'} text-white`}>{club.status}</span></p>
                                
                                <div className="card-actions justify-end mt-4">
                                    <button 
                                        className="btn btn-sm btn-info text-white"
                                        onClick={() => openModal(club)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-error text-white"
                                        onClick={() => handleDelete(club)}
                                        disabled={deleteClubMutation.isPending}
                                    >
                                        <FaTrashAlt /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-3 text-center py-10 bg-white rounded-lg shadow-lg">
                        <p className="text-xl text-gray-500">You are not managing any clubs yet.</p>
                    </div>
                )}
            </div>
            
            {/* Modal for Create/Edit */}
            <input type="checkbox" id="club_form_modal" className="modal-toggle" checked={isModalOpen} onChange={() => {}} />
            <div className={`modal ${isModalOpen ? 'modal-open' : ''}`} role="dialog">
                <ClubFormModal clubToEdit={editClub} onClose={closeModal} />
            </div>
        </div>
    );
};

export default MyClubs;
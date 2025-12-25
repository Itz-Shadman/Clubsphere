// src/pages/Dashboard/Manager/ManageEvents.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUserRole from "../../../hooks/useUserRole";
import { FaPlus, FaEdit, FaTrashAlt, FaCalendarAlt, FaCalendarDay } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import Swal from "sweetalert2";

// Helper function to format date for input[type="datetime-local"]
const formatDateTimeForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Format: YYYY-MM-DDTHH:MM
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};


const EventFormModal = ({ eventToEdit, onClose }) => {
    const isEditMode = !!eventToEdit;
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            ...eventToEdit,
            // Format existing eventDate for the input field
            eventDate: eventToEdit ? formatDateTimeForInput(eventToEdit.eventDate) : '',
            isPaid: eventToEdit ? eventToEdit.eventFee > 0 : false,
        }
    });
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const isPaid = watch('isPaid');
    const { dbUser } = useUserRole();

    // Fetch the list of clubs managed by the user for the dropdown
    const { data: managerClubs = [], isLoading: isClubsLoading } = useQuery({
        queryKey: ['managerClubsList', dbUser?.email],
        queryFn: async () => {
            // NOTE: Assumes a route to fetch clubs managed by this user's email
            const res = await axiosSecure.get(`/manager/clubs/${dbUser.email}`); 
            return res.data.filter(club => club.status === 'approved'); // Only allow events for approved clubs
        },
        enabled: !!dbUser?.email,
    });


    const eventMutation = useMutation({
        mutationFn: (data) => {
            // Ensure fee is numeric and boolean status reflects fee
            data.eventFee = data.isPaid ? parseFloat(data.eventFee) || 0 : 0;
            data.isPaid = data.eventFee > 0;
            
            if (isEditMode) {
                // PATCH /events/:id (Update existing event)
                return axiosSecure.patch(`/events/${eventToEdit._id}`, data);
            } else {
                // POST /events (Create new event)
                return axiosSecure.post('/events', data);
            }
        },
        onSuccess: () => {
            toast.success(isEditMode ? "Event updated successfully!" : "Event created successfully!");
            queryClient.invalidateQueries(['managerMyEvents']); // Refetch the manager's list
            queryClient.invalidateQueries(['events']); // Invalidate public event list
            onClose();
            reset();
        },
        onError: (err) => {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} event.`);
            console.error(err);
        }
    });

    const onSubmit = (data) => {
        eventMutation.mutate(data);
    };

    if (isClubsLoading) {
        return <div className="modal-box w-11/12 max-w-4xl"><LoadingSpinner /></div>;
    }

    return (
        <div className="modal-box w-11/12 max-w-4xl">
            <h3 className="font-bold text-2xl text-clubsphere-primary">{isEditMode ? 'Edit Event Details' : 'Create New Event'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="form-control">
                    <label className="label">Event Title*</label>
                    <input type="text" placeholder="Club Meetup at Park" className="input input-bordered" 
                        {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="text-error text-sm">{errors.title.message}</p>}
                </div>

                <div className="form-control">
                    <label className="label">Club*</label>
                    <select className="select select-bordered" 
                        disabled={isEditMode} // Prevent changing club ID after creation
                        {...register("clubId", { required: "Club selection is required" })}>
                        <option value="">Select Managed Club</option>
                        {managerClubs.map(club => (
                            <option key={club._id} value={club._id}>{club.clubName} ({club.status})</option>
                        ))}
                    </select>
                    {errors.clubId && <p className="text-error text-sm">{errors.clubId.message}</p>}
                </div>

                <div className="form-control">
                    <label className="label">Event Date & Time*</label>
                    <input type="datetime-local" className="input input-bordered" 
                        {...register("eventDate", { 
                            required: "Date and Time is required",
                            validate: value => new Date(value) > new Date() || "Event must be in the future"
                        })} />
                    {errors.eventDate && <p className="text-error text-sm">{errors.eventDate.message}</p>}
                </div>

                <div className="form-control">
                    <label className="label">Location (Address/Place)*</label>
                    <input type="text" placeholder="Community Hall 3A" className="input input-bordered" 
                        {...register("location", { required: "Location is required" })} />
                    {errors.location && <p className="text-error text-sm">{errors.location.message}</p>}
                </div>

                <div className="form-control flex flex-row items-center gap-4 border p-3 rounded-lg md:col-span-2">
                    <label className="label cursor-pointer flex-grow">
                        <span className="label-text font-semibold">Is this a paid event?</span>
                    </label>
                    <input type="checkbox" className="toggle toggle-primary" 
                        {...register("isPaid")} />
                </div>
                
                {isPaid && (
                    <div className="form-control">
                        <label className="label">Event Fee ($)*</label>
                        <input type="number" step="0.01" placeholder="5.00" className="input input-bordered" 
                            {...register("eventFee", { 
                                required: isPaid ? "Fee is required" : false, 
                                min: { value: 0, message: "Fee cannot be negative" } 
                            })} />
                        {errors.eventFee && <p className="text-error text-sm">{errors.eventFee.message}</p>}
                    </div>
                )}
                
                <div className="form-control md:col-span-2">
                    <label className="label">Description*</label>
                    <textarea placeholder="Details about the event..." className="textarea textarea-bordered h-24" 
                        {...register("description", { required: "Description is required" })} />
                    {errors.description && <p className="text-error text-sm">{errors.description.message}</p>}
                </div>

                <div className="form-control mt-6 md:col-span-2 flex flex-row gap-4 justify-end">
                    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={eventMutation.isPending}>Cancel</button>
                    <button 
                        type="submit" 
                        className="btn bg-clubsphere-primary text-white hover:bg-clubsphere-accent" 
                        disabled={eventMutation.isPending}
                    >
                        {eventMutation.isPending ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create Event')}
                    </button>
                </div>
            </form>
        </div>
    );
};


const ManageEvents = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { dbUser, isRoleLoading } = useUserRole();
    const [editEvent, setEditEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isRoleLoading) return <LoadingSpinner />;
    if (dbUser?.role !== 'clubManager') {
        return <div className="p-10 text-center text-error">Access Denied: Club Manager role required.</div>;
    }

    // 1. Fetch events managed by this user (joined with club details)
    const { data: myEvents = [], isLoading: isMyEventsLoading } = useQuery({
        queryKey: ['managerMyEvents', dbUser?.email],
        queryFn: async () => {
            // NOTE: Assumes a secure route /manager/events/:email is implemented
            const res = await axiosSecure.get(`/manager/events/${dbUser.email}`); 
            return res.data;
        },
        enabled: !!dbUser?.email,
        staleTime: 1000 * 30,
    });

    // 2. Mutation for deleting an event
    const deleteEventMutation = useMutation({
        mutationFn: (eventId) => {
            // NOTE: This assumes a secure DELETE /events/:id route is implemented.
            return axiosSecure.delete(`/events/${eventId}`);
        },
        onSuccess: () => {
            toast.success("Event deleted successfully.");
            queryClient.invalidateQueries(['managerMyEvents']);
            queryClient.invalidateQueries(['events']); // Invalidate public event list
        },
        onError: () => {
            toast.error("Failed to delete event.");
        }
    });

    const handleDelete = (event) => {
        Swal.fire({
            title: `Delete ${event.title}?`,
            text: "This action cannot be undone. Any registered members will be notified.",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEventMutation.mutate(event._id);
            }
        });
    };
    
    const openModal = (event = null) => {
        setEditEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditEvent(null);
        setIsModalOpen(false);
    };


    if (isMyEventsLoading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FaCalendarAlt /> Manage Events
            </h1>
            
            <div className="flex justify-end mb-6">
                <button 
                    className="btn bg-clubsphere-accent text-white hover:bg-clubsphere-primary"
                    onClick={() => openModal()}
                >
                    <FaPlus /> Create New Event
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myEvents.length > 0 ? (
                    myEvents.map(event => (
                        <div key={event._id} className="card bg-base-100 shadow-xl overflow-hidden border border-gray-100">
                            <div className="card-body p-6">
                                <span className="badge badge-info text-white">{event.clubName}</span>
                                <h2 className="card-title text-2xl text-clubsphere-primary mt-2">{event.title}</h2>
                                
                                <p className="text-sm font-semibold text-gray-700 mt-2 flex items-center gap-2">
                                    <FaCalendarDay /> 
                                    {new Date(event.eventDate).toLocaleDateString()} at {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-gray-500 line-clamp-3 mt-1">{event.description}</p>
                                
                                <div className="mt-4 flex justify-between items-center">
                                    <span className={`font-bold ${event.isPaid ? 'text-clubsphere-accent' : 'text-success'}`}>
                                        {event.isPaid ? `Fee: $${event.eventFee.toFixed(2)}` : 'FREE'}
                                    </span>
                                    <span className="text-sm text-gray-500">Location: {event.location}</span>
                                </div>
                                
                                <div className="card-actions justify-end mt-4">
                                    <button 
                                        className="btn btn-sm btn-info text-white"
                                        onClick={() => openModal(event)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-error text-white"
                                        onClick={() => handleDelete(event)}
                                        disabled={deleteEventMutation.isPending}
                                    >
                                        <FaTrashAlt /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="lg:col-span-2 text-center py-10 bg-white rounded-lg shadow-lg">
                        <p className="text-xl text-gray-500">No events found for your managed clubs.</p>
                        <button 
                            className="btn btn-primary mt-4"
                            onClick={() => openModal()}
                        >
                            Create Your First Event
                        </button>
                    </div>
                )}
            </div>
            
            {/* Modal for Create/Edit */}
            <input type="checkbox" id="event_form_modal" className="modal-toggle" checked={isModalOpen} onChange={() => {}} />
            <div className={`modal ${isModalOpen ? 'modal-open' : ''}`} role="dialog">
                <EventFormModal eventToEdit={editEvent} onClose={closeModal} />
            </div>
        </div>
    );
};

export default ManageEvents;
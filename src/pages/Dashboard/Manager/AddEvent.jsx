import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AddEvent = () => {
    const { register, handleSubmit, reset, watch } = useForm();
    const axiosSecure = useAxiosSecure();
    const { dbUser } = useUserRole();
    const isPaid = watch("isPaid");

    // Fetch only the manager's approved clubs to link the event
    const { data: myClubs = [], isLoading } = useQuery({
        queryKey: ['myApprovedClubs', dbUser?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/manager/clubs/${dbUser?.email}`);
            return res.data.filter(club => club.status === "approved");
        }
    });

    const mutation = useMutation({
        mutationFn: (newEvent) => axiosSecure.post("/events", newEvent),
        onSuccess: () => {
            Swal.fire("Created!", "Event added successfully.", "success");
            reset();
        }
    });

    const onSubmit = (data) => {
        const eventData = {
            ...data,
            isPaid: data.isPaid === "true",
            eventFee: data.isPaid === "true" ? parseFloat(data.eventFee) : 0,
            maxAttendees: parseInt(data.maxAttendees),
            createdAt: new Date()
        };
        mutation.mutate(eventData);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-sm border mt-10">
            <h2 className="text-3xl font-black mb-6 text-blue-600">Create New Event</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                    <label className="label font-bold">Select Club</label>
                    <select {...register("clubId", { required: true })} className="select select-bordered rounded-xl">
                        {myClubs.map(club => <option key={club._id} value={club._id}>{club.clubName}</option>)}
                    </select>
                </div>
                <div className="form-control">
                    <label className="label font-bold">Event Title</label>
                    <input {...register("title", { required: true })} className="input input-bordered rounded-xl" />
                </div>
                <div className="form-control md:col-span-2">
                    <label className="label font-bold">Description</label>
                    <textarea {...register("description", { required: true })} className="textarea textarea-bordered rounded-xl"></textarea>
                </div>
                <div className="form-control">
                    <label className="label font-bold">Date & Time</label>
                    <input type="datetime-local" {...register("eventDate", { required: true })} className="input input-bordered rounded-xl" />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Location</label>
                    <input {...register("location", { required: true })} className="input input-bordered rounded-xl" />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Payment Type</label>
                    <select {...register("isPaid")} className="select select-bordered rounded-xl">
                        <option value="false">Free</option>
                        <option value="true">Paid</option>
                    </select>
                </div>
                {isPaid === "true" && (
                    <div className="form-control">
                        <label className="label font-bold">Event Fee ($)</label>
                        <input type="number" {...register("eventFee")} className="input input-bordered rounded-xl" />
                    </div>
                )}
                <div className="form-control">
                    <label className="label font-bold">Max Attendees</label>
                    <input type="number" {...register("maxAttendees")} className="input input-bordered rounded-xl" defaultValue="50" />
                </div>
                <button type="submit" className="btn btn-primary md:col-span-2 rounded-xl">Publish Event</button>
            </form>
        </div>
    );
};

export default AddEvent;
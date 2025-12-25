import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const AddClub = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const { dbUser } = useUserRole();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (newClub) => axiosSecure.post("/clubs", newClub),
        onSuccess: () => {
            Swal.fire("Success!", "Club submitted for admin approval.", "success");
            reset();
            navigate("/dashboard/manager-my-clubs");
        }
    });

    const onSubmit = (data) => {
        const clubData = {
            ...data,
            membershipFee: parseFloat(data.membershipFee),
            managerEmail: dbUser?.email,
            status: "pending",
            createdAt: new Date()
        };
        mutation.mutate(clubData);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-sm border mt-10">
            <h2 className="text-3xl font-black mb-6">Register a New Club</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                    <label className="label font-bold">Club Name</label>
                    <input {...register("clubName", { required: true })} className="input input-bordered rounded-xl" placeholder="e.g. Tech Pioneers" />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Category</label>
                    <select {...register("category", { required: true })} className="select select-bordered rounded-xl">
                        <option value="Tech">Tech</option>
                        <option value="Sports">Sports</option>
                        <option value="Photography">Photography</option>
                        <option value="Arts">Arts</option>
                    </select>
                </div>
                <div className="form-control md:col-span-2">
                    <label className="label font-bold">Description</label>
                    <textarea {...register("description", { required: true })} className="textarea textarea-bordered rounded-xl" rows="3"></textarea>
                </div>
                <div className="form-control">
                    <label className="label font-bold">Location</label>
                    <input {...register("location", { required: true })} className="input input-bordered rounded-xl" placeholder="City or Campus Area" />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Membership Fee ($)</label>
                    <input type="number" {...register("membershipFee", { required: true })} className="input input-bordered rounded-xl" defaultValue="0" />
                </div>
                <div className="form-control md:col-span-2">
                    <label className="label font-bold">Banner Image URL</label>
                    <input {...register("bannerImage", { required: true })} className="input input-bordered rounded-xl" placeholder="https://image-link.com" />
                </div>
                <button type="submit" className="btn btn-primary md:col-span-2 rounded-xl mt-4">Submit Club for Approval</button>
            </form>
        </div>
    );
};

export default AddClub;
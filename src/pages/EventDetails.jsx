import { Link, useParams, useNavigate } from "react-router"; 
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import LoadingSpinner from "../components/LoadingSpinner";
import { Helmet } from "react-helmet-async";
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaTag, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const GENERIC_CLUB_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { dbUser, isRoleLoading } = useUserRole();

    const { data: event, isLoading: isEventLoading, isError } = useQuery({
        queryKey: ['eventDetails', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const { data: isRegistered = false, isLoading: isStatusLoading } = useQuery({
        queryKey: ['eventRegistrationStatus', id, dbUser?.email],
        queryFn: async () => {
            if (!dbUser?.email) return false;
            const res = await axiosSecure.get(`/events/check-registration/${id}/${dbUser.email}`);
            return res.data.isRegistered;
        },
        enabled: !!dbUser && !isEventLoading,
    });

    if (isEventLoading || isRoleLoading || isStatusLoading) return <LoadingSpinner />;
    if (isError || !event) return <div className="text-center p-10 font-bold">Event Not Found</div>;

    const { title, description, eventDate, location, eventFee, isPaid, clubId, clubName, clubLogo } = event;

    const handleRegisterClick = async () => {
        if (!dbUser) return navigate('/login');
        if (isPaid && !isRegistered) {
            return navigate(`/payment/event/${id}`, { state: { eventId: id, eventTitle: title, eventFee } });
        }

        try {
            const res = await axiosSecure.post('/events/register', {
                eventId: id, eventTitle: title, userEmail: dbUser.email, userName: dbUser.name
            });
            if (res.data.insertedId) {
                toast.success("Successfully registered!");
                window.location.reload(); 
            }
        } catch (err) { toast.error("Registration failed."); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-6xl mx-auto">
            <Helmet>
                <title>{title || "Event"} | ClubSphere</title> 
            </Helmet>
            
            <div className="bg-blue-900 text-white p-10 rounded-lg flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">{title}</h1>
                    <p className="mt-2 flex items-center gap-2"><FaTag /> Hosted by {clubName}</p>
                </div>
                <img src={clubLogo || GENERIC_CLUB_LOGO} className="w-20 h-20 rounded-full border-4 border-white object-cover" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2 bg-gray-500 p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Details</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><FaCalendarAlt /> {new Date(eventDate).toLocaleString()}</div>
                        <div className="flex items-center gap-3"><FaMapMarkerAlt /> {location}</div>
                        <div className="flex items-center gap-3"><FaDollarSign /> {isPaid ? `$${eventFee}` : 'FREE'}</div>
                    </div>
                    <p className="mt-6 text-gray-600">{description}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md h-fit text-center">
                    <h3 className="text-2xl font-bold mb-4">Join Us</h3>
                    {isRegistered && <div className="p-2 bg-green-100 text-green-700 rounded mb-4 flex items-center justify-center gap-2"><FaCheckCircle /> Registered</div>}
                    <button 
                        onClick={handleRegisterClick} 
                        disabled={isRegistered}
                        className={`btn btn-block ${isRegistered ? 'btn-disabled' : 'btn-primary'}`}
                    >
                        {isRegistered ? 'Registered' : isPaid ? `Pay $${eventFee}` : 'Register Free'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default EventDetails;
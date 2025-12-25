import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/LoadingSpinner';

const EventRegistrations = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: attendees = [], isLoading } = useQuery({
        queryKey: ['registrations', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/event-registrations/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Event Attendees</h2>
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Email</th>
                            <th>Status</th>
                            <th>Registered At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendees.map((at, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{at.userEmail}</td>
                                <td>
                                    <span className={`badge ${at.status === 'cancelled' ? 'badge-ghost' : 'badge-primary'}`}>
                                        {at.status}
                                    </span>
                                </td>
                                <td>{new Date(at.registeredAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {attendees.length === 0 && <p className="text-center py-10 text-gray-400">No one has registered for this event yet.</p>}
            </div>
        </div>
    );
};

export default EventRegistrations;
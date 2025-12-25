import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import { FaHistory, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const ManagePayments = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['adminPayments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/payments');
            return res.data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="p-4 md:p-8">
            <Helmet><title>Payments | ClubSphere</title></Helmet>
            
            <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4 flex items-center gap-2">
                <FaArrowLeft /> Back to Dashboard
            </button>

            <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
                <FaHistory className="text-emerald-600" /> Transaction Records
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-5">User Email</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Club Name</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
                                    <td className="p-5 font-medium text-gray-700">{p.userEmail}</td>
                                    <td><span className="font-bold text-emerald-600">${p.amount}</span></td>
                                    <td>
                                        <span className={`badge badge-sm border-none font-bold ${
                                            p.type === 'membership' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {p.type}
                                        </span>
                                    </td>
                                    <td className="text-gray-500 italic">{p.clubName}</td>
                                    <td className="text-gray-400 text-sm">
                                        {p.date ? new Date(p.date).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagePayments;
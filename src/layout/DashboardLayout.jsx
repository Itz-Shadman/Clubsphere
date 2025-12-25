import { Outlet } from 'react-router';
import { FaUserShield, FaCog, FaUsers, FaHome, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth'; 
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
    const { user, dbUser, logOut } = useAuth();
    const navigate = useNavigate();

    // Ensure we handle 'clubManager' vs 'manager' strings from your DB
    const userRole = dbUser?.role?.toLowerCase();

    const handleLogout = () => {
        logOut()
            .then(() => {
                navigate('/login');
                toast.success('Successfully logged out!');
            })
            .catch(error => {
                console.error("Logout Error:", error);
                toast.error('Failed to log out.');
            });
    };

    const getNavLinks = (role) => {
        // Checking for 'clubmanager' specifically as it is common in your DB
        if (role === 'admin') {
            return (
                <>
                    <Link to="admin-overview" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaHome className="w-5 h-5" />
                        <span className="ml-3">Admin Overview</span>
                    </Link>
                    <Link to="admin-users" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaUsers className="w-5 h-5" />
                        <span className="ml-3">Manage Users</span>
                    </Link>
                    <Link to="admin-clubs" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaCog className="w-5 h-5" />
                        <span className="ml-3">Manage Clubs</span>
                    </Link>
                </>
            );
        } else if (role === 'manager' || role === 'clubmanager') {
            return (
                <>
                    <Link to="manager-overview" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaHome className="w-5 h-5" />
                        <span className="ml-3">Manager Overview</span>
                    </Link>
                    <Link to="manager-my-clubs" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaUserShield className="w-5 h-5" />
                        <span className="ml-3">My Clubs</span>
                    </Link>
                    <Link to="manager-events" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaCalendarAlt className="w-5 h-5" />
                        <span className="ml-3">Manage Events</span>
                    </Link>
                </>
            );
        } else {
            return (
                <>
                    <Link to="member-overview" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaHome className="w-5 h-5" />
                        <span className="ml-3">Member Overview</span>
                    </Link>
                    <Link to="member-my-clubs" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                        <FaUsers className="w-5 h-5" />
                        <span className="ml-3">My Memberships</span>
                    </Link>
                </>
            );
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-clubsphere-primary text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-bold border-b border-gray-700">
                    <span className='text-clubsphere-accent'>{userRole?.toUpperCase() || 'USER'}</span> DASH
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {getNavLinks(userRole)}
                    <div className="pt-4 mt-4 border-t border-gray-700 space-y-2">
                        <Link to="/" className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700">
                            <FaHome className="w-5 h-5" />
                            <span className="ml-3">Back to Home</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center p-3 text-white rounded-lg hover:bg-red-600 w-full text-left">
                            <FaSignOutAlt className="w-5 h-5" />
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8 pb-4 border-b border-gray-300">
                    <h1 className="text-4xl font-extrabold text-gray-800 capitalize">
                        Welcome, {user?.displayName || dbUser?.name || 'User'}!
                    </h1>
                    <p className="text-gray-500">
                        {userRole ? `You are currently viewing the ${userRole} dashboard.` : "Loading role..."}
                    </p>
                </header>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
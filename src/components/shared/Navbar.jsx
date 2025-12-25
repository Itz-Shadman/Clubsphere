// src/components/shared/Navbar.jsx
import { Link, NavLink } from 'react-router'; // CORRECT: use 'react-router-dom'
import useAuth from '../../hooks/useAuth'; // CORRECT: Import useAuth from the hooks folder
import { FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useUserRole from '../../hooks/useUserRole'; 

const Navbar = () => {
    // Correctly call the hook (default export)
    const { user, logOut } = useAuth(); 
    // Custom hook to fetch and provide the current user's role from the DB
    // NOTE: useUserRole returns { dbUser, isRoleLoading } from the AuthProvider context
    const { dbUser, isRoleLoading } = useUserRole(); 
    
    // Determine the base dashboard route based on role
    // Example: /dashboard/admin, /dashboard/clubManager, or /dashboard/member
    const dashboardBase = dbUser?.role ? `/dashboard/${dbUser.role}` : '/dashboard/member-overview';

    const handleLogout = () => {
        logOut()
            .then(() => {
                toast.success("Logged out successfully!");
            })
            .catch(error => {
                toast.error(error.message);
            });
    };

    const navLinks = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-clubsphere-accent font-bold' : 'hover:text-clubsphere-accent'}>Home</NavLink></li>
            <li><NavLink to="/clubs" className={({ isActive }) => isActive ? 'text-clubsphere-accent font-bold' : 'hover:text-clubsphere-accent'}>Clubs</NavLink></li>
            <li><NavLink to="/events" className={({ isActive }) => isActive ? 'text-clubsphere-accent font-bold' : 'hover:text-clubsphere-accent'}>Events</NavLink></li>
        </>
    );

    const profileDropdown = (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    {/* User PhotoURL or a default icon */}
                    {user?.photoURL ? (
                        <img alt={user.displayName || user.email} src={user.photoURL} />
                    ) : (
                        <FaUserCircle className='w-10 h-10 text-clubsphere-primary' />
                    )}
                </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[10] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <a className="justify-between font-bold text-clubsphere-primary">
                        {dbUser?.name || user?.displayName || 'User'}
                        {/* Display role badge */}
                        {isRoleLoading ? 
                            <span className="badge badge-sm badge-info">Loading...</span> : 
                            <span className="badge badge-sm badge-info capitalize">{dbUser?.role || 'member'}</span>
                        }
                    </a>
                </li>
                {/* Redirects to the correct dashboard based on role */}
                <li><Link to={dashboardBase}>Dashboard</Link></li> 
                <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
        </div>
    );

    const authLinks = (
        <div className='flex gap-2 ml-4'>
            <Link to="/login" className="btn btn-sm btn-outline border-clubsphere-primary text-clubsphere-primary hover:bg-clubsphere-primary hover:border-clubsphere-primary">Login</Link>
            <Link to="/register" className="btn btn-sm btn-clubsphere-primary bg-clubsphere-primary text-white hover:bg-clubsphere-accent">Register</Link>
        </div>
    );

    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                {/* Logo/Project Name */}
                <Link to="/" className="btn btn-ghost text-xl font-bold text-clubsphere-primary">
                    ClubSphere
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-2">
                    {navLinks}
                </ul>
            </div>
            
            <div className="navbar-end">
                {user ? profileDropdown : authLinks}
            </div>
        </div>
    );
};

export default Navbar;
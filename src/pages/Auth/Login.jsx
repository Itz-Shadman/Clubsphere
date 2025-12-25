import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../providers/AuthProvider";
import { Helmet } from "react-helmet-async";
import { mockUsers } from "../../data/mockUsers"; // Ensure this path is correct
import { FaEnvelope, FaLock, FaUserShield, FaSignInAlt } from "react-icons/fa";

export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("member");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // --- AUTO-FILL HANDLER ---
    const handleQuickLogin = (selectedUser) => {
        setEmail(selectedUser.email);
        setPassword(selectedUser.password);
        setRole(selectedUser.role);
        setError(""); // Clear any existing errors
    };

    // --- LOGIN HANDLER ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // This calls the signIn in AuthProvider which checks mockUsers.js first
            await signIn(email, password);
            
            // Redirect based on the UI selected role
            if (role === "admin") {
                navigate("/dashboard/admin-overview");
            } else if (role === "clubManager") {
                navigate("/dashboard/manager-overview");
            } else {
                navigate("/dashboard/member-overview");
            }
        } catch (err) {
            console.error(err);
            setError("Login failed. Check your credentials or try a Demo Login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Helmet><title>Login | ClubSphere</title></Helmet>
            
            <div className="bg-white shadow-2xl p-8 w-full max-w-md rounded-3xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">ClubSphere</h2>
                    <p className="text-gray-500 font-medium">Connect. Lead. Empower.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
                        <p className="text-red-700 text-sm font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Role Selector */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 ml-1">
                            <FaUserShield /> Login Role
                        </label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 outline-none focus:border-blue-500 transition-all font-semibold text-gray-700"
                        >
                            <option value="member">Member</option>
                            <option value="clubManager">Club Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 ml-1">
                            <FaEnvelope /> Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 outline-none focus:border-blue-500 transition-all"
                            placeholder="admin@clubsphere.com"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 ml-1">
                            <FaLock /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 outline-none focus:border-blue-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? "Verifying..." : <><FaSignInAlt /> Log In</>}
                    </button>
                </form>

                {/* --- QUICK DEMO LOGIN BUTTONS --- */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-5">
                        Development Quick Access
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {mockUsers.map((u) => (
                            <button
                                key={u.id}
                                type="button"
                                onClick={() => handleQuickLogin(u)}
                                className="text-[11px] font-bold py-3 px-2 rounded-xl border-2 border-gray-50 hover:border-blue-200 hover:bg-blue-50 transition-all text-gray-600 flex flex-col items-center"
                            >
                                <span className="text-gray-900">{u.name.split(' ')[0]}</span>
                                <span className="text-[9px] text-blue-500 uppercase">{u.role === 'admin' ? 'Admin' : 'Manager'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Need an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    );
}
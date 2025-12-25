// src/layout/MainLayout.jsx (FIXED)
import { Outlet } from "react-router"; // Use react-router-dom
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
// Import both Helmet and HelmetProvider
import { Helmet, HelmetProvider } from "react-helmet-async"; 

const MainLayout = () => {
    return (
        <div>
            {/* The Provider wraps the content */}
            <HelmetProvider> 
                <Helmet>
                    <title>ClubSphere - Membership & Event Management for Local Clubs</title>
                </Helmet>
                <Navbar />
                <main className="min-h-[calc(100vh-100px)]">
                    <Outlet />
                </main>
            </HelmetProvider>
            <Footer />
        </div>
    );
};

export default MainLayout;

import { Outlet } from "react-router"; 
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

import { Helmet, HelmetProvider } from "react-helmet-async"; 

const MainLayout = () => {
    return (
        <div>

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
// src/pages/Home.jsx
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router"; 
import useFeaturedClubs from "../hooks/useFeaturedClubs";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaUsers, FaCalendarAlt, FaStar } from 'react-icons/fa';


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const HeroSection = () => (
    <motion.div 
        className="hero min-h-[70vh] bg-base-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto py-12">

            <motion.div 
                className="lg:w-1/2"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
                
                <img 
                    src="[REPLACE WITH WORKING HERO IMAGE URL/PATH]" 
                    className="w-full max-w-lg rounded-lg shadow-2xl" 
                    alt="ClubSphere Community"
                />
            </motion.div>
            
       
            <motion.div 
                className="lg:w-1/2 text-center lg:text-left"
                variants={containerVariants}
            >
                <motion.h1 
                    className="text-5xl md:text-6xl font-extrabold text-clubsphere-primary leading-tight"
                    variants={itemVariants}
                >
                    Discover Your Local Passion.
                </motion.h1>
                <motion.p 
                    className="py-6 text-lg text-gray-700 max-w-xl"
                    variants={itemVariants}
                >
                    ClubSphere connects you to vibrant local clubs and groups. Join, manage memberships, and register for events—all in one place.
                </motion.p>
                <motion.div variants={itemVariants} className="flex gap-4 justify-center lg:justify-start">
                    <Link to="/clubs" className="btn btn-lg bg-clubsphere-accent text-white hover:bg-clubsphere-primary shadow-lg">
                        Join a Club Today
                    </Link>
                    <Link to="/register" className="btn btn-lg btn-outline border-clubsphere-primary text-clubsphere-primary hover:bg-clubsphere-primary hover:text-white">
                        Create a Club
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    </motion.div>
);

const ClubCard = ({ club, index }) => {

    return (
        <motion.div
            className="card w-full bg-base-100 shadow-xl image-full group cursor-pointer hover:shadow-2xl transition-shadow"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
        >
            <figure><img src={club.bannerImage} alt={club.clubName} className="object-cover w-full h-full" /></figure>
            <div className="card-body justify-end p-6 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all">
                <h2 className="card-title text-2xl text-white">
                    {club.clubName}
                </h2>
                <p className="text-sm text-gray-200 line-clamp-2">{club.description}</p>
                <div className="flex justify-between items-center text-sm text-white mt-2">
                    <span className="badge badge-primary">{club.category}</span>
                    <span className="text-clubsphere-accent font-semibold">
                        {club.membershipFee > 0 ? `$${club.membershipFee} / Year` : 'Free'}
                    </span>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link to={`/clubs/${club._id}`} className="btn btn-sm bg-clubsphere-accent text-white hover:bg-clubsphere-primary">View Details</Link>
                </div>
            </div>
        </motion.div>
    );
};


const FeaturedClubsSection = () => {
    const { featuredClubs, isFeaturedClubsLoading } = useFeaturedClubs();

    if (isFeaturedClubsLoading) {
        return <div className="py-20"><LoadingSpinner /></div>;
    }
    
    if (featuredClubs.length === 0) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">Featured Clubs</h2>
                <p className="text-gray-500">No approved clubs to feature yet. Check back soon!</p>
            </div>
        );
    }

    return (
        <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-clubsphere-primary mb-12">
                    🔥 Featured & Newly Approved Clubs
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredClubs.map((club, index) => (
                        <ClubCard key={club._id} club={club} index={index} />
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <Link to="/clubs" className="btn btn-lg bg-clubsphere-primary text-white hover:bg-clubsphere-accent">
                        Browse All Clubs
                    </Link>
                </div>
            </div>
        </div>
    );
};

const HowItWorksSection = () => (
    <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-clubsphere-primary mb-12">
                How ClubSphere Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                <motion.div 
                    className="p-6 rounded-xl shadow-lg bg-base-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaUsers className="w-12 h-12 text-clubsphere-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">1. Discover</h3>
                    <p className="text-gray-600">Browse hundreds of approved local clubs based on your interests and location.</p>
                </motion.div>
                <motion.div 
                    className="p-6 rounded-xl shadow-lg bg-base-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <FaStar className="w-12 h-12 text-clubsphere-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">2. Join & Pay</h3>
                    <p className="text-gray-600">Securely join clubs, pay membership fees via Stripe, and gain exclusive access.</p>
                </motion.div>
                <motion.div 
                    className="p-6 rounded-xl shadow-lg bg-base-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <FaCalendarAlt className="w-12 h-12 text-clubsphere-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">3. Participate</h3>
                    <p className="text-gray-600">Register for events, track your history, and connect with fellow club members.</p>
                </motion.div>
            </div>
        </div>
    </div>
);

const Home = () => {
    return (
        <section>
            <Helmet>
                <title>Home | ClubSphere</title>
            </Helmet>
            
            <HeroSection />
            <FeaturedClubsSection />
            <HowItWorksSection />
            
            {/* You can add Extra Section 2: “Popular Categories” here */}
            
        </section>
    );
};

export default Home;
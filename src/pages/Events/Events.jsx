// src/pages/Events/Events.jsx
import { Helmet } from "react-helmet-async";
import { useQuery } from '@tanstack/react-query';
import useAxiosCommon from "../../hooks/useAxiosCommon";
import LoadingSpinner from "../../components/LoadingSpinner";

import { Link, useSearchParams } from "react-router"; 
import { useState } from "react";
import { FaCalendarDay, FaFilter, FaSearch, FaSort } from "react-icons/fa";

const EventCard = ({ event }) => (
    <Link to={`/events/${event._id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
        <div className="card-body p-6">
            <div className="flex justify-between items-start">
                <h2 className="card-title text-2xl text-clubsphere-primary line-clamp-2">
                    {event.title}
                </h2>
                <div className="badge badge-lg bg-clubsphere-accent text-white ml-4">
                    {event.isPaid ? `$${event.eventFee}` : 'FREE'}
                </div>
            </div>
            
            <p className="text-sm font-semibold text-gray-700 mt-2 flex items-center gap-2">
                <FaCalendarDay /> 
                {new Date(event.eventDate).toLocaleDateString()} at {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            
            <p className="text-gray-500 line-clamp-3 mt-2">{event.description}</p>
            
  
            <div className="mt-4 text-sm">
                <p className="font-bold">Club: <span className="text-clubsphere-accent">{event.clubName}</span></p>
                <p className="text-xs text-gray-400">Location: {event.location}</p>
            </div>
            
            <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm bg-clubsphere-primary text-white hover:bg-clubsphere-accent">Register Now</button>
            </div>
        </div>
    </Link>
);

const EventCategories = ['Photography', 'Sports', 'Tech', 'Book', 'Hiking', 'Other']; // Matches Club categories

const Events = () => {
    const axiosCommon = useAxiosCommon();
    const [searchParams, setSearchParams] = useSearchParams();
    

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const sortField = searchParams.get('sortField') || 'eventDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc'; 
    
    const [searchInput, setSearchInput] = useState(search);


    const { data: events = [], isLoading, error } = useQuery({
        queryKey: ['events', search, category, sortField, sortOrder],
        queryFn: async () => {
            const params = new URLSearchParams({ 
                search, 
                category, 
                sortField, 
                sortOrder 
            });
            const res = await axiosCommon.get(`/events?${params.toString()}`);
            return res.data;
        },
        staleTime: 1000 * 30,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        newParams.set('search', searchInput);
        setSearchParams(newParams);
    };

    const handleFilterChange = (field, value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(field, value);

        if (field === 'sortField' && !newParams.get('sortOrder')) newParams.set('sortOrder', 'asc');
        if (field === 'sortOrder' && !newParams.get('sortField')) newParams.set('sortField', 'eventDate');
        
        setSearchParams(newParams);
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-error py-20">Error loading events: {error.message}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Helmet><title>Upcoming Events | ClubSphere</title></Helmet>

            <h1 className="text-5xl font-extrabold text-clubsphere-primary text-center mb-10">
                Upcoming Club Events
            </h1>

         
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    
                    <form onSubmit={handleSearch} className="md:col-span-1">
                        <label className="label font-semibold">Search by Event Title</label>
                        <div className="join w-full">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="e.g., Night Hike, Photo Basics"
                                className="input input-bordered join-item w-full"
                            />
                            <button className="btn bg-clubsphere-primary text-white join-item hover:bg-clubsphere-accent">
                                <FaSearch />
                            </button>
                        </div>
                    </form>

                    
                    <div className="md:col-span-1">
                        <label className="label font-semibold flex items-center gap-2"><FaFilter /> Filter by Club Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="All">All Categories</option>
                            {EventCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

               
                    <div className="md:col-span-1">
                        <label className="label font-semibold flex items-center gap-2"><FaSort /> Sort By</label>
                        <div className="flex gap-2">
                            <select 
                                value={sortField} 
                                onChange={(e) => handleFilterChange('sortField', e.target.value)}
                                className="select select-bordered w-1/2"
                            >
                                <option value="eventDate">Date</option>
                                <option value="createdAt">Date Created</option>
                            </select>
                            <select 
                                value={sortOrder} 
                                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                className="select select-bordered w-1/2"
                            >
                                <option value="asc">{sortField === 'eventDate' ? 'Soonest First' : 'Oldest First'}</option>
                                <option value="desc">{sortField === 'eventDate' ? 'Latest First' : 'Newest First'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.length > 0 ? (
                    events.map(event => <EventCard key={event._id} event={event} />)
                ) : (
                    <div className="md:col-span-3 text-center py-10">
                        <p className="text-xl text-gray-500">
                            No upcoming events found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
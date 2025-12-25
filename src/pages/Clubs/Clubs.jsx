import { Helmet } from "react-helmet-async";
import { useQuery } from '@tanstack/react-query';
import useAxiosCommon from "../../hooks/useAxiosCommon";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link, useSearchParams } from "react-router";
import { useState } from "react";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const ClubCard = ({ club }) => (
    <Link to={`/clubs/${club._id}`} className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <figure className="h-48 overflow-hidden">
            <img src={club.bannerImage} alt={club.clubName} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
        </figure>
        <div className="card-body p-6">
            <h2 className="card-title text-2xl text-blue-900 line-clamp-1">
                {club.clubName}
                <div className="badge badge-secondary badge-outline">{club.category}</div>
            </h2>
            <p className="text-gray-600 line-clamp-3 text-sm">{club.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className="font-bold text-lg text-blue-600">
                    {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">{club.location}</span>
            </div>
            <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-primary">View Details</button>
            </div>
        </div>
    </Link>
);

const ClubCategories = ['Photography', 'Sports', 'Tech', 'Book', 'Hiking', 'Other'];

const Clubs = () => {
    const axiosCommon = useAxiosCommon();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const [searchInput, setSearchInput] = useState(search);

    const { data: clubs = [], isLoading, error } = useQuery({
        queryKey: ['clubs', search, category, sortField, sortOrder],
        queryFn: async () => {
            const params = new URLSearchParams({ 
                search, 
                category: category === 'All' ? '' : category, 
                sortField, 
                sortOrder 
            });
            const res = await axiosCommon.get(`/clubs?${params.toString()}`);
            return res.data;
        }
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
        setSearchParams(newParams);
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-500 py-20">Error: {error.message}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <Helmet>
                <title>Explore Clubs | ClubSphere</title>
            </Helmet>

            <h1 className="text-4xl font-black text-center mb-10 text-blue-900 uppercase">
                Discover Your Community
            </h1>

            {/* Controls */}
            <div className="bg-slate-50 p-6 rounded-2xl shadow-sm mb-12 border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Search */}
                    <form onSubmit={handleSearch}>
                        <label className="label text-xs font-bold uppercase text-slate-500">Search</label>
                        <div className="join w-full">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Club name..."
                                className="input input-bordered join-item w-full"
                            />
                            <button className="btn btn-primary join-item"><FaSearch /></button>
                        </div>
                    </form>

                    {/* Filter */}
                    <div>
                        <label className="label text-xs font-bold uppercase text-slate-500">Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="All">All Categories</option>
                            {ClubCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="label text-xs font-bold uppercase text-slate-500">Sort By Fee</label>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => {
                                handleFilterChange('sortField', 'membershipFee');
                                handleFilterChange('sortOrder', e.target.value);
                            }}
                            className="select select-bordered w-full"
                        >
                            <option value="desc">Highest Fee</option>
                            <option value="asc">Lowest Fee</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.length > 0 ? (
                    clubs.map(club => <ClubCard key={club._id} club={club} />)
                ) : (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-box border-2 border-dashed">
                        <p className="text-slate-400 font-medium">No clubs found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clubs;
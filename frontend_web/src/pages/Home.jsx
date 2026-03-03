import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, TrendingUp, AlertCircle, Clock, Zap } from 'lucide-react';

export default function Home() {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchLots = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/parking/lots');
            setLots(data);
        } catch (err) {
            console.error("Failed to fetch parking lots", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLots();
        const interval = setInterval(fetchLots, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#f8fafc]">
            <div className="animate-pulse flex flex-col items-center">
                <MapPin size={48} className="text-brand mb-4 opacity-50" />
                <p className="text-gray-500 font-medium tracking-wide">Finding nearby parking...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden pb-20">

            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-full max-w-lg h-96 bg-brand/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none"></div>
            <div className="absolute bottom-10 left-0 w-full max-w-md h-80 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4 z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-fade-in">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
                    <div>
                        <span className="bg-brand/10 text-brand text-sm font-bold px-3 py-1 rounded-full border border-brand/20 mb-3 inline-block">LIVE AVAILABILITY</span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">Find Perfect Parking</h1>
                        <p className="text-gray-500 mt-2 text-lg max-w-xl">Real-time occupancy and dynamic pricing, directly to your fingertips.</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 text-white bg-gray-900 border border-black hover:bg-black px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-gray-900/20 transform hover:-translate-y-0.5">
                        <Navigation size={18} />
                        Use My Location
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lots.map((lot, idx) => (
                        <div key={lot.id} className="group relative bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-brand/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col" style={{ animationDelay: `${idx * 100}ms` }}>

                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="p-7 flex-1">
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{lot.name}</h3>
                                        <div className="flex items-center text-sm font-medium text-gray-500 mt-1 gap-1.5">
                                            <MapPin size={15} className="text-gray-400" />
                                            {lot.location}
                                        </div>
                                    </div>
                                    {lot.is_surge && (
                                        <span className="bg-red-50 flex items-center gap-1.5 text-red-600 px-3 py-1.5 rounded-full text-xs font-black border border-red-100 shadow-sm animate-pulse">
                                            <TrendingUp size={14} /> SURGE
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Available Slots</p>
                                        <p className="text-4xl font-black text-gray-900">
                                            {lot.available_slots} <span className="text-sm font-semibold text-gray-400">/ {lot.total_slots}</span>
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-2xl border flex flex-col justify-center ${lot.is_surge ? 'bg-red-50/50 border-red-100' : 'bg-brand/5 border-brand/10'}`}>
                                        <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${lot.is_surge ? 'text-red-500' : 'text-brand'}`}>Live Price</p>
                                        <p className="text-4xl font-black text-gray-900 flex items-end">
                                            <span className="text-xl mb-1 mr-0.5 opacity-80">₹</span>{lot.current_price} <span className="text-sm font-semibold text-gray-500 ml-1 mb-1.5">/hr</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-7 pb-7 pt-2">
                                {lot.available_slots > 0 ? (
                                    <button
                                        onClick={() => navigate(`/book/${lot.id}`)}
                                        className="w-full relative overflow-hidden group/btn bg-brand text-white text-lg font-bold py-4 rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-brand/30 hover:shadow-brand/50 transition-all transform hover:-translate-y-0.5"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand to-brand-dark opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                        <span className="relative flex items-center gap-2"><Clock size={20} /> Reserve Slot</span>
                                    </button>
                                ) : (
                                    <button disabled className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 cursor-not-allowed border border-dashed border-gray-200">
                                        <AlertCircle size={20} /> Lot Reached Capacity
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {lots.length === 0 && !loading && (
                    <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 mt-10">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-900 text-xl font-bold text-center">No lots available yet.</p>
                        <p className="text-gray-500 text-center mt-2 max-w-sm mx-auto">We couldn't find any parking facilities configured in your current area.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

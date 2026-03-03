import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, TrendingUp, AlertCircle, Clock, Zap, ArrowLeft, ArrowRight, Loader2, Compass } from 'lucide-react';

export default function CurrentLocationFlow() {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState(null);
    const [userCoords, setUserCoords] = useState(null);
    const navigate = useNavigate();

    // Coimbatore Coordinates for Distance Calculation Simulation
    const MOCK_LOTS = [
        { id: 1, name: "Alpha Grand Hub", location: "Peelamedu", current_price: 40, available_slots: 12, total_slots: 50, is_surge: false, lat: 11.0268, lng: 76.9958 },
        { id: 2, name: "Skyline Plaza", location: "RS Puram", current_price: 60, available_slots: 5, total_slots: 30, is_surge: true, lat: 11.0116, lng: 76.9458 },
        { id: 3, name: "Metro Terminal", location: "Gandhipuram", current_price: 35, available_slots: 24, total_slots: 100, is_surge: false, lat: 11.0232, lng: 76.9658 },
        { id: 4, name: "Elite Square", location: "Race Course", current_price: 80, available_slots: 0, total_slots: 20, is_surge: true, lat: 11.0068, lng: 76.9658 },
        { id: 5, name: "Central Station Park", location: "Central", current_price: 30, available_slots: 15, total_slots: 50, is_surge: false, lat: 11.0003, lng: 76.9637 }
    ];

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const fetchAndFilterLots = async (coords) => {
        setLoading(true);
        try {
            let fetchedLots = [];
            try {
                const { data } = await axios.get('http://localhost:5000/api/parking/lots');
                fetchedLots = (data && data.length > 0) ? data : MOCK_LOTS;
            } catch (err) {
                fetchedLots = MOCK_LOTS;
            }

            // Calculate distance and sort
            const withDistance = fetchedLots.map(lot => ({
                ...lot,
                distance: coords ? calculateDistance(coords.latitude, coords.longitude, lot.lat, lot.lng) : Math.random() * 5
            }));

            const sorted = withDistance
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 3); // Top 3 Nearest

            setLots(sorted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords(position.coords);
                    fetchAndFilterLots(position.coords);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setLocationError("Permission Denied. Using simulated location.");
                    fetchAndFilterLots(null);
                }
            );
        } else {
            setLocationError("Geolocation not supported.");
            fetchAndFilterLots(null);
        }
    }, []);

    const handleSelect = (lot) => {
        // PER USER REQUEST: Ask for time and duration before payment
        navigate('/time-selection', {
            state: {
                lot: lot
            }
        });
    };

    if (loading) return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-black">
            <div className="flex flex-col items-center">
                <div className="relative mb-8">
                    <Loader2 size={64} className="text-brand animate-spin opacity-50" />
                    <Compass size={32} className="text-brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-white font-black uppercase tracking-[0.3em] italic animate-pulse">Syncing Neural Location...</p>
                <p className="text-gray-500 text-[10px] mt-2 font-bold uppercase tracking-widest italic">{locationError || 'Accessing Global GPS Network'}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-black relative overflow-hidden pb-20">

            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full mix-blend-screen filter blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-xl mx-auto px-4 py-10 relative z-10 animate-fade-in">

                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate('/')}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-brand transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-right">
                        <span className="text-brand text-[8px] font-black uppercase tracking-[0.4em] italic mb-1 block">Geo-Pulse Active</span>
                        <h1 className="text-3xl font-black text-white tracking-tightest uppercase italic">Top 3 Nearest</h1>
                    </div>
                </div>

                <div className="space-y-6">
                    {lots.map((lot, idx) => (
                        <div
                            key={lot.id}
                            onClick={() => lot.available_slots > 0 && handleSelect(lot)}
                            className={`group relative p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden ${lot.available_slots > 0
                                ? 'bg-white/5 border-white/10 hover:border-brand/50 hover:bg-white/10'
                                : 'bg-white/2 opacity-50 border-white/5 grayscale pointer-events-none'
                                }`}
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {/* Proximity Badge */}
                            <div className="absolute top-0 right-0 bg-brand text-white text-[8px] font-black px-4 py-1.5 rounded-bl-[1.5rem] uppercase tracking-widest italic">
                                {lot.distance ? `${lot.distance.toFixed(1)} km Away` : 'Nearby'}
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-brand transition-colors">{lot.name}</h3>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic mt-1">{lot.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white italic tracking-tighter leading-none">₹{lot.current_price}</p>
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">Per Hour</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={12} className="text-brand" fill="currentColor" />
                                        <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">{lot.available_slots} Free</span>
                                    </div>
                                    {lot.is_surge && (
                                        <div className="flex items-center gap-1.5 text-red-500">
                                            <TrendingUp size={12} />
                                            <span className="text-[9px] font-black uppercase italic tracking-widest">Surge</span>
                                        </div>
                                    )}
                                </div>
                                <ArrowRight className="text-brand group-hover:translate-x-2 transition-transform" size={20} />
                            </div>

                            {/* Decorative Grid Mesh */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        </div>
                    ))}
                </div>

                {lots.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-white font-black uppercase italic tracking-widest">No Active Nodes</p>
                        <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest leading-relaxed px-10">We couldn't detect any compatible parking infrastructure in this sector.</p>
                    </div>
                )}

                <div className="mt-12 p-8 bg-brand/5 border border-brand/20 rounded-[2.5rem] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center text-white shadow-lg shadow-brand/40">
                        <Navigation size={24} />
                    </div>
                    <div>
                        <p className="text-white font-black text-sm uppercase italic tracking-tight">Neural Mapping Active</p>
                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest italic leading-none mt-1">Ready for transition to Payment Portal</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

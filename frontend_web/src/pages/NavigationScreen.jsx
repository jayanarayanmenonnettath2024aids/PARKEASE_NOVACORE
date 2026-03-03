import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowLeft, ExternalLink } from 'lucide-react';

export default function NavigationScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const slot = location.state?.slot || { location_name: "Mock Site", lat: 11.0168, lng: 76.9558 };

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${slot.lat},${slot.lng}`;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8">
                <header className="flex justify-between items-end">
                    <div>
                        <h2 className="text-[10px] font-black text-brand tracking-[0.5em] mb-3 uppercase italic">Active Route</h2>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Directing to <span className="text-brand">{slot.location_name}</span></h1>
                    </div>
                </header>

                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden relative group">
                    <div className="h-96 md:h-[500px] bg-slate-100 flex items-center justify-center relative">
                        {/* Interactive Placeholder Map */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2033&auto=format&fit=crop')] bg-cover"></div>

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center text-brand animate-pulse">
                                <MapPin size={48} fill="currentColor" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Simulated GPS Context</p>
                        </div>
                    </div>

                    <div className="p-10 border-t border-gray-50 bg-white flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                                <Navigation size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target Coordinates</p>
                                <p className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">{slot.lat}, {slot.lng}</p>
                            </div>
                        </div>

                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto bg-brand text-white font-black uppercase tracking-widest py-5 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all"
                        >
                            Open in Google Maps
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </div>

                <div className="pt-8 w-full">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 text-white font-black uppercase tracking-[0.2em] py-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-95 transition-all text-xl"
                    >
                        Arrived? End Trip
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition-colors py-2"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

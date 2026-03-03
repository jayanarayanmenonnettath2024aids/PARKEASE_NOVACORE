import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';

export default function Home() {
    const navigate = useNavigate();

    const options = [
        {
            id: 'nearby',
            title: "Find Parking Near Me",
            description: "Detect nearby parking using AI & CV status integration.",
            path: '/nearby',
            color: 'from-brand to-brand-dark'
        },
        {
            id: 'slot',
            title: "Slot Based Booking",
            description: "Book regional parking slots in advance with dynamic pricing.",
            path: '/book-advance',
            color: 'from-slate-700 to-slate-900'
        }
    ];

    return (
        <div className="relative min-h-[calc(100vh-80px)] flex overflow-hidden">
            {/* Background Layer with Split Aesthetic */}
            <div className="absolute inset-0 z-0 flex">
                <div className="hidden lg:block w-1/3 bg-slate-900"></div>
                <div className="w-full lg:w-2/3 relative">
                    <img
                        src={heroBg}
                        alt="Background"
                        className="w-full h-full object-cover grayscale-[0.1] brightness-90 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-20 pt-12 pb-40">
                <header className="mb-12 max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-8 bg-brand"></div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand italic">Service Matrix v5.2</h2>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tightest uppercase italic leading-[0.9]">
                        SELECT YOUR <br />
                        <span className="text-brand">PARKING FLOW</span>
                    </h1>
                    <p className="mt-6 text-slate-400 font-bold max-w-md leading-relaxed italic">
                        Access our neural-sync parking ecosystem. Choose between instant detection or guaranteed regional slot booking.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => navigate(option.path)}
                            className="group relative bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 text-left overflow-hidden"
                        >
                            <div className="relative z-10 space-y-6">
                                <div className={`w-14 h-14 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/40`}>
                                    {option.id === 'nearby' ? <MapPin size={28} /> : <Calendar size={28} />}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-tight">
                                        {option.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm font-bold mt-3 leading-relaxed italic">
                                        {option.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-[0.2em] pt-2">
                                    Initiate Prototype
                                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Status Decor */}
            <div className="absolute bottom-12 left-8 md:left-20 z-10">
                <div className="flex items-center gap-12">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] leading-tight mb-2 italic">System Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                            <span className="text-sm font-black text-emerald-500 uppercase italic tracking-tighter">All Nodes Active</span>
                        </div>
                    </div>

                    <div className="h-10 w-[1px] bg-white/5 mx-2"></div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] leading-tight mb-2 italic">Sync Protocol</span>
                        <span className="text-sm font-black text-white uppercase italic tracking-tighter">Hyper-Threaded</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

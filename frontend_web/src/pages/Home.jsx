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
                <header className="mb-12 max-w-xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tightest uppercase italic leading-[0.9]">
                        SELECT YOUR <br />
                        <span className="text-brand">PARKING FLOW</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => navigate(option.path)}
                            className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-xl transition-all duration-500 hover:border-brand/40 text-left overflow-hidden w-full max-w-sm mx-auto flex"
                        >
                            {/* Accent Background Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/5 rounded-full filter blur-3xl group-hover:bg-brand/10 transition-all duration-700"></div>

                            <div className="relative z-10 flex flex-col justify-between h-full w-full">
                                <div className="space-y-6">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${option.color === 'from-slate-700 to-slate-900' ? 'from-brand to-brand-dark' : option.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform duration-500`}>
                                        {option.id === 'nearby' ? <MapPin size={24} /> : <Calendar size={24} />}
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic leading-tight group-hover:text-brand transition-colors">
                                            {option.title}
                                        </h3>
                                        <p className="text-slate-500 text-[11px] font-bold mt-2 leading-relaxed italic">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-brand font-black text-[10px] uppercase tracking-[0.3em] pt-10 group-hover:translate-x-2 transition-transform">
                                    CLICK TO START
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

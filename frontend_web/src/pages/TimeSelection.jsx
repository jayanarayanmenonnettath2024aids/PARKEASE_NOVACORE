import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ArrowLeft, Timer, MapPin, Zap } from 'lucide-react';

export default function TimeSelection() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get lot from state, with fallback for development
    const lot = location.state?.lot || {
        name: "Mock Plaza",
        current_price: 50,
        address: "Avinashi Road, Coimbatore"
    };

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('12:00');
    const [duration, setDuration] = useState(1);

    const pricePerHour = lot.current_price || 50;
    const total = duration * pricePerHour;

    const handleProceed = () => {
        navigate('/payment', {
            state: {
                slot: {
                    ...lot,
                    location_name: lot.name,
                    price: pricePerHour
                },
                duration: duration,
                bookingDate: date,
                bookingTime: time
            }
        });
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8 animate-fade-in py-10">

                {/* Header Section */}
                <header className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-4 bg-white rounded-2xl shadow-xl shadow-gray-200/50 hover:scale-110 active:scale-90 transition-all border border-gray-100"
                    >
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <div>
                        <h2 className="text-[10px] font-black text-brand tracking-[0.5em] mb-1 uppercase italic">Step 02</h2>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Time <span className="text-brand">Allocation</span></h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Left Side: Summary Card */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand/20 rounded-lg text-brand">
                                        <MapPin size={16} fill="currentColor" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Hub</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight">{lot.name}</h3>
                                    <p className="text-slate-400 text-xs font-medium mt-1 truncate">{lot.address || 'Premium Parking Zone'}</p>
                                </div>

                                <div className="pt-6 border-t border-slate-800 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Base Rate</p>
                                        <p className="text-2xl font-black text-brand italic">₹{pricePerHour}<span className="text-xs text-slate-500 ml-1">/hr</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                                        <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-1 rounded-full border border-emerald-500/20 uppercase">Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-center">Estimation Summary</p>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="text-slate-900">{duration} Hrs</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-400">Tax (0%)</span>
                                    <span className="text-slate-900">₹0</span>
                                </div>
                                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Grand Total</span>
                                    <span className="text-2xl font-black text-brand italic">₹{total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Inputs */}
                    <div className="md:col-span-3 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl space-y-10">
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                                    <Calendar size={14} className="text-brand" />
                                    Arrival Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-16 px-8 bg-slate-50 rounded-[1.5rem] font-bold text-slate-900 outline-none border-2 border-transparent focus:border-brand/30 focus:bg-white transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                                    <Clock size={14} className="text-brand" />
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full h-16 px-8 bg-slate-50 rounded-[1.5rem] font-bold text-slate-900 outline-none border-2 border-transparent focus:border-brand/30 focus:bg-white transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="flex justify-between items-center px-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                        <Timer size={14} className="text-brand" />
                                        Duration Impact
                                    </label>
                                    <span className="text-2xl font-black text-brand italic">{duration} hours</span>
                                </div>
                                <div className="relative h-4 flex items-center">
                                    <input
                                        type="range"
                                        min="1"
                                        max="24"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand"
                                    />
                                </div>
                                <div className="flex justify-between px-1 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                                    <span>Quick Stop</span>
                                    <span>Overnight</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleProceed}
                            className="w-full group relative overflow-hidden bg-brand text-white font-black uppercase tracking-[0.2em] py-8 rounded-[2rem] shadow-2xl shadow-brand/30 hover:scale-[1.02] active:scale-95 transition-all text-lg"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                Proceed to Payment
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic opacity-50">
                    Neural-Sync Booking Engine v4.0 • Encrypted Response
                </p>
            </div>
        </div>
    );
}

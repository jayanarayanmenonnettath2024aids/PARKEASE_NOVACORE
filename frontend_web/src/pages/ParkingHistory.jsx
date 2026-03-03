import React from 'react';
import { History, Calendar, Clock, MapPin, Receipt, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_HISTORY = [
    {
        id: "PK-882341",
        location: "Phoenix Marketcity",
        date: "2026-03-01",
        time: "14:30",
        duration: "3 Hours",
        amount: 150,
        status: "Completed"
    },
    {
        id: "PK-771209",
        location: "Brookefields Mall",
        date: "2026-02-28",
        time: "10:15",
        duration: "1 Hour",
        amount: 50,
        status: "Completed"
    },
    {
        id: "PK-112093",
        location: "Tidel Park",
        date: "2026-02-25",
        time: "09:00",
        duration: "9 Hours",
        amount: 450,
        status: "Completed"
    }
];

export default function ParkingHistory() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8 animate-fade-in py-10">

                <header className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-4 bg-white rounded-2xl shadow-xl shadow-gray-200/50 hover:scale-110 active:scale-90 transition-all border border-gray-100"
                    >
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <div>
                        <h2 className="text-[10px] font-black text-brand tracking-[0.5em] mb-1 uppercase italic">Archive</h2>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Parking <span className="text-brand">History</span></h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {MOCK_HISTORY.map((item, index) => (
                        <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

                            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest rounded-full border border-brand/20">
                                            {item.id}
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                                            {item.status}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{item.location}</h3>
                                        <div className="flex items-center gap-2 text-slate-400 mt-1">
                                            <MapPin size={14} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Premium Parking Zone</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Calendar size={12} className="text-brand" /> Date
                                        </p>
                                        <p className="font-bold text-gray-900">{item.date}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Clock size={12} className="text-brand" /> Time
                                        </p>
                                        <p className="font-bold text-gray-900">{item.time} ({item.duration})</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Receipt size={12} className="text-brand" /> Amount
                                        </p>
                                        <p className="text-xl font-black text-brand italic">₹{item.amount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-10 flex justify-center">
                    <button className="text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition-colors flex items-center gap-2">
                        Load Older Archives <History size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

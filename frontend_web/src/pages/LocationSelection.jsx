import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronDown, Search, ArrowLeft } from 'lucide-react';

export default function LocationSelection() {
    const navigate = useNavigate();
    const [selection, setSelection] = useState({ state: '', city: '', area: '' });

    const locations = {
        states: ['Tamil Nadu', 'Karnataka', 'Kerala'],
        cities: ['Coimbatore', 'Chennai', 'Bangalore', 'Kochi'],
        areas: ['Eachanari', 'RS Puram', 'Gandhipuram', 'Peelamedu']
    };

    const handleContinue = () => {
        if (selection.state && selection.city && selection.area) {
            navigate('/time-selection', { state: { selection } });
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 flex flex-col items-center justify-center">
            <div className="max-w-xl w-full space-y-8 animate-fade-in">
                <header className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-3 bg-white rounded-2xl shadow-sm"><ArrowLeft size={20} /></button>
                    <div>
                        <h2 className="text-[10px] font-black text-brand tracking-[0.4em] mb-1 uppercase italic">Step 01</h2>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Select <span className="text-brand">Territory</span></h1>
                    </div>
                </header>

                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl space-y-8">
                    <div className="space-y-6">
                        {['state', 'city', 'area'].map((level) => (
                            <div key={level} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 italic">{level}</label>
                                <div className="relative group">
                                    <select
                                        value={selection[level]}
                                        onChange={(e) => setSelection({ ...selection, [level]: e.target.value })}
                                        className="w-full h-16 pl-6 pr-12 bg-slate-50 border-2 border-transparent focus:border-brand/20 outline-none rounded-2xl text-slate-900 font-bold appearance-none transition-all cursor-pointer"
                                    >
                                        <option value="">Select {level.charAt(0).toUpperCase() + level.slice(1)}</option>
                                        {locations[level === 'city' ? 'cities' : level + 's'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={!selection.area}
                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform ${selection.area ? 'bg-brand text-white shadow-xl shadow-brand/30 hover:-translate-y-1' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        Review Availability
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

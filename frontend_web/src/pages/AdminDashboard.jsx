import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Settings, BarChart, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [lots, setLots] = useState([]);
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLots = async () => {
            try {
                const { data } = await axios.get('http://127.0.0.1:5000/api/parking/lots');
                setLots(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLots();
    }, []);

    // Simple RBAC
    if (user?.role !== 'admin' && user?.role !== 'owner') {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col">
                <Settings size={48} className="text-red-400 mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-gray-700">Access Denied</h2>
                <p className="text-gray-500">You must be an administrator to view this page.</p>
            </div>
        );
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading admin data...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Settings className="text-brand" size={28} /> Admin Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Manage parking lots and monitor live revenue.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold flex flex-col justify-center">
                        <span className="text-xs text-gray-500 uppercase flex items-center gap-1"><Users size={12} /> Active Users</span>
                        <span className="text-xl text-gray-900">142</span>
                    </div>
                    <div className="bg-brand-light border border-brand/20 px-4 py-2.5 rounded-xl font-bold flex flex-col justify-center">
                        <span className="text-xs text-brand-dark uppercase flex items-center gap-1"><TrendingUp size={12} /> Today's Revenue</span>
                        <span className="text-xl text-brand-dark">₹14,500</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {lots.map(lot => {
                    const occupancy = lot.total_slots - lot.available_slots;
                    const occPercent = Math.round((occupancy / lot.total_slots) * 100) || 0;
                    return (
                        <div key={lot.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
                            <div className="w-full md:w-auto">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{lot.name}</h3>
                                <p className="text-gray-500 text-sm flex items-center gap-4">
                                    <span>Base: <strong className="text-gray-700">₹{lot.base_price}/hr</strong></span>
                                    {lot.is_surge && (
                                        <span className="text-red-500 font-medium">Surge: ₹{lot.current_price}/hr</span>
                                    )}
                                </p>
                            </div>

                            <div className="flex w-full md:w-auto items-center gap-6 justify-between md:justify-end">
                                <div className="flex-1 max-w-[150px] min-w-[150px]">
                                    <div className="flex justify-between text-xs mb-1 font-bold">
                                        <span className="text-gray-500">Occupancy</span>
                                        <span className={occPercent > 80 ? 'text-red-500' : 'text-brand'}>{occPercent}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div className={`h-full rounded-full ${occPercent > 80 ? 'bg-red-400' : 'bg-brand'}`} style={{ width: `${occPercent}%` }}></div>
                                    </div>
                                </div>

                                <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 min-w-[100px]">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Slots</p>
                                    <p className="text-lg font-black text-gray-900">{occupancy} / {lot.total_slots}</p>
                                </div>

                                <button className="btn-outline py-2 border-gray-300 text-gray-700 hover:bg-gray-50">Edit Lot</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

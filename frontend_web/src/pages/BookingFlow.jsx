import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CreditCard, ChevronLeft, MapPin, Zap, AlertCircle } from 'lucide-react';

export default function BookingFlow() {
    const { lotId } = useParams();
    const [data, setData] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reserving, setReserving] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

    // Real Data Only

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/parking/lots/${lotId}/slots`);
                setData(response.data);
            } catch (err) {
                console.error("Failed to fetch slots, using mock data", err);
                setData(null);
                setError('Backend not connected - unable to load live slots.');
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
        const interval = setInterval(fetchSlots, 10000);
        return () => clearInterval(interval);
    }, [lotId]);

    const handleReserve = async () => {
        if (!selectedSlot) return;
        setReserving(true);
        setError('');

        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/api/booking/reserve',
                { slot_id: selectedSlot.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Trigger Dummy Payment Success UI
            setPaymentSuccess(true);
            setTimeout(() => {
                navigate('/', { state: { msg: 'Booking confirmed!' } });
            }, 3500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to reserve slot. It may have been taken just now.');
            const response = await axios.get(`http://127.0.0.1:5000/api/parking/lots/${lotId}/slots`);
            setData(response.data);
            setSelectedSlot(null);
        } finally {
            setReserving(false);
        }
    };

    if (loading) return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <MapPin size={48} className="text-brand mb-4 opacity-50" />
                <p className="text-gray-500 font-medium tracking-wide">Loading layout...</p>
            </div>
        </div>
    );

    if (!data) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-xl m-10">{error}</div>;

    if (paymentSuccess) return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-black overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
            <div className="relative z-10 flex flex-col items-center animate-fade-in text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)] transform animate-bounce">
                    <ShieldCheck size={48} />
                </div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Dummy Payment Successful!</h2>
                <p className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-8">Slot Reserved • ₹50 Token Paid</p>
                <div className="flex items-center gap-3 text-brand">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Routing to Dashboard...</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 relative overflow-hidden pb-20">
            {/* Decorative background styling */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

            <div className="max-w-5xl mx-auto px-4 py-10 relative z-10 animate-fade-in">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-bold bg-white px-4 py-2 rounded-full shadow-sm shadow-gray-200/50 w-fit"
                >
                    <ChevronLeft size={20} /> Back to Lots
                </button>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white overflow-hidden">

                    <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white pt-8 pb-6 px-10">
                        <h1 className="text-3xl font-black text-gray-900">{data.lot_name}</h1>
                        <p className="flex items-center gap-1.5 text-brand font-medium mt-2 text-sm">
                            <MapPin size={16} /> Select a parking slot to reserve
                        </p>
                    </div>

                    <div className="p-10">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm animate-shake">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <div className="mb-10 lg:flex gap-10">
                            <div className="flex-1 mb-8 lg:mb-0">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Live Slot Layout</h3>
                                    <div className="flex gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-300"></div> Free</div>
                                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-red-100 border-2 border-red-300 relative"><div className="absolute inset-0 m-auto w-1 h-1 bg-red-400 rounded-full"></div></div> Taken</div>
                                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-brand shadow-sm shadow-brand/50"></div> Yours</div>
                                    </div>
                                </div>

                                <div className="bg-gray-100/50 p-10 rounded-3xl border border-gray-200 relative overflow-hidden">

                                    {/* The grid of slots */}
                                    <div className="flex flex-wrap gap-5 justify-center max-w-lg mx-auto relative z-10">
                                        {data.slots.map(slot => {
                                            const isAvailable = slot.status === 'available';
                                            const isSelected = selectedSlot?.id === slot.id;

                                            return (
                                                <button
                                                    key={slot.id}
                                                    disabled={!isAvailable}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`
                            w-20 h-28 rounded-2xl flex flex-col items-center justify-center font-black text-lg transition-all duration-300 relative
                            ${isSelected ? 'bg-brand border-2 border-brand text-white shadow-xl shadow-brand/40 transform -translate-y-2 scale-105' : ''}
                            ${isAvailable && !isSelected ? 'bg-white border-2 border-gray-200 text-gray-600 hover:border-brand/40 hover:bg-brand/5 shadow-sm' : ''}
                            ${!isAvailable ? 'bg-red-50/50 border-2 border-red-100/50 text-red-300 cursor-not-allowed transform scale-95' : ''}
                          `}
                                                >
                                                    <span className={`${isSelected ? 'text-white' : ''} relative z-10`}>{slot.slot_number}</span>
                                                    {!isAvailable && (
                                                        <div className="absolute inset-x-2 inset-y-2 rounded-xl bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(239,68,68,0.1)_5px,rgba(239,68,68,0.1)_10px)] pointer-events-none"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Aesthetic road overlay */}
                                    <div className="w-full h-12 bg-gray-300/50 mt-12 flex items-center justify-center rounded-xl text-xs font-black text-gray-400 uppercase tracking-[0.3em] relative">
                                        <div className="absolute inset-0 flex items-center justify-center gap-8">
                                            <div className="h-1 w-16 bg-white/40 rounded-full"></div>
                                            <div className="h-1 w-16 bg-white/40 rounded-full"></div>
                                            <div className="h-1 w-16 bg-white/40 rounded-full"></div>
                                        </div>
                                        Entrance Path
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Panel */}
                            <div className="w-full lg:w-96 flex flex-col justify-end">
                                <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>

                                    <h3 className="font-bold text-white text-xl flex items-center gap-3 mb-6">
                                        <ShieldCheck size={24} className="text-brand" />
                                        Reservation Details
                                    </h3>

                                    {selectedSlot ? (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-4">
                                                <span>Selected Slot</span>
                                                <span className="text-lg font-black text-white px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    {selectedSlot.slot_number}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-gray-300">
                                                <span>Token Amount</span>
                                                <span className="text-3xl font-black text-brand">₹50</span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                                                This token amount reserves the slot for <strong className="text-white">15 minutes</strong>. If you do not arrive, this token is non-refundable.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-gray-500 font-medium flex flex-col items-center gap-3 border border-dashed border-gray-700 rounded-2xl">
                                            <Zap size={24} className="opacity-50" />
                                            Please select an available slot
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <button
                                            onClick={handleReserve}
                                            disabled={!selectedSlot || reserving}
                                            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-sm transition-all duration-300 ${selectedSlot && !reserving
                                                ? 'bg-brand text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transform hover:-translate-y-1'
                                                : 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'
                                                }`}
                                        >
                                            {reserving ? (
                                                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <>
                                                    <CreditCard size={20} />
                                                    Pay ₹50 Token
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

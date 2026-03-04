import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ShieldCheck, ArrowLeft, Info, CheckCircle2, Lock,
    Smartphone, CreditCard, Landmark, Wallet, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Data recovery
    const slot = location.state?.lot || location.state?.slot || { name: "Central Station Park", current_price: 30 };
    const duration = location.state?.duration || 1;
    const price = slot.current_price || slot.price || 30;
    const total = price * duration;

    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('upi'); // GPay focus defaults to UPI
    const [step, setStep] = useState('details');

    // Handle Payment logic (Razorpay)
    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulated Dummy Payment sequence for the demo
        setTimeout(() => {
            setLoading(false);
            setStep('success'); // Triggers the <SuccessState /> UI

            // After showing success for 1.5s, transition to the next stage (Receipt)
            setTimeout(() => navigateToReceipt("pay_mock_success_593"), 1500);
        }, 1500);
    };

    const navigateToReceipt = (paymentId) => {
        navigate('/receipt', {
            state: {
                slot,
                booking: {
                    id: `PK-${Math.floor(100000 + Math.random() * 900000)}`,
                    location: slot.name,
                    amount: total,
                    paymentId: paymentId
                }
            }
        });
    };

    // Script Loading
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); }
    }, []);

    if (step === 'processing') return <LoadingState />;
    if (step === 'success') return <SuccessState />;

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-4 font-sans text-gray-800">
            {/* GPay Header */}
            <div className="w-full max-w-md flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 border border-white/10 text-white rounded-full transition-colors hover:bg-brand">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white shadow-lg mb-2">
                        <span className="text-2xl font-black">P</span>
                    </div>
                    <h1 className="text-lg font-bold text-white uppercase italic tracking-tight">Paying ParkEase</h1>
                    <p className="text-sm text-slate-400 font-medium">+91 98765 43210</p>
                </div>
                <div className="w-10"></div> {/* Spacer for balance */}
            </div>

            {/* Amount Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100 mb-6 text-center"
            >
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">₹{total}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#1a73e8] rounded-full text-xs font-bold uppercase tracking-wide">
                    <Info size={14} />
                    <span>Slot Reservation Fee</span>
                </div>
            </motion.div>

            {/* Payment Method Selector */}
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="px-8 pt-8 pb-4 border-b border-gray-50">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Payment Method</h3>
                </div>

                <div className="p-4 space-y-2">
                    {[
                        { id: 'upi', name: 'Unified Payments (UPI)', icon: <Smartphone />, sub: 'Google Pay, PhonePe, BHIM' },
                        { id: 'card', name: 'Debit / Credit Card', icon: <CreditCard />, sub: 'Visa, Mastercard, RuPay' },
                        { id: 'net', name: 'Net Banking', icon: <Landmark />, sub: 'All Indian Banks' }
                    ].map(method => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${selectedMethod === method.id
                                ? 'bg-blue-50/50 border-2 border-primary ring-2 ring-primary/10'
                                : 'hover:bg-gray-50 border-2 border-transparent'
                                }`}
                        >
                            <div className={`p-3 rounded-xl ${selectedMethod === method.id ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {React.cloneElement(method.icon, { size: 20 })}
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-sm font-black text-gray-900">{method.name}</p>
                                <p className="text-xs text-gray-400 font-bold">{method.sub}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-[#1a73e8] bg-[#1a73e8]' : 'border-gray-200'}`}>
                                {selectedMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Secure Trust Badge */}
                <div className="bg-gray-50 px-8 py-4 flex items-center justify-center gap-3">
                    <ShieldCheck size={16} className="text-[#34a853]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Payment by Razorpay</span>
                </div>
            </div>

            {/* Bottom Global Button (Fixed-like aesthetic but in flow for mobile) */}
            <div className="w-full max-w-md mt-8">
                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full bg-[#1a73e8] hover:bg-[#185abc] text-white h-16 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        `Pay ₹${total}`
                    )}
                </button>
            </div>

            {/* GPay footer aesthetic */}
            <div className="mt-auto py-8 flex flex-col items-center gap-2 opacity-30">
                <div className="flex gap-4 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-5" />
                </div>
                <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] text-gray-900">
                    <Lock size={10} /> PCI-DSS Certified
                </div>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Contacting Bank</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Encryption Verification in Progress</p>
        </div>
    );
}

function SuccessState() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-32 h-32 bg-[#34a853] rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/30 mb-8"
            >
                <CheckCircle2 size={64} strokeWidth={3} />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Payment Successful</h2>
            <p className="text-[#34a853] font-bold text-xs uppercase tracking-[0.2em]">Transaction Confirmed • Generating Receipt</p>
        </div>
    );
}

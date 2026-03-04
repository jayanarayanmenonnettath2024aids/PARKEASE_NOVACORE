import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, MousePointer2, RefreshCcw } from 'lucide-react';
import LampUI from '../components/LampUI';
import logo from '../assets/image.png';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLampOn, setIsLampOn] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const { data } = await axios.post('http://127.0.0.1:5000/api/auth/recover', { email });
            setMessage(data.msg || 'Recovery details dispatched to your email.');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to initiate recovery. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center min-h-screen transition-colors duration-700 px-4 relative overflow-hidden">

            {/* Ambient Glow */}
            <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_40%,rgba(255,214,110,0.2),transparent_70%)] ${isLampOn ? 'opacity-100' : 'opacity-0'}`}
            />

            <div className="flex flex-col items-center gap-4 z-20 mb-8 md:mb-0">
                <LampUI onToggle={setIsLampOn} />
                {!isLampOn && (
                    <div className="animate-bounce flex flex-col items-center text-brand gap-2">
                        <MousePointer2 size={24} className="rotate-180" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] italic">Pull Rope to Reveal</span>
                    </div>
                )}
            </div>

            <div className={`w-full max-w-md p-8 rounded-[2.5rem] backdrop-blur-2xl border transition-all duration-700 relative z-30 ${isLampOn ? 'opacity-100 translate-y-0 pointer-events-auto bg-white/5 border-white/10 shadow-2xl' : 'opacity-0 translate-y-10 pointer-events-none'}`}>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-brand transition-all active:scale-95"
                >
                    <ArrowLeft size={16} />
                </button>

                <div className="flex flex-col items-center mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={logo} alt="ParkEase Logo" className="h-12 w-auto object-contain" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">PARK<span className="text-brand">EASE</span></h1>
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic text-center">Identity Recovery Portal</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-medium border flex items-center justify-between backdrop-blur-md animate-fade-in uppercase tracking-wider italic ${message.includes('sent') ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 'bg-red-500/20 text-red-200 border-red-500/30'}`}>
                        {message}
                        <button onClick={() => setMessage('')} className="text-white hover:text-brand transition-colors px-2">×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 italic">Registered Email Address</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-brand transition-colors">
                                <Mail size={18} strokeWidth={2} />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-16 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-brand/40 outline-none transition-all"
                                placeholder="Digital Inbox"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-brand text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:bg-brand-dark transform hover:-translate-y-1 transition-all active:scale-95 flex justify-center items-center gap-3"
                    >
                        {loading ? (
                            <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <RefreshCcw size={18} />
                                <span>Request Access Link</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Recall Password?{' '}
                        <Link to="/login" className="text-white hover:text-brand transition-colors ml-1 border-b border-white/10 italic">
                            Back to Portal
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

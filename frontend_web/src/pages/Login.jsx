import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Car, Phone, Lock, MousePointer2 } from 'lucide-react';
import LampUI from '../components/LampUI';
import logo from '../assets/image.png';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLampOn, setIsLampOn] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/api/auth/login', { phone, password });
            login(data.access_token, data.user);
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.msg || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col md:flex-row justify-center items-center min-h-screen transition-colors duration-700 px-4 relative overflow-hidden`}>

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
                <div className="flex flex-col items-center mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={logo} alt="ParkEase Logo" className="h-12 w-auto object-contain" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">PARK<span className="text-brand">EASE</span></h1>
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Secure Portal Access</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/30 flex items-center justify-between backdrop-blur-md animate-fade-in uppercase tracking-wider italic">
                        {error}
                        <button onClick={() => setError('')} className="text-red-300 hover:text-white transition-colors">×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 italic">Phone Number</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-brand transition-colors">
                                <Phone size={18} strokeWidth={2} />
                            </span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-16 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-brand/40 outline-none transition-all"
                                placeholder="Registered Number"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Password</label>
                            <Link to="/forgot-password" name="recover" className="text-[10px] font-black uppercase tracking-widest text-brand hover:text-white transition-colors">Recover?</Link>
                        </div>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-brand transition-colors">
                                <Lock size={18} strokeWidth={2} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-16 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-brand/40 outline-none transition-all"
                                placeholder="Access Key"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-brand text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:bg-brand-dark transform hover:-translate-y-1 transition-all active:scale-95 flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                        ) : "Initiate Login"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Unauthorized User?{' '}
                        <Link to="/register" className="text-white hover:text-brand transition-colors ml-1 border-b border-white/10 italic">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

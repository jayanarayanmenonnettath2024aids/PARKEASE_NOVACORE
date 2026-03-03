import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Car, Phone, Lock } from 'lucide-react';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { phone, password });
            login(data.access_token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0f172a] px-4 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[60%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

            <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] animate-slide-up relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-br from-brand to-purple-600 p-4 rounded-2xl text-white mb-5 shadow-lg shadow-brand/40 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                        <Car size={36} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">ParkEase</h1>
                    <p className="text-gray-300 text-sm mt-2 font-medium tracking-wide">Premium Parking Management</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/30 flex items-center justify-between backdrop-blur-md animate-fade-in">
                        {error}
                        <button onClick={() => setError('')} className="text-red-300 hover:text-white transition-colors">×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand transition-colors">
                                <Phone size={18} strokeWidth={2} />
                            </span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-brand/50 focus:ring-2 focus:ring-brand/50 outline-none transition-all duration-300"
                                placeholder="Ex. 1234567890"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-brand-light hover:text-white transition-colors">Forgot password?</a>
                        </div>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand transition-colors">
                                <Lock size={18} strokeWidth={2} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-brand/50 focus:ring-2 focus:ring-brand/50 outline-none transition-all duration-300"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-gradient-to-r from-brand to-purple-600 hover:from-brand-dark hover:to-purple-700 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : "Sign In to ParkEase"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-white font-bold hover:text-brand-light transition-colors ml-1 border-b border-white/30 hover:border-brand-light pb-0.5">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

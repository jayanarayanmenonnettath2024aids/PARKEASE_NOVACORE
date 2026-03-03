import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Car, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-brand p-2 rounded-lg text-white">
                                <Car size={24} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-dark to-brand">
                                ParkEase
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center border-l pl-6 gap-6">
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <User size={16} />
                            </div>
                            <span className="font-medium">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

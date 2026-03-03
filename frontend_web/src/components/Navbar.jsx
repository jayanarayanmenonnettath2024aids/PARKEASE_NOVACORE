import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StaggeredMenu from './StaggeredMenu';
import logo from '../assets/image.png';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', onClick: () => navigate('/') },
        { label: 'History', onClick: () => navigate('/history') },
        { label: 'Logout', onClick: handleLogout }
    ];

    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'Instagram', link: 'https://instagram.com' },
        { label: 'Support', link: '#' }
    ];

    return (
        <div className="sticky top-0 z-[100]">
            <StaggeredMenu
                user={user}
                onLogout={handleLogout}
                items={navItems}
                socialItems={socialItems}
                logoUrl={logo}
                accentColor="#5227FF"
                displayItemNumbering={true}
            />
        </div>
    );
}

import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/image.png';

export default function Footer() {
    const platformLinks = [
        { name: 'Dashboard', path: '/' },
        { name: 'Find Parking', path: '/nearby' },
        { name: 'Booking History', path: '/history' },
        { name: 'Membership', path: '/membership' }
    ];

    const supportLinks = [
        { name: 'Help Center', path: '/help' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' }
    ];

    return (
        <footer className="bg-black text-white pt-12 pb-8 px-8 border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="flex items-center gap-3 group">
                                <img src={logoImg} alt="ParkEase" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                                <span className="text-xl font-black tracking-tighter uppercase italic text-white leading-none">PARK<span className="text-brand">EASE</span></span>
                            </Link>
                        </div>
                        <p className="text-slate-500 font-bold max-w-xs leading-relaxed italic text-[11px]">
                            Revolutionizing modern urban travel with intelligent, secure, and seamless parking ecosystems.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:bg-brand hover:text-white transition-all active:scale-95 border border-white/5 hover:border-brand/40">
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 italic">Platform</h4>
                        <ul className="space-y-3">
                            {platformLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-400 hover:text-brand font-black text-xs uppercase italic transition-colors tracking-tight">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 italic">Support</h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-400 hover:text-brand font-black text-xs uppercase italic transition-colors tracking-tight">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 italic">Connect</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 group">
                                <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-brand transition-colors group-hover:border-brand/40">
                                    <MapPin size={14} />
                                </div>
                                <span className="text-slate-400 font-black text-[10px] uppercase italic tracking-tight">Bangalore, India</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <a href="mailto:contact@parkease.com" className="flex items-center gap-3">
                                    <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-brand transition-all group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_0_15px_rgba(82,39,255,0.3)]">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-slate-400 font-black text-[10px] uppercase italic tracking-tight group-hover:text-brand">contact@parkease.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 font-black text-[9px] uppercase tracking-widest italic">
                        &copy; {new Date().getFullYear()} PARKEASE GLOBAL SYNC. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500/50"></div>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Network Encrypted</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

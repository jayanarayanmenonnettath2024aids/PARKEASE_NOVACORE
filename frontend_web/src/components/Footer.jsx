import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const platformLinks = [
        { name: 'Dashboard', path: '/' },
        { name: 'Find Parking', path: '/nearby' },
        { name: 'Booking History', path: '/history' },
        { name: 'Membership', path: '/membership' },
        { name: 'Rewards', path: '/rewards' }
    ];

    const supportLinks = [
        { name: 'Help Center', path: '/help' },
        { name: 'Safety Information', path: '/safety' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Accessibility', path: '/accessibility' }
    ];

    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10 px-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-brand p-1.5 rounded-xl text-white">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13.1V16c0 .6.4 1 1 1h2" />
                                        <circle cx="7" cy="17" r="2" />
                                        <path d="M9 17h6" />
                                        <circle cx="17" cy="17" r="2" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase italic">ParkEase</span>
                            </Link>
                        </div>
                        <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                            Revolutionizing the way you park. Intelligent, secure, and seamless parking solutions for modern urban travel.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-brand hover:text-white transition-all active:scale-95 border border-slate-700">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 italic">Platform</h4>
                        <ul className="space-y-4">
                            {platformLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-400 hover:text-brand font-bold transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 italic">Support</h4>
                        <ul className="space-y-4">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-400 hover:text-brand font-bold transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 italic">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-brand mt-1">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-slate-400 font-bold">123 Park Lane, Tech Hub, Bangalore, India</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <a href="mailto:contact@parkease.com" className="flex items-center gap-4 group">
                                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-slate-400 font-bold group-hover:text-brand transition-colors">contact@parkease.com</span>
                                </a>
                            </li>
                            <li className="flex items-center gap-4">
                                <a href="tel:+918012345678" className="flex items-center gap-4 group">
                                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <span className="text-slate-400 font-bold group-hover:text-brand transition-colors">+91 80 1234 5678</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 font-bold text-sm">
                        &copy; {new Date().getFullYear()} ParkEase. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link to="/help" className="text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-tighter italic">API Status</Link>
                        <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-tighter italic">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

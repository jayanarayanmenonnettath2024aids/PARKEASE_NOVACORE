import React from 'react';
import { User, Mail, Shield, LogOut, X } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user, onLogout }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-br from-brand to-indigo-600 p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-12 left-6 p-1.5 bg-white rounded-3xl shadow-lg">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-white">
                            <span className="text-3xl font-black text-brand italic">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-16 pb-8 px-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                            {user?.name || 'Active Driver'}
                        </h2>
                        <p className="text-slate-500 font-medium">Verified ParkEase User</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand/20 transition-colors">
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-400 group-hover:text-brand transition-colors">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                <p className="text-sm font-bold text-slate-900 leading-none">{user?.email || 'driver@parkease.com'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand/20 transition-colors">
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-400 group-hover:text-brand transition-colors">
                                <Shield size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Account Role</p>
                                <p className="text-sm font-bold text-slate-900 leading-none">Standard User</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 flex gap-3">
                        <button
                            onClick={onLogout}
                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black italic uppercase text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                        >
                            <LogOut size={18} />
                            Logout Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

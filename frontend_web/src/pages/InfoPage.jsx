import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function InfoPage({ title, description, content }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand font-bold mb-12 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-3xl p-10 md:p-16 shadow-sm"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-6">
                        {title}
                    </h1>
                    <p className="text-xl text-slate-500 font-bold italic mb-12 leading-relaxed">
                        {description}
                    </p>

                    <div className="prose prose-slate prose-lg max-w-none">
                        <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
                            {content || (
                                <>
                                    <section>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                                            <ChevronRight className="text-brand" />
                                            Overview
                                        </h2>
                                        <p>
                                            This section provides comprehensive details about {title.toLowerCase()}. We are committed to transparency and providing our users with all the necessary information to ensure a seamless and trust-filled experience with ParkEase.
                                        </p>
                                    </section>
                                    <section>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                                            <ChevronRight className="text-brand" />
                                            Core Principles
                                        </h2>
                                        <p>
                                            Our approach to {title.toLowerCase()} is built on three pillars: security, user-centric design, and continuous improvement. Every update we make is aimed at enhancing the efficiency of our parking ecosystem.
                                        </p>
                                    </section>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 italic text-slate-500 font-bold border-l-4 border-l-brand">
                                        For more specific inquiries regarding this section, please contact our support team at contact@parkease.com.
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

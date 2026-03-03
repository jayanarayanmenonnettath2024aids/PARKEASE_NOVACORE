import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Car, ArrowRight, Shield, Zap, Globe, Cpu,
    MapPin, Lock, CreditCard, Activity, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import DotGrid from '../components/DotGrid';
import logo from '../assets/image.png';

const FeatureCard = ({ icon, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="group relative bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] hover:bg-white/10 transition-all hover:-translate-y-2"
    >
        <div className="w-14 h-14 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3">{title}</h3>
        <p className="text-gray-400 font-bold text-sm leading-relaxed italic">{description}</p>
    </motion.div>
);

const StepCard = ({ number, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex gap-8 items-start"
    >
        <div className="text-6xl font-black text-brand/20 italic italic shrink-0">{number}</div>
        <div className="pt-4">
            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{title}</h4>
            <p className="text-gray-500 font-bold leading-relaxed max-w-sm italic">{description}</p>
        </div>
    </motion.div>
);

export default function Landing() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Cpu size={28} />,
            title: "AI Detection",
            description: "Real-time slot monitoring powered by neural networks and computer vision."
        },
        {
            icon: <Lock size={28} />,
            title: "Neural Guard",
            description: "Advanced encryption protocols ensuring your data and vehicles stay protected."
        },
        {
            icon: <CreditCard size={28} />,
            title: "Swift Pay",
            description: "Seamless GPay integration for instant, secure transactions with one-tap."
        },
        {
            icon: <Globe size={28} />,
            title: "Global Sync",
            description: "Access our synchronized parking network across major metropolitan hubs."
        }
    ];

    const stats = [
        { label: "Active Nodes", value: "50,000+" },
        { label: "Verified Lots", value: "1,200+" },
        { label: "Sync Speed", value: "0.2ms" },
        { label: "Reliability", value: "99.9%" }
    ];

    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden flex flex-col font-sans selection:bg-brand selection:text-white">

            {/* Background Layer */}
            <div className="fixed inset-0 z-0 opacity-60">
                <DotGrid
                    dotSize={6}
                    gap={35}
                    activeColor="#0ea5e9"
                    proximity={200}
                    returnDuration={2}
                />
            </div>

            {/* Header / Nav Decor */}
            <nav className="relative z-50 flex justify-between items-center px-10 py-8">
                <div className="flex items-center gap-3 h-10">
                    <img src={logo} alt="ParkEase Logo" className="h-full w-auto object-contain" />
                    <span className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">PARKEASE</span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="text-[10px] font-black underline decoration-brand decoration-2 underline-offset-8 text-white uppercase tracking-[0.3em] hover:text-brand transition-colors"
                >
                    Operator Login
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center pt-20 pb-40 px-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="animate-bounce-slow mb-12 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3"
                >
                    <div className="w-2 h-2 rounded-full bg-brand animate-ping"></div>
                    <span className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">System V4.0 Online</span>
                </motion.div>

                <div className="text-center max-w-6xl space-y-8">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-8xl md:text-[12rem] font-black text-white tracking-tightest uppercase italic leading-[0.85]"
                    >
                        THE FUTURE <br />
                        <span className="text-brand">OF PARKING</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-3xl text-gray-500 font-bold tracking-tight max-w-3xl mx-auto italic leading-tight"
                    >
                        Access our <span className="text-white">Neural-Sync</span> crowdsourced ecosystem. Reserve spots in milliseconds.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col md:flex-row gap-6 mt-20 w-full max-w-2xl"
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 group relative h-24 bg-brand rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand/40 transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-brand opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex items-center justify-center gap-6 text-black">
                            <span className="text-xl font-black uppercase tracking-widest italic leading-none">Initiate Sync</span>
                            <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/register')}
                        className="flex-1 group relative h-24 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-6 text-white">
                            <span className="text-xl font-black uppercase tracking-widest italic leading-none">Create Protocol</span>
                            <Zap className="text-brand group-hover:rotate-12 transition-transform" size={28} />
                        </div>
                    </button>
                </motion.div>
            </section>

            {/* Feature Grid */}
            <section className="relative z-10 px-6 py-40 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} index={i} />
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-10 px-6 py-40 bg-white/5 backdrop-blur-3xl border-y border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <header>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-[1px] w-8 bg-brand"></div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand italic">Protocol Guide</h2>
                            </div>
                            <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                                USER FLOW <br />
                                <span className="text-brand">CHART</span>
                            </h3>
                        </header>

                        <div className="space-y-16">
                            <StepCard
                                number="01"
                                title="Neural Scan"
                                description="Detect available slots in your vicinity using high-speed CV status nodes."
                                index={0}
                            />
                            <StepCard
                                number="02"
                                title="Sync Node"
                                description="Select your preferred slot and finalize reservation with one-tap payment."
                                index={1}
                            />
                            <StepCard
                                number="03"
                                title="Secure Dock"
                                description="Arrive at your destination and enjoy your guaranteed, pre-authorized spot."
                                index={2}
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 0.4, scale: 1 }}
                        className="relative hidden lg:block"
                    >
                        <div className="w-[600px] h-[600px] bg-brand rounded-full blur-[150px] opacity-20 animate-pulse"></div>
                        <Car size={400} className="absolute inset-0 m-auto text-brand/20 -rotate-12" />
                    </motion.div>
                </div>
            </section>

            {/* Stats / Trust Ribbon */}
            <section className="relative z-10 py-20 bg-brand">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center group">
                            <p className="text-5xl md:text-6xl font-black text-black tracking-tighter mb-1 italic group-hover:scale-110 transition-transform">
                                {s.value}
                            </p>
                            <p className="text-[10px] font-black text-brand-dark uppercase tracking-[0.3em]">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 px-6 py-60 flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-black text-white text-center italic tracking-tighter uppercase mb-16">
                    READY TO UPGRADE <br />
                    <span className="text-brand">YOUR COMMUTE?</span>
                </h2>
                <button
                    onClick={() => navigate('/login')}
                    className="px-16 h-20 bg-white text-black font-black text-xl italic uppercase tracking-widest rounded-full hover:bg-brand transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-white/10"
                >
                    Link System Now
                </button>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-20 border-t border-white/10 px-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all cursor-crosshair">
                        <Activity className="text-brand" />
                        <span className="text-xs font-black text-gray-500 tracking-widest uppercase">Encryption Active: AES-256</span>
                    </div>

                    <div className="flex gap-10">
                        <a href="#" className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Infrastructure</a>
                        <a href="#" className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Neural Network</a>
                        <a href="#" className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Sync Log</a>
                    </div>

                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                        © 2026 ParkEase Collective
                    </p>
                </div>
            </footer>
        </div>
    );
}

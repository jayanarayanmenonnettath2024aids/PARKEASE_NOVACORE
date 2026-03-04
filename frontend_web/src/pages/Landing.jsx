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
        <div className="relative h-screen bg-black overflow-hidden flex flex-col font-sans selection:bg-brand selection:text-white">

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
            <nav className="relative z-50 flex justify-between items-center px-10 py-8 shrink-0">
                <div className="flex items-center gap-3 h-10">
                    <img src={logo} alt="ParkEase Logo" className="h-full w-auto object-contain" />
                    <span className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">PARK<span className="text-brand">EASE</span></span>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-10 overflow-hidden">
                <div className="text-center max-w-7xl space-y-6">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-9xl lg:text-[10rem] font-black text-white tracking-tightest uppercase italic leading-[0.8]"
                    >
                        THE FUTURE OF <span className="text-brand">PARKING</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-3xl text-gray-500 font-bold tracking-tight max-w-4xl mx-auto italic leading-tight"
                    >
                        Access our crowdsourced ecosystem. Reserve your spots.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-8 mt-16"
                >
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Already an Existing user?</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-lg">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex-1 h-20 bg-brand rounded-[2rem] flex items-center justify-center gap-4 text-black group hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20"
                        >
                            <span className="text-lg font-black uppercase tracking-widest italic leading-none">Yes, Login</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className="flex-1 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center gap-4 text-white group hover:bg-white/10 hover:scale-105 active:scale-95 transition-all backdrop-blur-3xl"
                        >
                            <span className="text-lg font-black uppercase tracking-widest italic leading-none">No, Register</span>
                        </button>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}

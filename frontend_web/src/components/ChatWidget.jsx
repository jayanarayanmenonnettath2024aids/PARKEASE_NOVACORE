import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Iphone16Pro from './Iphone16Pro';
import ChatBot from './ChatBot';
import ChatbotImg from '../assets/ChatbotImg.jpeg';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Show tooltip after a small delay if not open
        const timer = setTimeout(() => {
            if (!isOpen) setShowTooltip(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            {/* Chat Window Container */}
            <div className={`absolute bottom-24 right-0 transition-all duration-500 origin-bottom-right ${isOpen
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
                }`}>
                <Iphone16Pro width={320} height={640} className="shadow-2xl border-4 border-slate-800 rounded-[3rem]">
                    <ChatBot />
                </Iphone16Pro>
            </div>

            {/* Chat with us Bubble */}
            {!isOpen && showTooltip && (
                <div className="absolute bottom-20 right-0 mb-4 animate-bounce-subtle pointer-events-none">
                    <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl shadow-2xl border border-slate-100 relative whitespace-nowrap">
                        <p className="font-black uppercase italic tracking-tighter text-xs">Chat with us!</p>
                        {/* Tooltip Arrow */}
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45"></div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setShowTooltip(false);
                }}
                className={`group relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 active:scale-95 ${isOpen
                    ? 'bg-slate-900 border-4 border-slate-800'
                    : 'bg-white border-4 border-brand/20 hover:border-brand hover:scale-110 shadow-brand/20'
                    }`}
            >
                {isOpen ? (
                    <X size={32} className="text-white" />
                ) : (
                    <img
                        src={ChatbotImg}
                        alt="Chat"
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                )}

                {/* Status Indicator (Hidden when open) */}
                {!isOpen && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;

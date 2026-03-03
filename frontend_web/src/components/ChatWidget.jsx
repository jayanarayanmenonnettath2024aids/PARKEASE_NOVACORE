import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Iphone16Pro from './Iphone16Pro';
import ChatBot from './ChatBot';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            {/* Chat Window Container */}
            <div className={`absolute bottom-24 right-0 transition-all duration-500 origin-bottom-right ${isOpen
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
                }`}>
                <Iphone16Pro width={320} height={640} className="shadow-2xl">
                    <ChatBot />
                </Iphone16Pro>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 active:scale-90 ${isOpen
                        ? 'bg-slate-800 rotate-90'
                        : 'bg-brand hover:scale-110 shadow-brand/40'
                    }`}
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <MessageCircle size={28} fill="currentColor" className="text-white" />
                )}

                {/* Notification Badge (Hidden when open) */}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;

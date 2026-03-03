import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ChatbotImg from '../assets/ChatbotImg.jpeg';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your ParkEase AI assistant. How can I help you with your parking today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'sk-default-UVwrao9HeTWXak5gb3d0cf1VWSZ3O4Bv'
                },
                body: JSON.stringify({
                    user_id: "kungumapriyaamkp5@gmail.com",
                    agent_id: "69a72d51d1887ac8e37653f2",
                    session_id: "69a72d51d1887ac8e37653f2-djjpbikqmwn",
                    message: userMessage
                })
            });

            const data = await response.json();
            const botResponse = data.response || data.message || "I'm sorry, I couldn't process that request.";

            setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'bot', content: "System connection error. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 font-sans">
            {/* Header */}
            <div className="bg-slate-900/80 backdrop-blur-md pt-12 pb-4 px-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-brand/50 overflow-hidden shadow-lg shadow-brand/20">
                        <img
                            src={ChatbotImg}
                            alt="VarghEase"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">VarghEase</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto p-6 space-y-6"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' }
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .flex-1::-webkit-scrollbar {
                        display: none;
                    }
                `}} />
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium ${msg.role === 'user'
                            ? 'bg-brand text-white rounded-tr-none'
                            : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-900 rounded-2xl px-4 py-3 text-slate-400 flex items-center gap-2 border border-white/5">
                            <Loader2 size={16} className="animate-spin text-brand" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-t border-white/5 pb-10">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;

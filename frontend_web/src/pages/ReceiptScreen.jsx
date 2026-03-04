import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, MessageSquare, Home, Share2, Navigation, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";

export default function ReceiptPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking || {
        id: "PK-123456",
        location: "Mock Lot",
        date: "03/03/2026",
        time: "10:30 PM",
        duration: "1 Hour",
        amount: 50,
        paymentId: "PAY-TEST"
    };

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);

        try {
            const doc = new jsPDF();

            // Header Section
            doc.setFillColor(82, 39, 255); // ParkEase Purple
            doc.rect(0, 0, 210, 45, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(28);
            doc.setFont("helvetica", "bold");
            doc.text("PARKEASE", 20, 25);

            doc.setFontSize(14);
            doc.setFont("helvetica", "normal");
            doc.text("OFFICIAL PAYMENT RECEIPT", 20, 35);

            // Details Section
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(12);
            doc.setDrawColor(230, 230, 230);

            const startX = 20;
            const startY = 65;
            const rowHeight = 12;

            const drawRow = (label, value, y) => {
                doc.setFont("helvetica", "bold");
                doc.text(label, startX, y);
                doc.setFont("helvetica", "normal");
                doc.text(String(value), 85, y);
                doc.line(startX, y + 4, 190, y + 4);
            };

            drawRow("Reference ID:", booking.id, startY);
            drawRow("Parking Location:", booking.location, startY + rowHeight);
            drawRow("Date:", booking.date, startY + (rowHeight * 2));
            drawRow("Time:", booking.time, startY + (rowHeight * 3));
            drawRow("Duration:", booking.duration, startY + (rowHeight * 4));

            doc.setTextColor(82, 39, 255);
            drawRow("Amount Paid:", `INR ${booking.amount}`, startY + (rowHeight * 5));
            doc.setTextColor(40, 40, 40);

            drawRow("Payment Status:", "SUCCESSFUL", startY + (rowHeight * 6));
            drawRow("Transaction ID:", booking.paymentId, startY + (rowHeight * 7));

            // Footer Section
            doc.setFontSize(10);
            doc.setTextColor(160, 160, 160);
            doc.text("This is an electronically generated receipt and does not require a physical signature.", 20, 180);
            doc.text("Thank you for using ParkEase - Simplifying Urban Mobility.", 20, 186);

            doc.save(`ParkEase-Receipt-${booking.id}.pdf`);
        } catch (error) {
            console.error("PDF Download failed:", error);
            alert("PDF Generation failed. Please try again.");
        } finally {
            setTimeout(() => setIsDownloading(false), 1500);
        }
    };

    useEffect(() => {
        // Automatically trigger download on mount
        const timer = setTimeout(() => {
            handleDownload();
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-[calc(100vh-64px)] p-6 flex flex-col items-center justify-center">
            <div className="max-w-md w-full space-y-12 animate-fade-in py-10">

                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-24 h-24 bg-brand text-white rounded-full flex items-center justify-center shadow-2xl shadow-brand/30 ring-8 ring-brand/10">
                        <CheckCircle size={48} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Booking <span className="text-brand">Confirmed</span></h1>
                        <p className="text-slate-400 font-medium mt-2 italic tracking-wide">Identity Verified • Payment Processed</p>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl space-y-8 relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                            <span>Reference ID</span>
                            <span className="text-brand font-black">{booking.id}</span>
                        </div>

                        <div className="space-y-4 pt-4">
                            {[
                                { label: 'Location', value: booking.location },
                                { label: 'Date & Time', value: `${booking.date} @ ${booking.time}` },
                                { label: 'Duration', value: booking.duration },
                                { label: 'Amount Paid', value: `₹${booking.amount}` },
                                { label: 'Payment ID', value: booking.paymentId },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{item.label}</span>
                                    <span className="text-base font-black text-slate-900 italic uppercase tracking-tighter">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 grid grid-cols-2 gap-4 relative z-10">
                        <button
                            onClick={handleDownload}
                            className={`flex flex-col items-center justify-center p-6 bg-slate-50 border border-gray-100 rounded-3xl transition-all group ${isDownloading ? 'text-brand border-brand' : 'hover:bg-brand hover:text-white'}`}
                        >
                            <Download size={24} className={`mb-2 group-hover:scale-110 transition-transform ${isDownloading ? 'animate-bounce' : ''}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                {isDownloading ? 'Downloading...' : 'Download PDF'}
                            </span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-gray-100 rounded-3xl hover:bg-brand hover:text-white transition-all group">
                            <Mail size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Send Email</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/navigation', { state: { slot: location.state?.slot } })}
                        className="w-full bg-brand text-white font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-4 shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        <Navigation size={20} />
                        Start Navigation
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-4 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        <Home size={20} />
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

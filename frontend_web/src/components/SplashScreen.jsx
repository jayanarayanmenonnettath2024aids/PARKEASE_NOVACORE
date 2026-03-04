import React, { useRef, useEffect } from 'react';
import driftVideo from '../assets/DRIFT_VIDEO.mp4';

const SplashScreen = ({ onVideoEnd }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.warn("Autoplay was prevented. Please interact with the page.", error);
            });
        }
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onEnded={onVideoEnd}
                autoPlay
                muted
                playsInline
            >
                <source src={driftVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default SplashScreen;

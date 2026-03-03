import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Draggable from 'gsap/draggable';

gsap.registerPlugin(Draggable);

const LampUI = ({ onToggle }) => {
    const [isOn, setIsOn] = useState(false);
    const cordBeadRef = useRef(null);
    const cordLineRef = useRef(null);
    const hitAreaRef = useRef(null);
    const lampWrapperRef = useRef(null);

    // Audio ref for the click sound
    const clickSoundRef = useRef(null);

    useEffect(() => {
        const hitArea = hitAreaRef.current;
        const cordBead = cordBeadRef.current;
        const cordLine = cordLineRef.current;

        const draggables = Draggable.create(hitArea, {
            type: "y",
            bounds: { minY: 0, maxY: 60 },
            onDrag: function () {
                gsap.set(cordBead, { y: this.y });
                gsap.set(cordLine, { attr: { y2: 180 + this.y } });
            },
            onRelease: function () {
                if (this.y > 30) {
                    handleToggle();
                }

                gsap.to([cordBead, hitArea], { y: 0, duration: 0.5, ease: "back.out(2.5)" });
                gsap.to(cordLine, { attr: { y2: 180 }, duration: 0.5, ease: "back.out(2.5)" });
            }
        });

        return () => {
            if (draggables.length > 0) draggables[0].kill();
        };
    }, [isOn]);

    const handleToggle = () => {
        const nextState = !isOn;
        setIsOn(nextState);
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
        onToggle(nextState);
    };

    return (
        <div className="lamp-wrapper relative w-[280px] h-[400px] flex justify-center z-20" ref={lampWrapperRef}>
            <audio ref={clickSoundRef} src="https://assets.codepen.io/605876/click.mp3" />
            <svg className="lamp-svg w-full h-full overflow-visible" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                <ellipse
                    className={`inner-glow transition-opacity duration-500 fill-[#ffdb8a] blur-[15px] ${isOn ? 'opacity-60' : 'opacity-0'}`}
                    cx="100" cy="110" rx="60" ry="30"
                />

                <rect className="lamp-base fill-[#d1ccc2]" x="92" y="100" width="16" height="160" rx="8" />

                <rect className="lamp-base fill-[#d1ccc2]" x="60" y="250" width="80" height="12" rx="6" />

                <g className="pull-cord">
                    <line ref={cordLineRef} className="cord-line stroke-[#555] stroke-2" x1="130" y1="110" x2="130" y2="180" />
                    <circle ref={cordBeadRef} className="cord-bead fill-brand" cx="130" cy="190" r="6" />
                    <circle ref={hitAreaRef} className="cord-hit cursor-pointer fill-transparent" cx="130" cy="190" r="25" />
                </g>

                <path
                    className={`lamp-shade transition-all duration-500 ${isOn ? 'fill-white drop-shadow-[0_0_30px_rgba(255,255,200,0.4)]' : 'fill-[#f5f0e6]'}`}
                    d="M30 110 C 30 50, 170 50, 170 110 C 170 125, 30 125, 30 110 Z"
                />
            </svg>
        </div>
    );
};

export default LampUI;

import React, { forwardRef } from "react";

const Iphone16Pro = forwardRef(
    (
        {
            children,
            width = 380,
            height = 780,
            showIsland = true,
            islandWidth = 110,
            islandHeight = 35,
            frameColor = "slate-900",
            bezelColor = "black",
            screenRadius = 45,
            shadow = true,
            className = "",
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                style={{ width: `${width}px`, height: `${height}px` }}
                className={`relative bg-transparent transition-all duration-500 scale-90 md:scale-100 ${shadow ? "drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]" : ""} ${className}`}
                {...props}
            >
                {/* Outer frame */}
                <div
                    className={`absolute inset-0 bg-${frameColor} rounded-[60px] border-[1px] border-white/10 p-[12px]`}
                >
                    {/* Bezel */}
                    <div className="absolute inset-[1px] bg-black rounded-[59px]"></div>

                    {/* Screen / Content */}
                    <div
                        className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col"
                        style={{ borderRadius: `${screenRadius}px` }}
                    >
                        {children}

                        {/* Dynamic island */}
                        {showIsland && (
                            <div
                                className="absolute top-4 left-1/2 -translate-x-1/2 bg-black flex items-center justify-center p-1"
                                style={{
                                    width: `${islandWidth}px`,
                                    height: `${islandHeight}px`,
                                    borderRadius: "20px"
                                }}
                            >
                                <div className="w-[8px] h-[8px] rounded-full bg-slate-900/50 ml-auto mr-4"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Physical Buttons Mockup */}
                <div className="absolute left-[-2px] top-32 w-1.5 h-16 bg-slate-800 rounded-l-md border-y border-l border-white/10"></div>
                <div className="absolute left-[-2px] top-52 w-1.5 h-24 bg-slate-800 rounded-l-md border-y border-l border-white/10"></div>
                <div className="absolute right-[-2px] top-44 w-1.5 h-28 bg-slate-800 rounded-r-md border-y border-r border-white/10"></div>
            </div>
        );
    }
);

Iphone16Pro.displayName = "Iphone16Pro";

export default Iphone16Pro;

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';
import ProfileModal from './ProfileModal';
import { MapPin, ChevronDown } from 'lucide-react';

export const StaggeredMenu = ({
    position = 'right',
    colors = ['#5227FF', '#FF27E1', '#27D0FF', '#FFB027'],
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    className,
    logoUrl,
    menuButtonColor = '#0f172a',
    openMenuButtonColor = '#fff',
    accentColor = '#5227FF',
    changeMenuColorOnOpen = true,
    isFixed = false,
    closeOnClickAway = true,
    onMenuOpen,
    onMenuClose,
    user,
    onLogout
}) => {
    const [open, setOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const openRef = useRef(false);
    const panelRef = useRef(null);
    const preLayersRef = useRef(null);
    const preLayerElsRef = useRef([]);
    const plusHRef = useRef(null);
    const plusVRef = useRef(null);
    const iconRef = useRef(null);
    const textInnerRef = useRef(null);
    const textWrapRef = useRef(null);
    const [textLines, setTextLines] = useState(['Menu', 'Close']);

    const openTlRef = useRef(null);
    const closeTweenRef = useRef(null);
    const spinTweenRef = useRef(null);
    const textCycleAnimRef = useRef(null);
    const colorTweenRef = useRef(null);
    const toggleBtnRef = useRef(null);
    const busyRef = useRef(false);
    const itemEntranceTweenRef = useRef(null);

    // Geolocation State
    const [location, setLocation] = useState('Detecting...');
    const [isAutoLocation, setIsAutoLocation] = useState(true);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

    const presetCities = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai'];

    const fetchCityName = async (lat, lon) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`);
            const data = await response.json();
            const addr = data.address;
            const city = addr.city || addr.town || addr.village || addr.municipality || addr.city_district || addr.suburb || addr.neighbourhood || addr.state || 'Unknown';
            setLocation(city);
        } catch (error) {
            console.error('Geocoding error:', error);
            setLocation('Bangalore'); // Fallback
        }
    };

    React.useEffect(() => {
        if (isAutoLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchCityName(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocation('Bangalore'); // Fallback
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    }, [isAutoLocation]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;
            const plusH = plusHRef.current;
            const plusV = plusVRef.current;
            const icon = iconRef.current;
            const textInner = textInnerRef.current;
            if (!panel || !plusH || !plusV || !icon || !textInner) return;

            let preLayers = [];
            if (preContainer) {
                preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
            }
            preLayerElsRef.current = preLayers;

            // Initial state: Hidden circle at top right
            gsap.set([panel, ...preLayers], { clipPath: 'circle(0% at top right)' });
            gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
            gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
            gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
            gsap.set(textInner, { yPercent: 0 });
            if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
        });
        return () => ctx.revert();
    }, [menuButtonColor, position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }
        itemEntranceTweenRef.current?.kill();

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

        if (itemEls.length) {
            gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        if (numberEls.length) {
            gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        if (socialTitle) {
            gsap.set(socialTitle, { opacity: 0 });
        }
        if (socialLinks.length) {
            gsap.set(socialLinks, { y: 25, opacity: 0 });
        }

        const tl = gsap.timeline({ paused: true });

        // Radial reveal for layers
        layers.forEach((layer, i) => {
            tl.to(layer, {
                clipPath: 'circle(150% at top right)',
                duration: 0.8,
                ease: 'power3.inOut'
            }, i * 0.1);
        });

        const panelStartTime = (layers.length) * 0.1;
        tl.to(panel, {
            clipPath: 'circle(150% at top right)',
            duration: 1,
            ease: 'power4.out'
        }, panelStartTime);

        if (itemEls.length) {
            tl.to(
                itemEls,
                {
                    yPercent: 0,
                    rotate: 0,
                    duration: 1,
                    ease: 'power4.out',
                    stagger: { each: 0.1, from: 'start' }
                },
                panelStartTime + 0.3
            );
            if (numberEls.length) {
                tl.to(
                    numberEls,
                    {
                        duration: 0.6,
                        ease: 'power2.out',
                        '--sm-num-opacity': 1,
                        stagger: { each: 0.08, from: 'start' }
                    },
                    panelStartTime + 0.4
                );
            }
        }

        if (socialTitle || socialLinks.length) {
            const socialsStart = panelStartTime + 0.6;
            if (socialTitle) {
                tl.to(socialTitle, { opacity: 1, duration: 0.5 }, socialsStart);
            }
            if (socialLinks.length) {
                tl.to(
                    socialLinks,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55,
                        ease: 'power3.out',
                        stagger: { each: 0.08, from: 'start' }
                    },
                    socialsStart + 0.04
                );
            }
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => {
                busyRef.current = false;
            });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        const all = [panel, ...layers].reverse();
        closeTweenRef.current?.kill();

        closeTweenRef.current = gsap.to(all, {
            clipPath: 'circle(0% at top right)',
            duration: 0.6,
            ease: 'power2.in',
            stagger: 0.05,
            onComplete: () => {
                busyRef.current = false;
            }
        });
    }, []);

    const animateIcon = useCallback(opening => {
        const icon = iconRef.current;
        if (!icon) return;
        spinTweenRef.current?.kill();
        if (opening) {
            spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out' });
        } else {
            spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut' });
        }
    }, []);

    const animateColor = useCallback(
        opening => {
            const btn = toggleBtnRef.current;
            if (!btn) return;
            colorTweenRef.current?.kill();
            if (changeMenuColorOnOpen) {
                const targetColor = opening ? openMenuButtonColor : menuButtonColor;
                colorTweenRef.current = gsap.to(btn, {
                    color: targetColor,
                    delay: 0.18,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        },
        [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
    );

    const animateText = useCallback(opening => {
        const inner = textInnerRef.current;
        if (!inner) return;
        textCycleAnimRef.current?.kill();

        const currentLabel = opening ? 'Menu' : 'Close';
        const targetLabel = opening ? 'Close' : 'Menu';
        const cycles = 3;
        const seq = [currentLabel];
        let last = currentLabel;
        for (let i = 0; i < cycles; i++) {
            last = last === 'Menu' ? 'Close' : 'Menu';
            seq.push(last);
        }
        if (last !== targetLabel) seq.push(targetLabel);
        seq.push(targetLabel);
        setTextLines(seq);

        gsap.set(inner, { yPercent: 0 });
        const lineCount = seq.length;
        const finalShift = ((lineCount - 1) / lineCount) * 100;
        textCycleAnimRef.current = gsap.to(inner, {
            yPercent: -finalShift,
            duration: 0.5 + lineCount * 0.07,
            ease: 'power4.out'
        });
    }, []);

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);
        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }
        animateIcon(target);
        animateColor(target);
        animateText(target);
    }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

    const closeMenu = useCallback(() => {
        if (openRef.current) {
            openRef.current = false;
            setOpen(false);
            onMenuClose?.();
            playClose();
            animateIcon(false);
            animateColor(false);
            animateText(false);
        }
    }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

    React.useEffect(() => {
        if (!closeOnClickAway || !open) return;

        const handleClickOutside = event => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                toggleBtnRef.current &&
                !toggleBtnRef.current.contains(event.target)
            ) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeOnClickAway, open, closeMenu]);

    return (
        <div
            className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
            style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
            data-position={position}
            data-open={open || undefined}
        >
            <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
                {(() => {
                    const raw = colors && colors.length ? colors.slice(0, 4) : ['#5227FF', '#FF27E1', '#27D0FF', '#FFB027'];
                    let arr = [...raw];
                    if (arr.length >= 3) {
                        const mid = Math.floor(arr.length / 2);
                        arr.splice(mid, 1);
                    }
                    return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
                })()}
            </div>
            <header className="staggered-menu-header" aria-label="Main navigation header">
                <div className="sm-logo" aria-label="Logo">
                    {logoUrl ? (
                        <div className="flex items-center gap-3 h-full">
                            <img
                                src={logoUrl}
                                alt="Logo"
                                className="h-10 w-auto object-contain"
                                draggable={false}
                            />
                            <span className="text-xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">ParkEase</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="bg-brand p-1.5 rounded-xl text-white">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13.1V16c0 .6.4 1 1 1h2" />
                                    <circle cx="7" cy="17" r="2" />
                                    <path d="M9 17h6" />
                                    <circle cx="17" cy="17" r="2" />
                                </svg>
                            </div>
                            <span className="text-lg font-black tracking-tighter uppercase italic text-slate-900">ParkEase</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Location Section */}
                    <div className="relative group mr-2">
                        <div
                            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-gray-100 rounded-2xl cursor-pointer hover:border-brand/30 transition-all active:scale-95"
                            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        >
                            <div className="text-brand">
                                <MapPin size={16} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Location</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-black text-slate-900 italic uppercase leading-none">{location}</span>
                                    <ChevronDown size={10} className={`transition-transform duration-300 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                        </div>

                        {/* Dropdown */}
                        {isLocationDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-3xl shadow-2xl py-3 z-[1002] animate-in slide-in-from-top-2 duration-300">
                                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Change Location</p>
                                </div>
                                <button
                                    className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-colors hover:bg-slate-50 flex items-center justify-between ${isAutoLocation ? 'text-brand' : 'text-slate-600'}`}
                                    onClick={() => { setIsAutoLocation(true); setLocation('Detecting...'); setIsLocationDropdownOpen(false); }}
                                >
                                    <span>Use My GPS</span>
                                    {isAutoLocation && <div className="w-1 h-1 bg-brand rounded-full"></div>}
                                </button>
                                <div className="h-[1px] bg-gray-50 my-1 mx-4"></div>
                                {presetCities.map(city => (
                                    <button
                                        key={city}
                                        className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-colors hover:bg-slate-50 flex items-center justify-between ${!isAutoLocation && location === city ? 'text-brand' : 'text-slate-600'}`}
                                        onClick={() => { setLocation(city); setIsAutoLocation(false); setIsLocationDropdownOpen(false); }}
                                    >
                                        <span>{city}</span>
                                        {!isAutoLocation && location === city && <div className="w-1 h-1 bg-brand rounded-full"></div>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Profile Avatar Trigger */}
                    <div
                        className="sm-profile-trigger group cursor-pointer flex items-center gap-3 pr-2 border-r border-gray-100"
                        onClick={() => setIsProfileOpen(true)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic">Active Driver</p>
                            <p className="text-sm font-black text-slate-900 italic uppercase truncate max-w-[100px]">{user?.name || 'Mock User'}</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm relative group-hover:border-brand/30 transition-colors">
                            <div className="w-6 h-6 bg-brand/10 rounded-lg text-brand flex items-center justify-center font-black text-xs">
                                {user?.name?.charAt(0) || 'M'}
                            </div>
                        </div>
                    </div>

                    <button
                        ref={toggleBtnRef}
                        className="sm-toggle"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        aria-controls="staggered-menu-panel"
                        onClick={toggleMenu}
                        type="button"
                    >
                        <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
                            <span ref={textInnerRef} className="sm-toggle-textInner">
                                {textLines.map((l, i) => (
                                    <span className="sm-toggle-line" key={i}>
                                        {l}
                                    </span>
                                ))}
                            </span>
                        </span>
                        <span ref={iconRef} className="sm-icon" aria-hidden="true">
                            <span ref={plusHRef} className="sm-icon-line" />
                            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
                        </span>
                    </button>
                </div>
            </header >

            <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
                <div className="sm-panel-inner">
                    <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
                        {items && items.length ? (
                            items.map((it, idx) => (
                                <li className="sm-panel-itemWrap" key={it.label + idx}>
                                    <button
                                        className="sm-panel-item w-full text-left bg-transparent border-none appearance-none cursor-pointer"
                                        onClick={() => {
                                            if (it.onClick) it.onClick();
                                            closeMenu();
                                        }}
                                        aria-label={it.ariaLabel}
                                        data-index={idx + 1}
                                    >
                                        <span className="sm-panel-itemLabel">{it.label}</span>
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="sm-panel-itemWrap" aria-hidden="true">
                                <span className="sm-panel-item">
                                    <span className="sm-panel-itemLabel">No items</span>
                                </span>
                            </li>
                        )}
                    </ul>
                    {displaySocials && socialItems && socialItems.length > 0 && (
                        <div className="sm-socials" aria-label="Social links">
                            <h3 className="sm-socials-title">Socials</h3>
                            <ul className="sm-socials-list" role="list">
                                {socialItems.map((s, i) => (
                                    <li key={s.label + i} className="sm-socials-item">
                                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                                            {s.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </aside>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                onLogout={onLogout}
            />
        </div >
    );
};

export default StaggeredMenu;

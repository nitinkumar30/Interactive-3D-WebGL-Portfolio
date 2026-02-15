import React, { useEffect, useState } from 'react';
import { useScene } from '../../context/SceneContext';
// import './GlobalOverlay.scss'; // Using inline styles

const GlobalOverlay = () => {
    const { overlayContent, closeOverlay } = useScene();
    const [isVisible, setIsVisible] = useState(false);
    const [animateOpen, setAnimateOpen] = useState(false);

    // Check if mobile based on window width
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (overlayContent) {
            setIsVisible(true);
            // Delay animation to allow DOM mount and initial 'closed' layout paint
            const delayAnim = setTimeout(() => {
                setAnimateOpen(true);
            }, 50); // 50ms is safe for React render + browser paint
            return () => clearTimeout(delayAnim);
        } else {
            setAnimateOpen(false);
            // Wait for exit animation (should match transition duration ~0.6-1s)
            const timer = setTimeout(() => setIsVisible(false), 800);
            return () => clearTimeout(timer);
        }
    }, [overlayContent]);

    // Keep content visible during exit animation using a dedicated cache
    const [cachedContent, setCachedContent] = useState(null);
    useEffect(() => {
        if (overlayContent) {
            setCachedContent(overlayContent);
        }
    }, [overlayContent]);

    if (!isVisible && !overlayContent && !cachedContent) return null;

    const content = overlayContent || cachedContent;

    // Propagate animateOpen state to control CSS transitions
    return <ContentCard content={content} isOpen={animateOpen} onClose={closeOverlay} isMobile={isMobile} />;
};

const ContentCard = ({ content, isOpen, onClose, isMobile }) => {
    if (!content) return null;

    const label = content.platformConfig?.label || 'Content';

    const handleBackdropClick = (e) => {
        // Only close if clicking the wrapper itself (which acts as backdrop here)
        // OR the backdrop-layer (if we could attach handler there directly, but wrapper covers it)
        // Currently wrapper covers everything.
        if (e.target.classList.contains('global-overlay-wrapper') || e.target.classList.contains('global-overlay-backdrop-layer')) {
            onClose();
        }
    };

    // --- STYLES & ANIMATION CONFIG ---
    // Spring ease for that "pop" effect
    const transitionSpring = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease';
    const transitionContent = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

    // --- KONFIGURACJA STYLU KARTKI (POZYCJA) ---
    // Używamy % lub vw/vh dla fluid-responsywności.
    const cardStyle = isMobile ? {
        // MOBILE: Karta na dole
        width: '90%',
        maxHeight: '60vh',
        bottom: '10rem', // <--- FLUID: WPROWADZONE PRZEZ UZYTKOWNIKA
        left: '50%',
        transform: isOpen ? 'translate(-50%, 0) rotate(-1deg)' : 'translate(-50%, 120%) rotate(10deg)',
        opacity: isOpen ? 1 : 0,
        backgroundColor: '#f8f8f8',
        color: '#1a1a1a',
        border: '2px solid #1a1a1a',
        borderRadius: '4px',
        boxShadow: isOpen ? '8px 8px 0px rgba(0,0,0,0.1)' : '0px 0px 0px rgba(0,0,0,0)',
    } : {
        // DESKTOP: Karta po prawej
        width: 'clamp(280px, 30vw, 450px)', // <--- FLUID
        right: 'clamp(2rem, 12vw, 20rem)', // <--- FLUID: scales with viewport
        top: '50%',
        transform: isOpen ? 'translateY(-50%) rotate(1deg)' : 'translate(150%, -50%) rotate(15deg)',
        opacity: isOpen ? 1 : 0,
        backgroundColor: '#f8f8f8',
        color: '#1a1a1a',
        border: '2px solid #1a1a1a',
        borderRadius: '3px',
        boxShadow: isOpen ? '12px 12px 0px rgba(0,0,0,0.1)' : '0px 0px 0px rgba(0,0,0,0)',
    };

    // Staggered animation helper (delays based on index)
    const getStaggerStyle = (delay) => ({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        transition: transitionContent,
        transitionDelay: isOpen ? `${delay}ms` : '0ms',
    });

    // --- KONFIGURACJA MASKI (SPOTLIGHT - CZARNA DZIURA) ---
    const maskStyle = (content.layout === 'certificate_grid') ? {
        maskImage: 'none',
        WebkitMaskImage: 'none'
    } : isMobile ? {
        // Mobile: Monitor jest na górze (50% szerokości, 25% wysokości od góry)
        maskImage: 'radial-gradient(circle at 50% 25%, transparent 0%, transparent 15%, black 40%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 25%, transparent 0%, transparent 15%, black 40%)'
    } : {
        // Desktop: Monitor jest po lewej (31% szerokości od lewej, 50% wysokości)
        // WPROWADZONE PRZEZ UZYTKOWNIKA 31%
        maskImage: 'radial-gradient(circle at 31% 50%, transparent 0%, transparent 12%, black 35%)',
        WebkitMaskImage: 'radial-gradient(circle at 31% 50%, transparent 0%, transparent 12%, black 35%)'
    };

    return (
        <div
            className="global-overlay-wrapper"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 2000,
                pointerEvents: isOpen ? 'auto' : 'none',
                // Important: Wrapper itself has NO background and NO mask. 
                // It just holds the layers.
            }}
            onClick={handleBackdropClick}
        >
            {/* 1. LAYER: BACKDROP (The dark blurry part with the hole) */}
            <div
                className="global-overlay-backdrop-layer"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    // Visuals
                    backgroundColor: isOpen ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
                    backdropFilter: isOpen ? 'blur(8px)' : 'blur(0px)',
                    transition: 'background-color 0.8s ease, backdrop-filter 0.8s ease',
                    // Mask applies ONLY here
                    ...maskStyle
                }}
            />

            {/* 2. LAYER: CONTENT (The card, sits ON TOP of backdrop, unaffected by mask) */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none', // Pass clicks through empty areas to backdrop wrapper
                    display: 'flex', // Helper to position absolute children if needed, but we use absolute on card
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        padding: '2.5rem',
                        transition: transitionSpring, // The bouncy entrance
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.2rem',
                        overflowY: 'auto',
                        fontFamily: "'Courier New', Courier, monospace", // Typewriter vibe
                        pointerEvents: 'auto', // Re-enable clicks for the card
                        ...cardStyle,
                        // Override styles for grid layout to be centered and wider
                        ...(content.layout === 'certificate_grid' ? {
                            width: 'clamp(300px, 90vw, 1200px)',
                            height: 'clamp(500px, 85vh, 900px)',
                            maxHeight: '85vh',
                            left: '50%',
                            top: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 100%)',
                        } : {})
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
                >
                    {/* Paper Tape / Decor (Mobile Handle) */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '40px',
                        height: '4px',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '2px',
                        display: isMobile ? 'block' : 'none'
                    }} />

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem',
                        ...getStaggerStyle(100)
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{
                                textTransform: 'uppercase',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '1px',
                                color: '#666'
                            }}>
                                {label}
                            </span>
                            <h2 style={{
                                fontSize: '1.8rem',
                                margin: 0,
                                lineHeight: 1.1,
                                fontWeight: 800,
                                fontFamily: "sans-serif", // Clean, bold
                            }}>
                                {content.title}
                            </h2>
                        </div>

                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: '2px solid #1a1a1a',
                                color: '#1a1a1a',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                flexShrink: 0,
                                marginLeft: '1rem',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            ✕
                        </button>
                    </div>

                    {/* === LAYOUT: CERTIFICATE GRID === */}
                    {content.layout === 'certificate_grid' ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem',
                            padding: '1rem 0',
                            ...getStaggerStyle(200)
                        }}>
                            {content.items?.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.8rem',
                                    backgroundColor: '#fff',
                                    padding: '1rem',
                                    borderRadius: '2px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    onClick={() => window.open(item.url || content.url || '#', '_blank')}
                                >
                                    {/* Image Wrapper (Aspect Ratio) */}
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        paddingBottom: '70%', // ~ISO A4 Landscape ratio
                                        backgroundColor: '#eee',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={item.image}
                                            alt={item.label}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    {/* Caption */}
                                    <div style={{ textAlign: 'center' }}>
                                        <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', fontWeight: 700 }}>
                                            {item.label}
                                        </h4>
                                        <span style={{ fontSize: '0.8rem', color: '#666', fontFamily: "monospace" }}>
                                            {item.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* === LAYOUT: DEFAULT (The Studio Style) === */
                        <>
                            {/* Meta Info */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                fontSize: '0.8rem',
                                color: '#666',
                                borderBottom: '1px dashed #ccc',
                                paddingBottom: '1rem',
                                ...getStaggerStyle(200)
                            }}>
                                <strong>{content.date}</strong>
                                {content.views && <span>{content.views} views</span>}
                            </div>

                            {/* Description */}
                            <p style={{
                                lineHeight: 1.6,
                                color: '#333',
                                fontSize: '0.95rem',
                                margin: 0,
                                ...getStaggerStyle(300)
                            }}>
                                {content.description}
                            </p>

                            {/* Action Button */}
                            <div style={{
                                marginTop: 'auto',
                                paddingTop: '1rem',
                                ...getStaggerStyle(400)
                            }}>
                                <a
                                    href={content.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: '#1a1a1a', // Black ink
                                        color: '#fff',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        borderRadius: '2px', // Slight round
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        fontSize: '0.9rem',
                                        transition: 'opacity 0.2s',
                                    }}
                                    onMouseOver={(e) => e.target.style.opacity = 0.8}
                                    onMouseOut={(e) => e.target.style.opacity = 1}
                                >
                                    Open Link ↗
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalOverlay;

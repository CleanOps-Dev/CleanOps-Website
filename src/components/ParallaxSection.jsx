// src/components/ParallaxSection.jsx

import React, { forwardRef, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import SakuraPetals from './SakuraPetals';

// Use forwardRef to allow parent components to pass a ref to this component's <section> element
const ParallaxSection = forwardRef(({ imageUrl, overlaySvg, children, className, gradientClass, id, particles }, ref) => {
    const internalRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: internalRef,
        offset: ["start end", "end start"],
    });

    // A more conservative parallax effect to prevent visual issues
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    // Only honour an explicit reduced-motion request. The layout is identical
    // either way -- just the scroll-linked drift goes away.
    const isStatic = useReducedMotion();
    const parallaxY = isStatic ? 0 : backgroundY;
    // `will-change` costs GPU memory per layer, so only claim it while moving.
    const motionStyle = isStatic
        ? {}
        : { willChange: "transform", backfaceVisibility: "hidden" };

    return (
        <section
            id={id}
            // Assign the forwarded ref here, and the internal ref for framer-motion
            ref={(node) => {
                internalRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            }}
            className={`relative h-screen overflow-hidden ${className || ''}`}
        >
            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    y: parallaxY,
                    // Use a smaller scale to prevent the background from being "too big"
                    // while still ensuring it covers the area during transformation.
                    scale: 1,
                    // Keep the (expensive to rasterize) image on its own compositor layer so
                    // scrolling only recomposites it instead of repainting it.
                    ...motionStyle,
                }}
            />

            {/* Animated artwork lives on a separate transparent layer that shares the same
                parallax offset. Its repaints never invalidate the background image above.
                The SVG uses preserveAspectRatio="xMidYMid slice", which matches
                background-size: cover / background-position: center exactly. */}
            {overlaySvg && (
                <motion.div
                    className="absolute inset-0 z-[5] [&>svg]:h-full [&>svg]:w-full"
                    aria-hidden="true"
                    style={{ y: parallaxY, ...motionStyle }}
                    dangerouslySetInnerHTML={{ __html: overlaySvg }}
                />
            )}

            <div className={`absolute inset-0 z-10 ${gradientClass || 'bg-black/60'}`} />

            {particles && <div className="absolute inset-0 z-[15]"><SakuraPetals /></div>}

            <div className="relative z-20 w-full h-full overflow-y-auto text-white">
                {/* This inner flexbox centers the content vertically. 
                    If content is taller than the viewport, `min-h-full` allows it to expand,
                    and the parent's `overflow-y-auto` creates a scrollbar. */}
                <div className="flex min-h-full w-full items-center justify-center">
                    <div className="w-full text-center">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
});

export default ParallaxSection;

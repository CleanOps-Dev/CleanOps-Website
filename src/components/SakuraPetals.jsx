// src/components/SakuraPetals.jsx

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

// Purely decorative ambient effect echoing the cherry blossoms in the hero background.
export default function SakuraPetals({ count = 18 }) {
    const prefersReducedMotion = useReducedMotion();
    const petals = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 9,
        fallDuration: 9 + Math.random() * 7,
        swayDuration: 3 + Math.random() * 3,
        delay: -(Math.random() * 15),
        opacity: 0.35 + Math.random() * 0.45,
        sway: 20 + Math.random() * 40,
    })), [count]);

    // Falling petals are pure decoration, so drop them entirely rather than
    // freezing them mid-air when someone has asked for less motion.
    if (prefersReducedMotion) {
        return null;
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {petals.map((p) => (
                // Fall and sway are split across two elements because both are transforms
                // and would otherwise overwrite each other. Keeping them as transforms
                // (rather than animating `top`) keeps the petals off the layout path.
                <span
                    key={p.id}
                    className="absolute block will-change-transform"
                    style={{
                        left: `${p.left}%`,
                        top: '-8%',
                        animation: `sakura-fall ${p.fallDuration}s linear ${p.delay}s infinite`,
                    }}
                >
                    <span
                        className="block rounded-bl-full rounded-tr-full bg-gradient-to-br from-pink-200 to-pink-400 will-change-transform"
                        style={{
                            width: p.size,
                            height: p.size * 0.8,
                            opacity: p.opacity,
                            animation: `sakura-sway ${p.swayDuration}s ease-in-out ${p.delay}s infinite`,
                            '--sway': `${p.sway}px`,
                        }}
                    />
                </span>
            ))}
        </div>
    );
}

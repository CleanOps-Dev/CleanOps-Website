// src/components/SakuraPetals.jsx

import { useMemo } from 'react';

// Purely decorative ambient effect echoing the cherry blossoms in the hero background.
export default function SakuraPetals({ count = 18 }) {
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

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {petals.map((p) => (
                <span
                    key={p.id}
                    className="absolute block rounded-bl-full rounded-tr-full bg-gradient-to-br from-pink-200 to-pink-400"
                    style={{
                        left: `${p.left}%`,
                        top: '-8%',
                        width: p.size,
                        height: p.size * 0.8,
                        opacity: p.opacity,
                        animation: `sakura-fall ${p.fallDuration}s linear ${p.delay}s infinite, sakura-sway ${p.swayDuration}s ease-in-out ${p.delay}s infinite`,
                        '--sway': `${p.sway}px`,
                    }}
                />
            ))}
        </div>
    );
}

// src/hooks/usePointerDevice.js
import { useState, useEffect } from 'react';

// `'ontouchstart' in window` is true in Chromium on plain desktop Windows, so
// feature-detecting touch that way silently misclassifies ordinary desktops as
// phones. Ask about the input device instead: `hover: hover` plus
// `pointer: fine` is a mouse or trackpad, which is what hover-reveal controls
// and click targets actually depend on.
const QUERY = '(hover: hover) and (pointer: fine)';

const check = () => typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(QUERY).matches;

export const usePointerDevice = () => {
    const [hasPointer, setHasPointer] = useState(check);

    useEffect(() => {
        const mql = window.matchMedia(QUERY);
        const onChange = () => setHasPointer(mql.matches);

        onChange();

        // Safari only gained addEventListener on MediaQueryList in 14.
        if (mql.addEventListener) {
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        }
        mql.addListener(onChange);
        return () => mql.removeListener(onChange);
    }, []);

    return hasPointer;
};

// src/components/ImageGallery.jsx

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
// Import required Swiper modules
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';

// Import the lightbox and its base styles
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

import { usePointerDevice } from '../hooks/usePointerDevice';

const galleryImages = [
    `${import.meta.env.BASE_URL}img/gallery-1.jpg`,
    `${import.meta.env.BASE_URL}img/gallery-2.jpg`,
    `${import.meta.env.BASE_URL}img/gallery-3.jpg`,
    `${import.meta.env.BASE_URL}img/gallery-4.jpg`,
    `${import.meta.env.BASE_URL}img/gallery-5.jpg`,
    `${import.meta.env.BASE_URL}img/gallery-6.jpg`,
];

// Prepare slides for the lightbox
const lightboxSlides = galleryImages.map(src => ({ src }));

export default function ImageGallery() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiper, setSwiper] = useState(null);

    // Arrows are a hover-reveal control, so they belong to devices that can
    // hover. Everywhere else the slides are swipeable and tap to open fullscreen.
    const hasPointer = usePointerDevice();

    const handleImageClick = (index) => {
        if (hasPointer) return;

        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // This effect now robustly manages browser history for the lightbox.
    useEffect(() => {
        // This function handles the 'popstate' event (e.g., browser back button).
        const onPopState = () => {
            setLightboxOpen(false);
        };

        if (lightboxOpen) {
            // When the lightbox opens, push a new state to the history.
            window.history.pushState({ lightbox: "open" }, "");
            window.addEventListener('popstate', onPopState);
        }

        // The cleanup function runs when the component unmounts or `lightboxOpen` changes.
        return () => {
            window.removeEventListener('popstate', onPopState);
            // If the lightbox was closed via the 'X' button, the history state will
            // still be our lightbox state. We must go back to keep the history in sync.
            // This runs after React has removed the lightbox, avoiding the scroll jump.
            if (window.history.state?.lightbox === "open") {
                window.history.back();
            }
        };
    }, [lightboxOpen]);

    // This handler now directly updates the state. The `useEffect` handles the history.
    const handleLightboxClose = () => {
        setLightboxOpen(false);
    };

    return (
        <>
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                {/* Reproduces the old SVG/foreignObject geometry without the
                    wrapper itself -- that wrapper is what broke `:hover` and hid
                    the arrows.

                    The original was an `<svg width="80%" height="80%">` whose
                    1600x900 contents were fitted with `meet`, which worked out to
                    a frame 64% of the container width (80% of 80%) inside a 16:9
                    box at 80% width. Both nestings matter: the outer one sets the
                    height the heading is laid out against, the inner one sets the
                    frame. Phones get the full width instead, which the old 80%
                    only wasted. */}
                <div className="grid w-full place-items-center md:aspect-video md:w-4/5">
                    <div className="group relative aspect-video w-full overflow-hidden rounded-lg border-2 border-neutral-700/50 shadow-2xl md:w-4/5">
                    <Swiper
                        className="mySwiper h-full w-full"
                        modules={[Pagination, Navigation, Autoplay, EffectFade]}
                        navigation={hasPointer}
                        pagination={hasPointer ? { clickable: true } : false}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        speed={1000}
                        loop={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        onSwiper={setSwiper}
                        onSlideChange={(s) => setActiveIndex(s.realIndex)}
                    >
                        {galleryImages.map((src, index) => (
                            <SwiperSlide
                                key={index}
                                className={hasPointer ? '' : 'cursor-pointer'}
                                onClick={() => handleImageClick(index)}
                            >
                                <img
                                    src={src}
                                    alt={`Clean Ops Gallery Image ${index + 1}`}
                                    className="h-full w-full select-none object-cover"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                />
                            </SwiperSlide>
                        ))}
                        </Swiper>
                    </div>
                </div>

                {/* Touch devices get no arrows and no hover affordance. Thumbnails
                    replace both, and use up the vertical room a phone leaves over
                    once a 16:9 frame has taken its width. */}
                {!hasPointer && (
                    <>
                        <div className="grid w-full grid-cols-3 gap-2">
                            {galleryImages.map((src, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Show image ${index + 1}`}
                                    aria-current={index === activeIndex}
                                    onClick={() => swiper?.slideToLoop(index)}
                                    className={`aspect-video w-full overflow-hidden rounded border transition-opacity ${
                                        index === activeIndex
                                            ? 'border-brand-purple opacity-100'
                                            : 'border-neutral-700/60 opacity-50'
                                    }`}
                                >
                                    <img src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-300/80">
                            <span className="tabular-nums">{activeIndex + 1} / {galleryImages.length}</span>
                            <span className="mx-2 text-neutral-500">&middot;</span>
                            Tap to enlarge
                        </p>
                    </>
                )}
            </div>

            {/* Fullscreen viewing is the touch equivalent of the desktop hover controls. */}
            {!hasPointer && (
                <Lightbox
                    open={lightboxOpen}
                    close={handleLightboxClose}
                    slides={lightboxSlides}
                    index={lightboxIndex}
                    plugins={[Counter, Zoom]}
                    counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
                    zoom={{ maxZoomPixelRatio: 3, doubleTapDelay: 250 }}
                    carousel={{ finite: false, padding: 0 }}
                    controller={{ closeOnBackdropClick: true }}
                    styles={{ container: { backgroundColor: 'rgba(9, 6, 14, .96)' } }}
                />
            )}
        </>
    );
}

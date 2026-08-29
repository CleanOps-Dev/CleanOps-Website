// src/components/FeatureMosaicGrid.jsx

const TILES = [
    { file: 'bg-players.jpg', rotate: -2 },
    { file: 'bg-sessions.jpg', rotate: 1.5 },
    { file: 'p2p-1.jpg', rotate: -1.5 },
    { file: 'bg-tools.jpg', rotate: 2 },
    { file: 'bg-settings.jpg', rotate: -1 },
    { file: 'bg-logs.jpg', rotate: 1.8 },
];

// A responsive wall of real Clean Ops UI panels: real <img> tiles in a CSS
// grid (so it always fills the section without background-size cropping),
// styled as distinct, slightly-askew framed cards like a photo wall.
export default function FeatureMosaicGrid() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-10 md:gap-16">
                {TILES.map(({ file, rotate }) => (
                    <div
                        key={file}
                        className="relative aspect-[3/2] rounded-xl overflow-hidden border border-brand-purple/40 shadow-lg"
                        style={{ transform: `rotate(${rotate}deg)`, width: 'clamp(340px, 36vw, 680px)' }}
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}img/${file}`}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-brand-purple-dark/55" />
                    </div>
                ))}
            </div>
        </div>
    );
}

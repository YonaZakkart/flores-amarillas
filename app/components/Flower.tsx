interface FlowerProps {
    x: number;
    y: number;
    scale?: number;
    swayDelay?: number;
}

export default function Flower({ x, y, scale = 1, swayDelay = 0 }: FlowerProps) {
    const petals = Array.from({ length: 12 }, (_, i) => `p-${i + 1}`);

    return (
        <div
            className="flower-wrapper"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                '--flower-scale': scale,
            } as React.CSSProperties}
        >
            <div
                className="flower"
                style={{ '--sway-delay': `${swayDelay}s` } as React.CSSProperties}
            >
                <div className="stem">
                    <div className="leaf leaf-left"></div>
                    <div className="leaf leaf-right"></div>
                </div>

                {petals.map((petalClass, index) => (
                    <div key={index} className={`petal ${petalClass}`}></div>
                ))}

                <div className="flower-center"></div>
            </div>
        </div>
    );
}
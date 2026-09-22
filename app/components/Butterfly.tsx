interface ButterflyProps {
  x: number;
  y: number;
  flyDuration?: number;
}

export default function Butterfly({ x, y, flyDuration = 12 }: ButterflyProps) {
  return (
    <div
      className="butterfly"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        '--fly-duration': `${flyDuration}s`,
      } as React.CSSProperties}
    >
      <div className="wing wing-left"></div>
      <div className="wing wing-right"></div>
    </div>
  );
}
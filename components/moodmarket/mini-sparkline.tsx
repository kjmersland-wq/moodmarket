type MiniSparklineProps = {
  points: number[];
  className?: string;
};

export function MiniSparkline({ points, className }: MiniSparklineProps) {
  if (points.length < 2) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const spread = max - min || 1;
  const width = 120;
  const height = 44;

  const mapped = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point - min) / spread) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden>
      <polyline points={mapped} stroke="url(#spark-gradient)" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="spark-gradient" x1="0" y1="0" x2="120" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

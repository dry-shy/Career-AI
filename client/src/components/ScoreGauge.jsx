export default function ScoreGauge({ score = 0, label = 'Score', size = 140, color = '#ff6b35' }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    if (s >= 40) return '#ff6b35';
    return '#ef4444';
  };

  const strokeColor = color === 'auto' ? getColor(clampedScore) : color;

  const getGrade = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 75) return 'Good';
    if (s >= 60) return 'Average';
    if (s >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="score-gauge-container">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${strokeColor}66)` }}
          />
        </svg>
        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="score-value" style={{ fontSize: size > 120 ? 28 : 20, color: strokeColor }}>{clampedScore}</div>
          <div className="score-label" style={{ fontSize: 11 }}>/100</div>
        </div>
      </div>
      <div className="font-bold" style={{ color: strokeColor }}>{getGrade(clampedScore)}</div>
      <div className="text-secondary text-sm">{label}</div>
    </div>
  );
}

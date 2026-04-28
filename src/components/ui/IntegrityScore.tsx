import clsx from 'clsx';

interface IntegrityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getColor(score: number) {
  if (score >= 75) return { stroke: '#22c55e', text: 'text-[#16a34a]',  label: 'TRUSTED',  labelColor: 'text-[#16a34a]' };
  if (score >= 50) return { stroke: '#eab308', text: 'text-yellow-500', label: 'MODERATE', labelColor: 'text-yellow-500' };
  if (score >= 25) return { stroke: '#f97316', text: 'text-[#ea580c]', label: 'AT RISK',  labelColor: 'text-[#ea580c]' };
  return           { stroke: '#ef4444', text: 'text-[#dc2626]',    label: 'CRITICAL', labelColor: 'text-[#dc2626]' };
}

export function IntegrityScore({ score, size = 'md', showLabel = true }: IntegrityScoreProps) {
  const { stroke, text, label, labelColor } = getColor(score);
  const radius = size === 'sm' ? 16 : size === 'lg' ? 34 : 24;
  const strokeW = size === 'sm' ? 2.5 : 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dim = (radius + strokeW) * 2 + 4;
  const center = dim / 2;
  const fontSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xl' : 'text-xs';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          {/* Track */}
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#0f1e35" strokeWidth={strokeW} />
          {/* Progress */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            strokeWidth={strokeW}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            stroke={stroke}
            style={{ transition: 'stroke-dashoffset 0.7s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={clsx('font-bold font-mono', fontSize, text)}>{score}</span>
        </div>
      </div>
      {showLabel && (
        <span className={clsx('text-[9px] font-bold tracking-[0.15em] uppercase', labelColor)}>{label}</span>
      )}
    </div>
  );
}

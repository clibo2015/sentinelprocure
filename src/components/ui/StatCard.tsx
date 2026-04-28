import type { ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  color: 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'yellow' | 'gold';
}

const colorMap = {
  red:    { icon: 'text-[#dc2626]', accent: 'border-[#fee2e2]', iconBg: 'bg-[#fee2e2]' },
  orange: { icon: 'text-[#ea580c]', accent: 'border-[#ffedd5]', iconBg: 'bg-[#ffedd5]' },
  blue:   { icon: 'text-[#0284c7]', accent: 'border-[#e0f2fe]', iconBg: 'bg-[#e0f2fe]' },
  green:  { icon: 'text-[#16a34a]', accent: 'border-[#dcfce7]', iconBg: 'bg-[#dcfce7]' },
  purple: { icon: 'text-[#9333ea]', accent: 'border-[#f3e8ff]', iconBg: 'bg-[#f3e8ff]' },
  yellow: { icon: 'text-[#ca8a04]', accent: 'border-[#fef08a]', iconBg: 'bg-[#fef08a]' },
  gold:   { icon: 'text-[#ca8a04]', accent: 'border-[#fef08a]', iconBg: 'bg-[#fef08a]' },
};

export function StatCard({ title, value, subtitle, icon, trend, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={clsx('bg-white border border-[#e2e8f0] rounded-sm p-4 flex items-start gap-3')}>
      <div className={clsx('p-2 rounded-sm shrink-0', c.iconBg, c.icon)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#64748b] text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 leading-tight">{title}</p>
        <p className="text-[#0f172a] font-bold text-xl leading-none mb-1">{value}</p>
        {subtitle && <p className="text-[#334155] text-[11px] leading-tight">{subtitle}</p>}
        {trend && (
          <p className={clsx('text-[10px] font-semibold mt-1.5 flex items-center gap-1',
            trend.positive ? 'text-[#16a34a]' : 'text-[#dc2626]'
          )}>
            <span>{trend.positive ? '▲' : '▼'}</span>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}

import clsx from 'clsx';
import type { RiskLevel, TenderStatus } from '../../data/mockData';

interface BadgeProps {
  label: string;
  variant?: 'risk' | 'status' | 'default';
  riskLevel?: RiskLevel;
  status?: TenderStatus | string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const riskColors: Record<RiskLevel, string> = {
  CRITICAL: 'bg-red-950/80 text-[#dc2626] border border-red-900/60',
  HIGH:     'bg-orange-950/80 text-[#ea580c] border border-orange-900/60',
  MEDIUM:   'bg-yellow-950/80 text-yellow-500 border border-yellow-900/60',
  LOW:      'bg-green-950/80 text-[#16a34a] border border-green-900/60',
};

const riskDots: Record<RiskLevel, string> = {
  CRITICAL: 'bg-red-500 pulse-critical',
  HIGH:     'bg-orange-500',
  MEDIUM:   'bg-yellow-500',
  LOW:      'bg-green-500',
};

const statusColors: Record<string, string> = {
  FLAGGED:              'bg-red-950/80 text-[#dc2626] border border-red-900/60',
  SUSPENDED:            'bg-red-950/80 text-red-300 border border-red-900/80',
  UNDER_REVIEW:         'bg-yellow-950/80 text-yellow-500 border border-yellow-900/60',
  CLEARED:              'bg-green-950/80 text-[#16a34a] border border-green-900/60',
  AWARDED:              'bg-blue-950/80 text-blue-400 border border-blue-900/60',
  OPEN:                 'bg-red-950/80 text-[#dc2626] border border-red-900/60',
  INVESTIGATING:        'bg-yellow-950/80 text-yellow-500 border border-yellow-900/60',
  ESCALATED:            'bg-purple-950/80 text-purple-400 border border-purple-900/60',
  RESOLVED:             'bg-green-950/80 text-[#16a34a] border border-green-900/60',
  TRIAGED:              'bg-blue-950/80 text-blue-400 border border-blue-900/60',
  CLOSED:               'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]',
  ACTIVE:               'bg-green-950/80 text-[#16a34a] border border-green-900/60',
  IDLE:                 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]',
  INTERVENING:          'bg-orange-950/80 text-[#ea580c] border border-orange-900/60',
  COMPLIANT:            'bg-green-950/80 text-[#16a34a] border border-green-900/60',
  UNDER_INVESTIGATION:  'bg-orange-950/80 text-[#ea580c] border border-orange-900/60',
  BLACKLISTED:          'bg-red-950/80 text-red-300 border border-red-900/80',
};

export function Badge({ label, variant = 'default', riskLevel, status, size = 'sm', dot = false }: BadgeProps) {
  const sizeClass = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5 tracking-[0.08em]'
    : 'text-[11px] px-2 py-0.5 tracking-[0.08em]';

  let colorClass = 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]';
  let dotColor = 'bg-[#4a6a8a]';

  if (variant === 'risk' && riskLevel) {
    colorClass = riskColors[riskLevel];
    dotColor = riskDots[riskLevel];
  }
  if (variant === 'status' && status) {
    colorClass = statusColors[status] ?? colorClass;
  }

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 rounded-sm font-semibold uppercase',
      sizeClass, colorClass
    )}>
      {dot && <span className={clsx('w-1 h-1 rounded-full shrink-0', dotColor)} />}
      {label}
    </span>
  );
}

import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'none';
  variant?: 'default' | 'inset' | 'alert';
}

const glowMap = {
  red:    'border-red-900/60',
  orange: 'border-orange-900/50',
  blue:   'border-[#cbd5e1]/60',
  green:  'border-green-900/50',
  purple: 'border-purple-900/50',
  none:   'border-[#e2e8f0]',
};

const variantMap = {
  default: 'bg-white',
  inset:   'bg-[#f8fafc]',
  alert:   'bg-[#0d0a0a]',
};

export function Card({ children, className, glow = 'none', variant = 'default' }: CardProps) {
  return (
    <div className={clsx(
      'border rounded-sm',
      glowMap[glow],
      variantMap[variant],
      className
    )}>
      {children}
    </div>
  );
}

/* Reusable section header inside a card */
export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between px-4 py-3 border-b border-[#e2e8f0]">
      <div>
        <p className="text-[#0f172a] text-[13px] font-semibold tracking-tight">{title}</p>
        {subtitle && <p className="text-[#64748b] text-[11px] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

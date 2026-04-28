import clsx from 'clsx';
import {
  LayoutDashboard, AlertTriangle, FileSearch, Users, Bot,
  MessageSquareWarning, MapPin, Shield, Radio,
  TrendingUp, Network, Upload, Siren, Eye,
  Lock, UserX, GitBranch, Zap, Link, Monitor, DollarSign, ShieldCheck, Database, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rolePageAccess } from '../data/seedUsers';

export type Page =
  | 'dashboard'
  | 'red-flags'
  | 'tenders'
  | 'vendors'
  | 'price-benchmark'
  | 'ownership-graph'
  | 'bid-portal'
  | 'agents'
  | 'whistleblower'
  | 'contracts'
  | 'enforcement'
  | 'executive'
  | 'transparency'
  | 'access-control'
  | 'conflict-of-interest'
  | 'variation-orders'
  | 'emergency-procurement'
  | 'subcontractor-chain'
  | 'insider-threat'
  | 'financial-flow'
  | 'award-enforcement'
  | 'supplier-intelligence';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  layer?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard',            label: 'Command Centre',         icon: <LayoutDashboard size={15} /> },
  { id: 'red-flags',            label: 'Red Flag Alerts',        icon: <AlertTriangle size={15} />,       badge: 6,  layer: 'Intelligence Layer' },
  { id: 'tenders',              label: 'Tender Monitor',         icon: <FileSearch size={15} />,                     layer: 'Intelligence Layer' },
  { id: 'vendors',              label: 'Vendor Registry',        icon: <Users size={15} />,                          layer: 'Intelligence Layer' },
  { id: 'price-benchmark',      label: 'Price Benchmarking',     icon: <TrendingUp size={15} />,          badge: 3,  layer: 'Intelligence Layer' },
  { id: 'ownership-graph',      label: 'Ownership Graphs',       icon: <Network size={15} />,                        layer: 'Intelligence Layer' },
  { id: 'bid-portal',           label: 'Bid Portal',             icon: <Upload size={15} />,                         layer: 'Agentic Layer' },
  { id: 'agents',               label: 'Agentic Activity',       icon: <Bot size={15} />,                 badge: 3,  layer: 'Agentic Layer' },
  { id: 'whistleblower',        label: 'Whistleblower Triage',   icon: <MessageSquareWarning size={15} />, badge: 2, layer: 'Agentic Layer' },
  { id: 'contracts',            label: 'Contract Monitor',       icon: <MapPin size={15} />,                         layer: 'Transparency Layer' },
  { id: 'enforcement',          label: 'Enforcement Feed',       icon: <Siren size={15} />,               badge: 5,  layer: 'Transparency Layer' },
  { id: 'executive',            label: 'Executive Oversight',    icon: <Eye size={15} />,                            layer: 'Transparency Layer' },
  { id: 'transparency',         label: 'Citizen Portal',         icon: <Shield size={15} />,                         layer: 'Transparency Layer' },
  { id: 'access-control',       label: 'Access Control',         icon: <Lock size={15} />,                badge: 3,  layer: 'Security Layer' },
  { id: 'conflict-of-interest', label: 'Conflict of Interest',   icon: <UserX size={15} />,               badge: 3,  layer: 'Security Layer' },
  { id: 'variation-orders',     label: 'Variation Orders',       icon: <GitBranch size={15} />,           badge: 1,  layer: 'Security Layer' },
  { id: 'emergency-procurement',label: 'Emergency Procurement',  icon: <Zap size={15} />,                 badge: 1,  layer: 'Security Layer' },
  { id: 'subcontractor-chain',  label: 'Subcontractor Chain',    icon: <Link size={15} />,                           layer: 'Security Layer' },
  { id: 'insider-threat',       label: 'Insider Threat',         icon: <Monitor size={15} />,             badge: 4,  layer: 'Security Layer' },
  { id: 'financial-flow',       label: 'Financial Flow',         icon: <DollarSign size={15} />,          badge: 1,  layer: 'Security Layer' },
  { id: 'award-enforcement',    label: 'Award Enforcement',      icon: <ShieldCheck size={15} />,         badge: 2,  layer: 'Security Layer' },
  { id: 'supplier-intelligence',label: 'Supplier Intelligence',  icon: <Database size={15} />,            badge: 3,  layer: 'Intelligence Layer' },
];

const layers = ['Intelligence Layer', 'Agentic Layer', 'Transparency Layer', 'Security Layer'];

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const allowedPages = rolePageAccess[user.role];
  const filterNavItems = (items: NavItem[]) => 
    items.filter(item => allowedPages === '*' || allowedPages.includes(item.id));

  return (
    <aside className="w-60 flex flex-col h-screen sticky top-0 bg-[#f8fafc] border-r border-[#e2e8f0]">

      {/* Identity block */}
      <div className="px-5 pt-5 pb-4 border-b border-[#e2e8f0]">
        {/* Government Logo */}
        <div className="mb-4">
          <img src="/prov-logo.png" alt="Provincial Treasury Logo" className="w-full h-auto object-contain" />
        </div>

        {/* System status */}
        <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded px-3 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[#0284c7] text-[10px] font-semibold uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-1.5">
              <Radio size={9} className="text-[#16a34a]" />
              <span className="text-[#16a34a] text-[10px] font-bold">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[#334155] text-[10px]">All 7 agents operational</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-gov py-3">
        {filterNavItems([navItems[0]]).length > 0 && (
          <div className="px-3 mb-1">
            <NavButton item={navItems[0]} active={activePage === 'dashboard'} onNavigate={onNavigate} />
          </div>
        )}

        {layers.map(layer => {
          const items = filterNavItems(navItems.filter(i => i.layer === layer));
          if (items.length === 0) return null;
          return (
            <div key={layer} className="mb-1">
              <div className="px-5 py-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-[#e2e8f0]" />
                <span className="text-[#334155] text-[9px] font-bold uppercase tracking-[0.2em] shrink-0">{layer}</span>
                <div className="h-px flex-1 bg-[#e2e8f0]" />
              </div>
              <div className="px-3 space-y-0.5">
                {items.map(item => (
                  <NavButton key={item.id} item={item} active={activePage === item.id} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Compliance & User footer */}
      <div className="px-4 py-3 border-t border-[#e2e8f0] bg-white">
        
        {/* User Profile */}
        <div className="flex items-center justify-between mb-3 bg-[#f8fafc] border border-[#e2e8f0] p-2 rounded">
          <div className="overflow-hidden">
            <p className="text-[#0f172a] text-[11px] font-bold truncate">{user.name}</p>
            <p className="text-[#64748b] text-[9px] font-mono truncate">{user.department}</p>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-[#64748b] hover:text-[#dc2626] hover:bg-red-50 rounded transition-colors"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>

        <div className="text-[10px] text-[#334155] space-y-0.5 leading-relaxed">
          <p className="text-[#3a6a9b] font-semibold">Regulatory Alignment</p>
          <p>Public Procurement Act 28 of 2024</p>
          <p>Zondo Commission Recommendations</p>
          <p>POPIA · PPPFA · B-BBEE Act</p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
          <img src="/sa-flag.png" alt="South Africa Flag" className="w-full h-auto object-cover rounded-sm shadow-sm opacity-90" />
        </div>
      </div>
    </aside>
  );
}

function NavButton({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate: (p: Page) => void }) {
  return (
    <button
      onClick={() => onNavigate(item.id)}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded text-[13px] font-medium transition-all duration-150 group relative',
        active
          ? 'bg-[#14532d] text-white border-l-2 border-[#14532d] pl-[10px]'
          : 'text-[#64748b] hover:text-[#334155] hover:bg-[#f1f5f9] border-l-2 border-transparent pl-[10px]'
      )}
    >
      <span className={clsx(
        'shrink-0 transition-colors',
        active ? 'text-white' : 'text-[#334155] group-hover:text-[#0284c7]'
      )}>
        {item.icon}
      </span>
      <span className="flex-1 text-left leading-tight">{item.label}</span>
      {item.badge && (
        <span className={clsx(
          'text-[10px] font-bold rounded px-1.5 py-0.5 min-w-[18px] text-center',
          active ? 'bg-white/20 text-white' : 'bg-[#dc2626] text-white'
        )}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

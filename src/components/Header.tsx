import { Bell, Search, Shield, ChevronDown, Wifi } from 'lucide-react';
import type { Page } from './Sidebar';
import { useAuth } from '../context/AuthContext';

const pageTitles: Record<Page, { title: string; subtitle: string; ref: string }> = {
  dashboard:              { title: 'Command Centre',              subtitle: 'Western Cape procurement integrity overview',                     ref: 'WC/PT/CC/001' },
  'red-flags':            { title: 'Red Flag Alerts',             subtitle: 'Active anomalies requiring immediate attention',                 ref: 'WC/PT/RF/002' },
  tenders:                { title: 'Tender Monitor',              subtitle: 'Live procurement pipeline with AI risk scoring',                 ref: 'WC/PT/TM/003' },
  vendors:                { title: 'Vendor Registry',             subtitle: '360° supplier reputation and compliance view',                  ref: 'WC/PT/VR/004' },
  'price-benchmark':      { title: 'Price Benchmarking Engine',   subtitle: 'Real-time price anomaly detection — R80k knee guard prevention', ref: 'WC/PT/PB/005' },
  'ownership-graph':      { title: 'Ownership Graph Analysis',    subtitle: 'Deep beneficial ownership unmasking — fronting & PEP detection', ref: 'WC/PT/OG/006' },
  'bid-portal':           { title: 'Bid Submission Portal',       subtitle: 'End-to-end digital bid intake with AI validation pipeline',     ref: 'WC/PT/BP/007' },
  agents:                 { title: 'Agentic Activity Log',        subtitle: 'Autonomous AI agent interventions and audit trail',             ref: 'WC/PT/AA/008' },
  whistleblower:          { title: 'Whistleblower Triage',        subtitle: 'NLP-categorised anonymous tip management',                      ref: 'WC/PT/WT/009' },
  contracts:              { title: 'Contract Monitor',            subtitle: 'Post-award milestone and payment verification',                 ref: 'WC/PT/CM/010' },
  enforcement:            { title: 'Enforcement Feed',            subtitle: 'Direct SIU · Hawks · NPA · AGSA integration',                  ref: 'WC/PT/EF/011' },
  executive:              { title: 'Executive Oversight',         subtitle: 'Predictive analytics for the Provincial Government',            ref: 'WC/PT/EO/012' },
  transparency:           { title: 'Citizen Transparency Portal', subtitle: 'Public integrity scores for major infrastructure',              ref: 'WC/PT/CT/013' },
  'access-control':       { title: 'Access Control & RBAC',       subtitle: 'Role-based access, dual authorisation, MFA enforcement',        ref: 'WC/PT/AC/014' },
  'conflict-of-interest': { title: 'Conflict of Interest Monitor',subtitle: 'Evaluation committee screening — ownership graph cross-reference', ref: 'WC/PT/CI/015' },
  'variation-orders':     { title: 'Variation Order Monitor',     subtitle: 'Post-award VO tracking — cumulative limit enforcement',         ref: 'WC/PT/VO/016' },
  'emergency-procurement':{ title: 'Emergency Procurement',       subtitle: 'Fast-track with enhanced scrutiny — PPE 2020 prevention',       ref: 'WC/PT/EP/017' },
  'subcontractor-chain':  { title: 'Subcontractor Chain Monitor', subtitle: 'Full supply chain visibility — tier-2/3 entity screening',      ref: 'WC/PT/SC/018' },
  'insider-threat':       { title: 'Insider Threat Detection',    subtitle: 'All user actions monitored — anomalous behaviour flagged',      ref: 'WC/PT/IT/019' },
  'financial-flow':       { title: 'Financial Flow Monitor',      subtitle: 'FIC integration — post-payment kickback detection',             ref: 'WC/PT/FF/020' },
  'award-enforcement':    { title: 'Award Enforcement Engine',     subtitle: 'Hard locks — corrupt officials cannot ignore flags and award',   ref: 'WC/PT/AE/021' },
  'supplier-intelligence': { title: 'Supplier Intelligence',       subtitle: 'Deep forensic compliance across CIPC, SARS, CSD & B-BBEE',       ref: 'WC/PT/SI/022' },
};

interface HeaderProps {
  activePage: Page;
}

export function Header({ activePage }: HeaderProps) {
  const { user } = useAuth();
  const { title, subtitle, ref } = pageTitles[activePage];
  const now = new Date().toLocaleString('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Africa/Johannesburg',
  });

  return (
    <header className="bg-[#f8fafc] border-b border-[#e2e8f0] sticky top-0 z-20">
      {/* Classification bar */}
      <div className="classification-bar px-6 py-1 flex items-center justify-between">
        <span className="text-[#334155] text-[9px] font-bold uppercase tracking-[0.25em]">
          OFFICIAL · RESTRICTED · PROVINCIAL TREASURY · WESTERN CAPE GOVERNMENT
        </span>
        <span className="text-[#334155] text-[9px] font-mono">REF: {ref}</span>
      </div>

      {/* Main header */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Page title */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[#0f172a] font-bold text-base tracking-tight">{title}</h1>
              <span className="text-[10px] font-mono text-[#334155] bg-[#f1f5f9] border border-[#e2e8f0] px-1.5 py-0.5 rounded">
                v2.4.1
              </span>
            </div>
            <p className="text-[#64748b] text-[11px] mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#334155]" />
            <input
              type="text"
              placeholder="Search tenders, vendors, refs..."
              className="bg-[#f1f5f9] border border-[#e2e8f0] rounded px-2.5 pl-8 py-1.5 text-[12px] text-[#334155] placeholder-[#2a4a6b] focus:outline-none focus:border-[#cbd5e1] w-52 transition-colors"
            />
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded px-2.5 py-1.5">
            <Wifi size={11} className="text-[#16a34a]" />
            <span className="text-[#64748b] text-[11px] font-mono">{now} SAST</span>
          </div>

          {/* Alerts */}
          <button className="relative p-1.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded text-[#64748b] hover:text-[#0f172a] hover:border-[#cbd5e1] transition-colors">
            <Bell size={15} />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded px-2.5 py-1.5 hover:border-[#cbd5e1] transition-colors group">
            <div className="w-6 h-6 rounded bg-[#0c1e38] border border-[#cbd5e1] flex items-center justify-center">
              <Shield size={11} className="text-[#d4a843]" />
            </div>
            <div className="text-left max-w-[120px]">
              <p className="text-[#0f172a] text-[11px] font-semibold leading-tight truncate">{user?.name || 'Guest'}</p>
              <p className="text-[#334155] text-[10px] leading-tight truncate">{user?.department || 'Visitor'}</p>
            </div>
            <ChevronDown size={11} className="text-[#334155] group-hover:text-[#64748b] transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}

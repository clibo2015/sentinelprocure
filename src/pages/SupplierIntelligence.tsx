import { useState, useEffect, useMemo, Component, type ReactNode, type ErrorInfo } from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, Search,
  Database, TrendingUp, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useNavigation } from '../context/NavigationContext';

// ─── Data imports — all from leaf files only, NOT from mockData_index ─────────
// mockData_index does `export * from` all these files, so importing from both
// mockData_index AND the leaf files creates a circular dependency that causes
// silent runtime crashes. We import from leaf files only here.
import { allCIPCProfiles, getCIPCProfile } from '../data/mockData_cipc';
import { allSARSProfiles, getSARSProfile } from '../data/mockData_sars';
import { allCSDProfiles, getCSDProfile } from '../data/mockData_csd';
import { allBBBEEProfiles, getBBBEEProfile } from '../data/mockData_bbbee';
import { allETenders, blockchainAuditLedger, ficProfiles, getTendersBySupplier } from '../data/mockData_etender';
import { useScenario } from '../context/ScenarioContext';
import { type Vendor, type Tender } from '../data/mockData';
import { type BidSubmission } from '../data/extendedData';

// ─── Inline the two functions from mockData_index to avoid the circular dep ───
function buildSupplierDossier(csdSupplierNo: string, scenarioVendors: Vendor[] = []) {
  const csd = getCSDProfile(csdSupplierNo);
  const scenarioVendor = scenarioVendors.find(v => v.csdNumber === csdSupplierNo);
  
  if (!csd && !scenarioVendor) return null;
  
  // Create a composite view for scenario vendors or existing CSD
  const cipc = getCIPCProfile(csd?.cipc_reg_no || scenarioVendor?.cipcNumber || '');
  const sars = getSARSProfile(csdSupplierNo);
  const bbbee = getBBBEEProfile(csdSupplierNo);
  const tenders = getTendersBySupplier(csdSupplierNo);
  
  const reasons: string[] = [];
  let riskScore = scenarioVendor?.reputationScore ? (100 - scenarioVendor.reputationScore) : 0;
  
  if (scenarioVendor) {
    reasons.push(...scenarioVendor.flags);
  }
  
  if (sars?.tcs_status === 'non-compliant') { riskScore += 30; reasons.push('SARS non-compliant — tax clearance invalid'); }
  if (bbbee?.fronting_risk === 'CONFIRMED') { riskScore += 40; reasons.push('B-BBEE fronting confirmed — certificate fraudulent'); }
  else if (bbbee?.fronting_risk === 'HIGH') { riskScore += 20; reasons.push('B-BBEE fronting risk HIGH — under investigation'); }
  if (cipc?.shell_indicator) { riskScore += 25; reasons.push('Shell company indicator — no employees or physical operations'); }
  if (cipc?.pep_linked) { riskScore += 30; reasons.push('PEP-linked — beneficial owner connected to politically exposed person'); }
  if (csd?.status === 'Suspended') { riskScore += 35; reasons.push('CSD status SUSPENDED — ineligible for procurement'); }
  if (csd && !csd.eligible_to_bid) { riskScore += 20; reasons.push(...csd.ineligibility_reasons); }
  
  const composite_risk = riskScore >= 60 ? 'CRITICAL' : riskScore >= 40 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW';
  return { 
    csd_supplier_no: csdSupplierNo, 
    supplier_name: csd?.supplier_name || scenarioVendor?.name || 'Unknown', 
    cipc, sars, csd, bbbee, tenders, composite_risk, 
    composite_risk_reasons: reasons 
  };
}

// ─── Data Summary Helper ─────────────────────────────────────────────────────
function getMockDataSummary() {
  return {
    cipc: {
      total: allCIPCProfiles?.length || 0,
      shell_companies: allCIPCProfiles?.filter(c => c.shell_indicator).length || 0,
      pep_linked: allCIPCProfiles?.filter(c => c.pep_linked).length || 0
    },
    sars: {
      total: allSARSProfiles?.length || 0,
      non_compliant: allSARSProfiles?.filter(s => s.tcs_status === 'non-compliant').length || 0,
      high_risk: allSARSProfiles?.filter(s => s.financial_risk_score === 'high').length || 0
    },
    csd: {
      total: allCSDProfiles?.length || 0,
      verified: allCSDProfiles?.filter(c => c.status === 'Verified').length || 0,
      suspended: allCSDProfiles?.filter(c => c.status === 'Suspended').length || 0,
      ineligible: allCSDProfiles?.filter(c => !c.eligible_to_bid).length || 0
    },
    bbbee: {
      total: allBBBEEProfiles?.length || 0,
      fronting_confirmed: allBBBEEProfiles?.filter(b => b.fronting_risk === 'CONFIRMED').length || 0,
      fronting_high: allBBBEEProfiles?.filter(b => b.fronting_risk === 'HIGH').length || 0,
      unaccredited_agency: allBBBEEProfiles?.filter(b => !b.agency_accredited).length || 0
    },
    etenders: {
      total: allETenders?.length || 0,
      rigged: allETenders?.filter(t => t.ai_spec_rigging_detected).length || 0,
      critical: allETenders?.filter(t => t.ai_risk_level === 'CRITICAL').length || 0,
      blocked_bids: allETenders?.flatMap(t => t.bids || []).filter(b => b.recommended_action === 'Block').length || 0
    },
  };
}

type ActiveTab = 'overview' | 'cipc' | 'sars' | 'csd' | 'bbbee' | 'etenders' | 'ledger' | 'fic';

// ─── Error Boundary ───────────────────────────────────────────────────────────
class TabErrorBoundary extends Component<{ children: ReactNode; tab: string }, { error: string | null }> {
  constructor(props: { children: ReactNode; tab: string }) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('[SupplierIntelligence] crash in', this.props.tab, error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="bg-red-950/30 border border-red-900/50 rounded-sm p-6 space-y-2">
          <p className="text-[#dc2626] font-bold text-[13px]">Error in {this.props.tab} tab</p>
          <p className="text-[#dc2626]/70 text-[11px] font-mono break-all">{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function RiskPill({ level }: { level: string }) {
  const map: Record<string, string> = {
    CRITICAL: 'bg-red-950/60 text-[#dc2626] border-red-900/50',
    HIGH: 'bg-orange-950/60 text-[#ea580c] border-orange-900/50',
    MEDIUM: 'bg-yellow-950/60 text-[#ca8a04] border-yellow-900/50',
    LOW: 'bg-green-950/60 text-[#16a34a] border-green-900/50',
    high: 'bg-red-950/60 text-[#dc2626] border-red-900/50',
    medium: 'bg-yellow-950/60 text-[#ca8a04] border-yellow-900/50',
    low: 'bg-green-950/60 text-[#16a34a] border-green-900/50',
    CONFIRMED: 'bg-red-950/60 text-[#dc2626] border-red-900/50',
    NONE: 'bg-green-950/60 text-[#16a34a] border-green-900/50',
    sanctioned: 'bg-purple-950/60 text-purple-400 border-purple-900/50',
  };
  return <span className={'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm border ' + (map[level] ?? 'bg-[#e2e8f0] text-[#64748b] border-[#e2e8f0]')}>{level}</span>;
}

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? <CheckCircle size={13} className="text-[#16a34a] shrink-0" /> : <XCircle size={13} className="text-[#dc2626] shrink-0" />;
}

function SectionLabel({ text }: { text: string }) {
  return <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">{text}</p>;
}

function InfoRow({ label, value, mono = false, highlight = false }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-[#e2e8f0]">
      <span className="text-[#64748b] text-[11px] shrink-0">{label}</span>
      <span className={'text-[11px] text-right ' + (mono ? 'font-mono ' : '') + (highlight ? 'text-[#dc2626] font-semibold' : 'text-[#334155]')}>{value}</span>
    </div>
  );
}

function SourceBanner({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-sm px-4 py-2 text-[11px] text-[#64748b]">
      <span className="text-[#0284c7] font-semibold">{title}</span>{' '}{description}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const { scenarioData } = useScenario();
  const s = useMemo(() => getMockDataSummary(), []);
  
  // Adjust stats based on scenario
  const scenarioRiggedCount = scenarioData?.tenders?.filter((t: Tender) => t.riskLevel === 'CRITICAL').length || 0;
  
  const stats = [
    { label: 'CIPC Profiles', value: String(s.cipc.total), sub: `${s.cipc.shell_companies} shell companies`, color: 'text-[#0f172a]' },
    { label: 'SARS Non-Compliant', value: String(s.sars.non_compliant), sub: `of ${s.sars.total} profiles`, color: 'text-[#dc2626]' },
    { label: 'CSD Ineligible', value: String(s.csd.ineligible), sub: `of ${s.csd.total} suppliers`, color: 'text-[#ea580c]' },
    { label: 'B-BBEE Fronting', value: String(s.bbbee.fronting_confirmed), sub: `confirmed + ${s.bbbee.fronting_high} high risk`, color: 'text-[#dc2626]' },
    { label: 'Rigged Tenders', value: String(s.etenders.rigged + scenarioRiggedCount), sub: `of ${s.etenders.total + (scenarioData?.tenders?.length || 0)} tenders`, color: 'text-[#dc2626]' },
    { label: 'Bids Blocked', value: String(s.etenders.blocked_bids + (scenarioData?.bidSubmissions?.filter((b: BidSubmission) => b.status === 'REJECTED').length || 0)), sub: 'by AI price engine', color: 'text-[#ea580c]' },
  ];
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden border border-[#cbd5e1] rounded-sm bg-[#f8fafc] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#4a7ab5]" />
        <Database size={15} className="text-[#0284c7] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#0284c7] font-bold text-[12px] uppercase tracking-wide">High-Fidelity Mock Data — Interconnected Story</p>
          <p className="text-[#64748b] text-[11px] mt-0.5 leading-relaxed">
            John Doe controls CorruptCo, Inflated Goods, and Meridian Holdings — all sharing one address.
            Inflated Goods bids <span className="text-[#dc2626] font-semibold">R80,000 per knee guard</span> (retail: R320) on a rigged tender.
            HonestSupplies is the legitimate competitor excluded by spec rigging.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(st => (
          <div key={st.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${st.color}`}>{st.value}</p>
            <p className="text-[#334155] text-[11px] font-semibold mt-0.5">{st.label}</p>
            <p className="text-[#64748b] text-[10px] mt-0.5">{st.sub}</p>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader title="The Corruption Network" subtitle="Key entities identified for investigation in current workspace" />
        <div className="p-4 grid grid-cols-3 gap-4">
          {[
            ...(['MAAA0000002', 'MAAA0000003', 'MAAA0000004']),
            ...(scenarioData?.vendors?.map((v: Vendor) => v.csdNumber) || [])
          ].map((csdNo: string) => {
            const d = buildSupplierDossier(csdNo, scenarioData?.vendors);
            if (!d) return null;
            return (
              <div key={csdNo} className="bg-white border border-[#e2e8f0] rounded-sm p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[#0f172a] font-semibold text-[12px] leading-snug">{d.supplier_name}</p>
                  <RiskPill level={d.composite_risk} />
                </div>
                <p className="font-mono text-[#0284c7] text-[10px]">{csdNo}</p>
                <div className="space-y-1">
                  {d.composite_risk_reasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[10px] text-[#dc2626]">
                      <AlertTriangle size={10} className="shrink-0 mt-0.5" /><span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <CardHeader title="Legitimate Supplier" subtitle="HonestSupplies (Pty) Ltd — excluded by rigged specifications on NT001-2026-PPE" />
        <div className="p-4">
          {(() => {
            const d = buildSupplierDossier('MAAA0000001');
            if (!d) return <p className="text-[#64748b] text-[11px]">No data</p>;
            return (
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="text-[#0f172a] font-bold text-[14px]">{d.supplier_name}</p>
                    <RiskPill level={d.composite_risk} />
                  </div>
                  <p className="font-mono text-[#0284c7] text-[11px]">MAAA0000001 · CIPC: 2020/789012/07</p>
                  <p className="text-[#16a34a] text-[11px]">All compliance checks passed — SARS compliant, B-BBEE Level 1 verified, CSD Verified</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a]"><CheckCircle size={12} /> Tax Compliant</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a]"><CheckCircle size={12} /> B-BBEE Verified</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a]"><CheckCircle size={12} /> CSD Active</div>
                </div>
              </div>
            );
          })()}
        </div>
      </Card>
    </div>
  );
}

// ─── CIPC Tab ─────────────────────────────────────────────────────────────────
function CIPCTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const profiles = ['2015/123456/07', '2018/987654/07', '2019/112233/07', '2020/789012/07']
    .map(getCIPCProfile).filter(Boolean) as NonNullable<ReturnType<typeof getCIPCProfile>>[];
  return (
    <div className="space-y-3">
      <SourceBanner title="CIPC — Companies and Intellectual Property Commission" description="Company registration, director information, and beneficial ownership. Used by the Entity Resolution Engine to uncover hidden connections and fronting." />
      {profiles.map(p => (
        <Card key={p.company_reg_no} glow={p.shell_indicator ? 'red' : 'none'}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[#0f172a] font-bold text-[13px]">{p.company_name}</p>
                  {p.shell_indicator && <span className="text-[9px] font-bold text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1.5 py-0.5 rounded-sm">SHELL</span>}
                  {p.pep_linked && <span className="text-[9px] font-bold text-[#ea580c] bg-orange-950/50 border border-orange-900/40 px-1.5 py-0.5 rounded-sm">PEP LINKED</span>}
                </div>
                <p className="font-mono text-[#0284c7] text-[11px]">{p.company_reg_no} · Registered: {p.registration_date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={p.status} variant="status" status={p.status === 'Active' ? 'CLEARED' : 'SUSPENDED'} />
                <button onClick={() => setExpanded(expanded === p.company_reg_no ? null : p.company_reg_no)} className="text-[#334155] hover:text-[#0f172a] transition-colors">
                  {expanded === p.company_reg_no ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SectionLabel text="Directors" />
                {p.directors.map(d => (
                  <div key={d.id_number} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-sm p-2.5 mb-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[#0f172a] text-[12px] font-semibold">{d.full_name}</p>
                      <Badge label={d.status} variant="status" status={d.status === 'Active' ? 'CLEARED' : 'SUSPENDED'} />
                    </div>
                    <p className="font-mono text-[#64748b] text-[10px] mt-0.5">ID: {d.id_number}</p>
                    {d.linked_companies.length > 1 && <p className="text-[#ea580c] text-[10px] mt-1">⚠ Linked to {d.linked_companies.length} companies</p>}
                  </div>
                ))}
              </div>
              <div>
                <SectionLabel text="Beneficial Owners" />
                {p.beneficial_owners.map(o => (
                  <div key={o.id_number} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-sm p-2.5 mb-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[#0f172a] text-[12px] font-semibold">{o.full_name}</p>
                      <span className="font-mono font-bold text-[#0f172a] text-[12px]">{o.ownership_percentage}%</span>
                    </div>
                    <p className="font-mono text-[#64748b] text-[10px] mt-0.5">ID: {o.id_number} · Since: {o.date_of_ownership}</p>
                  </div>
                ))}
                <SectionLabel text="Registered Address" />
                <p className="text-[#334155] text-[11px]">{p.physical_address.street}, {p.physical_address.city}, {p.physical_address.province} {p.physical_address.postal_code}</p>
              </div>
            </div>
            {p.risk_flags.length > 0 && expanded === p.company_reg_no && (
              <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
                <SectionLabel text="Risk Flags" />
                <div className="space-y-1">
                  {p.risk_flags.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[#dc2626] bg-red-950/30 border border-red-900/40 px-2.5 py-1.5 rounded-sm">
                      <AlertTriangle size={11} className="shrink-0 mt-0.5" />{f}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {p.risk_flags.length > 0 && expanded !== p.company_reg_no && (
              <button onClick={() => setExpanded(p.company_reg_no)} className="mt-2 text-[10px] text-[#dc2626] hover:text-red-300 transition-colors">
                ▼ {p.risk_flags.length} risk flag{p.risk_flags.length !== 1 ? 's' : ''} — click to expand
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── SARS Tab ─────────────────────────────────────────────────────────────────
function SARSTab() {
  const profiles = ['MAAA0000001', 'MAAA0000002', 'MAAA0000003', 'MAAA0000004']
    .map(getSARSProfile).filter(Boolean) as NonNullable<ReturnType<typeof getSARSProfile>>[];
  return (
    <div className="space-y-3">
      <SourceBanner title="SARS — South African Revenue Service" description="Tax Compliance Status (TCS), VAT registration, and financial health indicators. Linked to CSD profiles via supplier number." />
      <Card>
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>Supplier</th><th>CSD No.</th><th>TCS Status</th><th>VAT</th><th>PAYE</th><th>Financial Risk</th><th>Last Filing</th><th>Outstanding Returns</th></tr></thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.csd_supplier_no} className={p.tcs_status === 'non-compliant' ? 'bg-red-950/10' : ''}>
                  <td><span className="text-[#0f172a] font-semibold text-[12px]">{p.supplier_name}</span></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{p.csd_supplier_no}</span></td>
                  <td>
                    <div className={'flex items-center gap-1.5 text-[11px] font-semibold ' + (p.tcs_status === 'compliant' ? 'text-[#16a34a]' : 'text-[#dc2626]')}>
                      <StatusIcon ok={p.tcs_status === 'compliant'} />{p.tcs_status.toUpperCase()}
                    </div>
                  </td>
                  <td><StatusIcon ok={p.vat_registered} /></td>
                  <td><StatusIcon ok={p.paye_registered} /></td>
                  <td><RiskPill level={p.financial_risk_score} /></td>
                  <td><span className="font-mono text-[#64748b] text-[11px]">{p.last_filing_date}</span></td>
                  <td>{p.outstanding_returns > 0 ? <span className="text-[#dc2626] font-mono font-bold text-[12px]">{p.outstanding_returns} returns</span> : <span className="text-[#16a34a] text-[11px]">None</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {profiles.filter(p => p.risk_notes.length > 0).map(p => (
        <Card key={p.csd_supplier_no} glow="red">
          <div className="p-4">
            <p className="text-[#dc2626] font-bold text-[12px] mb-2">{p.supplier_name} — SARS Risk Notes</p>
            <div className="space-y-1">
              {p.risk_notes.map((n, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[#dc2626]">
                  <AlertTriangle size={11} className="shrink-0 mt-0.5" />{n}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── CSD Tab ──────────────────────────────────────────────────────────────────
function CSDTab() {
  return (
    <div className="space-y-3">
      <SourceBanner title="CSD — Central Supplier Database" description="Central hub linking CIPC and SARS data. Determines supplier eligibility for government procurement." />
      <Card>
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>Supplier</th><th>CSD No.</th><th>Status</th><th>Tax ✓</th><th>B-BBEE ✓</th><th>Bank ✓</th><th>B-BBEE Level</th><th>Eligible</th><th>Risk</th></tr></thead>
            <tbody>
              {allCSDProfiles.map(p => (
                <tr key={p.csd_supplier_no} className={!p.eligible_to_bid ? 'bg-red-950/10' : ''}>
                  <td><p className="text-[#0f172a] font-semibold text-[12px]">{p.supplier_name}</p><p className="font-mono text-[#64748b] text-[10px]">{p.cipc_reg_no}</p></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{p.csd_supplier_no}</span></td>
                  <td><Badge label={p.status} variant="status" status={p.status === 'Verified' ? 'CLEARED' : p.status === 'Suspended' ? 'SUSPENDED' : 'UNDER_REVIEW'} /></td>
                  <td><StatusIcon ok={p.verification_status.tax_compliance === 'Verified'} /></td>
                  <td><StatusIcon ok={p.verification_status.b_bbee === 'Verified'} /></td>
                  <td><StatusIcon ok={p.bank_details.account_verified} /></td>
                  <td><span className="font-mono text-[#0f172a] text-[11px]">{p.b_bbee_level}</span></td>
                  <td>
                    <div className={'flex items-center gap-1.5 text-[11px] font-semibold ' + (p.eligible_to_bid ? 'text-[#16a34a]' : 'text-[#dc2626]')}>
                      <StatusIcon ok={p.eligible_to_bid} />{p.eligible_to_bid ? 'YES' : 'NO'}
                    </div>
                  </td>
                  <td><RiskPill level={p.overall_risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {allCSDProfiles.filter(p => p.ineligibility_reasons.length > 0).map(p => (
        <Card key={p.csd_supplier_no} glow="red">
          <div className="p-4">
            <p className="text-[#dc2626] font-bold text-[12px] mb-2">{p.supplier_name} — Ineligibility Reasons</p>
            <div className="space-y-1">
              {p.ineligibility_reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[#dc2626]">
                  <AlertTriangle size={11} className="shrink-0 mt-0.5" />{r}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── B-BBEE Tab ───────────────────────────────────────────────────────────────
function BBBEETab() {
  const profiles = ['MAAA0000001', 'MAAA0000002', 'MAAA0000003', 'MAAA0000004']
    .map(getBBBEEProfile).filter(Boolean) as NonNullable<ReturnType<typeof getBBBEEProfile>>[];
  return (
    <div className="space-y-3">
      <SourceBanner title="B-BBEE Commission" description="B-BBEE certificates and verification status. Fronting detection: high claimed level but suspicious ownership structures flagged against Commission database." />
      {profiles.map(p => (
        <Card key={p.csd_supplier_no} glow={p.fronting_risk === 'CONFIRMED' || p.fronting_risk === 'HIGH' ? 'red' : 'none'}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[#0f172a] font-bold text-[13px]">{p.supplier_name}</p>
                  {(p.fronting_risk === 'CONFIRMED' || p.fronting_risk === 'HIGH') && (
                    <span className="text-[9px] font-bold text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1.5 py-0.5 rounded-sm">FRONTING {p.fronting_risk}</span>
                  )}
                  {!p.agency_accredited && (
                    <span className="text-[9px] font-bold text-[#ea580c] bg-orange-950/50 border border-orange-900/40 px-1.5 py-0.5 rounded-sm">UNACCREDITED AGENCY</span>
                  )}
                </div>
                <p className="font-mono text-[#0284c7] text-[11px]">{p.csd_supplier_no}</p>
              </div>
              <div className="text-right">
                <p className="text-[#0f172a] font-bold text-[16px] font-mono">{p.b_bbee_status_level}</p>
                <p className="text-[#64748b] text-[10px]">{p.b_bbee_recognition_level} recognition</p>
                <p className="text-[#64748b] text-[10px]">Expires: {p.expiry_date}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <SectionLabel text="Verification" />
                <InfoRow label="Agency" value={p.verification_agency} />
                <InfoRow label="Accredited" value={p.agency_accredited ? 'YES' : 'NOT ACCREDITED'} highlight={!p.agency_accredited} />
                <InfoRow label="Verified Date" value={p.verification_date} mono />
                <InfoRow label="Commission DB" value={p.commission_database_match ? 'FOUND' : 'NOT FOUND'} highlight={!p.commission_database_match} />
                <InfoRow label="Verified Level" value={p.commission_verified_level ?? 'N/A'} highlight={!p.commission_verified_level} />
              </div>
              <div>
                <SectionLabel text="Ownership Metrics" />
                <InfoRow label="Black Ownership" value={p.ownership_black_percentage + '%'} mono />
                <InfoRow label="Black Management" value={p.management_black_percentage + '%'} mono highlight={p.management_black_percentage < 30 && p.ownership_black_percentage >= 51} />
                <InfoRow label="Skills Dev Score" value={String(p.skills_development_score)} mono />
                <InfoRow label="ESD Score" value={String(p.esd_score)} mono />
              </div>
              <div>
                <SectionLabel text="Scorecard Totals" />
                <InfoRow label="Ownership" value={String(p.scorecard.ownership)} mono />
                <InfoRow label="Mgmt Control" value={String(p.scorecard.management_control)} mono />
                <InfoRow label="Skills Dev" value={String(p.scorecard.skills_development)} mono />
                <InfoRow label="ESD" value={String(p.scorecard.enterprise_supplier_development)} mono />
                <InfoRow label="Total Score" value={String(p.scorecard.total_score)} mono />
              </div>
            </div>
            {p.fronting_indicators.length > 0 && (
              <div>
                <SectionLabel text="Fronting Indicators" />
                <div className="space-y-1">
                  {p.fronting_indicators.map((fi, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[#dc2626] bg-red-950/30 border border-red-900/40 px-2.5 py-1.5 rounded-sm">
                      <AlertTriangle size={11} className="shrink-0 mt-0.5" />{fi}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {p.notes.length > 0 && (
              <div className="mt-2 space-y-0.5">
                {p.notes.map((n, i) => (
                  <p key={i} className={'text-[10px] ' + (n.startsWith('ALERT') ? 'text-[#dc2626] font-semibold' : 'text-[#64748b]')}>{n}</p>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── eTender Tab ──────────────────────────────────────────────────────────────
function ETenderTab() {
  const [expanded, setExpanded] = useState<string | null>('NT001-2026-PPE');
  return (
    <div className="space-y-3">
      <SourceBanner title="eTender Portal" description="Tender advertisements, bid submissions, and award notices. NT001-2026-PPE is the rigged tender — knee guards at R80,000/pair vs R320 retail (24,900% markup)." />
      {allETenders.map(t => (
        <Card key={t.tender_id} glow={t.ai_risk_level === 'CRITICAL' ? 'red' : 'none'}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-mono text-[#0284c7] text-[11px]">{t.tender_id}</p>
                  <Badge label={t.status} variant="status" status={t.status === 'Open' ? 'UNDER_REVIEW' : t.status === 'Awarded' ? 'AWARDED' : t.status === 'Suspended' ? 'SUSPENDED' : 'CLEARED'} />
                  <RiskPill level={t.ai_risk_level} />
                  {t.ai_spec_rigging_detected && <span className="text-[9px] font-bold text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1.5 py-0.5 rounded-sm">SPEC RIGGING</span>}
                </div>
                <p className="text-[#0f172a] font-bold text-[13px]">{t.title}</p>
                <p className="text-[#64748b] text-[11px]">{t.issuing_department} · Closes: {t.closing_date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[#0f172a] font-bold font-mono text-[14px]">R{(t.estimated_value / 1_000_000).toFixed(2)}M</p>
                <p className="text-[#64748b] text-[10px]">Integrity: {t.ai_integrity_score}/100</p>
                <button onClick={() => setExpanded(expanded === t.tender_id ? null : t.tender_id)} className="text-[#334155] hover:text-[#0f172a] transition-colors mt-1">
                  {expanded === t.tender_id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>
            {t.ai_flags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {t.ai_flags.slice(0, 3).map((f, i) => <span key={i} className="text-[9px] text-[#dc2626] bg-red-950/40 border border-red-900/40 px-1.5 py-0.5 rounded-sm">{f}</span>)}
                {t.ai_flags.length > 3 && <span className="text-[9px] text-[#64748b]">+{t.ai_flags.length - 3} more</span>}
              </div>
            )}
            {expanded === t.tender_id && (
              <div className="mt-3 pt-3 border-t border-[#e2e8f0] space-y-3">
                {t.ai_spec_rigging_detail && (
                  <div className="bg-[#fee2e2] border border-red-900/40 rounded-sm p-3">
                    <p className="text-[#dc2626] font-bold text-[11px] mb-1">AI Spec Rigging Analysis</p>
                    <p className="text-[#dc2626]/80 text-[11px] leading-relaxed">{t.ai_spec_rigging_detail}</p>
                  </div>
                )}
                <div>
                  <SectionLabel text={`Bids (${t.bids.length})`} />
                  <div className="space-y-2">
                    {t.bids.map(b => (
                      <div key={b.supplier_csd_no} className={'border rounded-sm p-3 ' + (b.recommended_action === 'Block' ? 'border-red-900/50 bg-[#fee2e2]' : b.recommended_action === 'Accept' ? 'border-green-900/50 bg-green-950/10' : 'border-[#e2e8f0] bg-white')}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-[#0f172a] font-semibold text-[12px]">{b.supplier_name}</p>
                            <p className="font-mono text-[#0284c7] text-[10px]">{b.supplier_csd_no} · Score: {b.technical_score}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#0f172a] text-[13px]">R{(b.bid_amount / 1_000_000).toFixed(3)}M</span>
                            <Badge label={b.recommended_action} variant="status" status={b.recommended_action === 'Block' ? 'SUSPENDED' : b.recommended_action === 'Accept' ? 'CLEARED' : 'UNDER_REVIEW'} />
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table>
                            <thead><tr><th>Item</th><th className="text-right">Unit Price</th><th className="text-right">Benchmark</th><th className="text-right">Markup</th><th>Flag</th></tr></thead>
                            <tbody>
                              {b.price_line_items.map((item, i) => (
                                <tr key={i} className={item.flagged ? 'bg-red-950/10' : ''}>
                                  <td><span className="text-[#334155] text-[11px]">{item.description}</span></td>
                                  <td className="text-right"><span className={'font-mono font-bold text-[12px] ' + (item.flagged ? 'text-[#dc2626]' : 'text-[#0f172a]')}>R{item.unit_price.toLocaleString()}</span></td>
                                  <td className="text-right"><span className="font-mono text-[#64748b] text-[11px]">R{item.market_benchmark_price.toLocaleString()}</span></td>
                                  <td className="text-right"><span className={'font-mono font-bold text-[12px] ' + (item.markup_percent > 500 ? 'text-[#dc2626]' : item.markup_percent > 50 ? 'text-[#ea580c]' : item.markup_percent > 0 ? 'text-[#ca8a04]' : 'text-[#16a34a]')}>{item.markup_percent > 0 ? '+' : ''}{item.markup_percent}%</span></td>
                                  <td>{item.flagged ? <AlertTriangle size={12} className="text-[#dc2626]" /> : <CheckCircle size={12} className="text-[#16a34a]" />}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {b.ai_flags.length > 0 && <div className="mt-2 space-y-0.5">{b.ai_flags.map((f, i) => <p key={i} className="text-[10px] text-[#dc2626]">⚠ {f}</p>)}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Blockchain Ledger Tab ────────────────────────────────────────────────────
function LedgerTab() {
  return (
    <div className="space-y-3">
      <SourceBanner title="Blockchain Audit Ledger" description="Immutable append-only log of all AI interventions on the rigged PPE tender. Every entry is cryptographically hashed and cannot be altered retroactively." />
      <Card>
        <CardHeader title="NT001-2026-PPE — AI Intervention Trail" subtitle="8 events from tender publication to SIU referral" />
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>Tx ID</th><th>Timestamp</th><th>Event Type</th><th>Entity</th><th>Actor</th><th>Key Detail</th></tr></thead>
            <tbody>
              {blockchainAuditLedger.map((e, idx) => (
                <tr key={e.transaction_id}>
                  <td><span className="font-mono text-[#0284c7] text-[10px]">{e.transaction_id.slice(0, 14)}...</span></td>
                  <td><span className="font-mono text-[#64748b] text-[10px]">{e.timestamp.replace('T', ' ').replace('Z', '')}</span></td>
                  <td><span className={'text-[11px] font-semibold ' + (e.event_type.includes('Flag') || e.event_type.includes('Suspend') ? 'text-[#dc2626]' : e.event_type.includes('Referral') || e.event_type.includes('Evidence') ? 'text-[#ea580c]' : e.event_type.includes('Decision') ? 'text-[#ca8a04]' : 'text-[#334155]')}>{idx + 1}. {e.event_type}</span></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{e.entity_id}</span></td>
                  <td><span className="text-[#64748b] text-[10px]">{e.actor.replace('SentinelProcure_', '')}</span></td>
                  <td>
                    <div className="max-w-xs">
                      {Object.entries(e.details).slice(0, 2).map(([k, v]) => (
                        <p key={k} className="text-[10px] text-[#64748b]"><span className="text-[#334155]">{k}:</span> {String(v)}</p>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── FIC Tab ──────────────────────────────────────────────────────────────────
function FICTab() {
  return (
    <div className="space-y-3">
      <SourceBanner title="FIC — Financial Intelligence Centre (Future State)" description="Simulated risk profiles for MVP. Future integration will provide real-time financial intelligence for money laundering and illicit financial flow detection." />
      <div className="relative overflow-hidden border border-yellow-900/40 rounded-sm bg-[#0d0a00] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-600" />
        <div>
          <p className="text-yellow-500 font-bold text-[12px] uppercase tracking-wide">Future Integration — Conceptual Mock</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">For the MVP, FIC risk profiles are simulated based on internal risk scores. Live integration would provide Suspicious Activity Reports (SARs), real-time transaction monitoring, and sanctions screening.</p>
        </div>
      </div>
      {ficProfiles.map(p => (
        <Card key={p.entity_id} glow={p.fic_risk_rating === 'high' || p.fic_risk_rating === 'sanctioned' ? 'red' : 'none'}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[#0f172a] font-bold text-[13px]">{p.entity_name}</p>
                <p className="font-mono text-[#0284c7] text-[11px]">{p.entity_id}</p>
              </div>
              <div className="flex items-center gap-3">
                <RiskPill level={p.fic_risk_rating} />
                <div className="text-right">
                  <p className={'font-mono font-bold text-[18px] ' + (p.sar_count > 0 ? 'text-[#dc2626]' : 'text-[#16a34a]')}>{p.sar_count}</p>
                  <p className="text-[#64748b] text-[9px] uppercase tracking-widest">SARs Filed</p>
                </div>
              </div>
            </div>
            {p.linked_suspicious_transactions.length > 0 && (
              <div className="mb-2">
                <SectionLabel text="Suspicious Transactions" />
                <div className="space-y-1">
                  {p.linked_suspicious_transactions.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[#ea580c] bg-orange-950/20 border border-orange-900/30 px-2.5 py-1.5 rounded-sm">
                      <TrendingUp size={11} className="shrink-0 mt-0.5" />{t}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {p.notes.map((n, i) => <p key={i} className="text-[#64748b] text-[11px] mt-0.5">{n}</p>)}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function SupplierIntelligence() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const { pendingEntityId, clearPendingEntity } = useNavigation();

  useEffect(() => {
    if (pendingEntityId) {
      if (pendingEntityId.startsWith('MAAA')) setActiveTab('csd');
      else if (pendingEntityId.includes('/')) setActiveTab('cipc');
      clearPendingEntity();
    }
  }, [pendingEntityId, clearPendingEntity]);

  const tabs: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'cipc', label: 'CIPC' },
    { id: 'sars', label: 'SARS' },
    { id: 'csd', label: 'CSD' },
    { id: 'bbbee', label: 'B-BBEE Commission', badge: 2 },
    { id: 'etenders', label: 'eTender Portal', badge: 1 },
    { id: 'ledger', label: 'Audit Ledger' },
    { id: 'fic', label: 'FIC (Future)' },
  ];

  return (
    <div className="p-5 space-y-4 bg-[#f8fafc] min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0f172a] font-bold text-[16px]">Supplier Intelligence</h1>
          <p className="text-[#64748b] text-[11px] mt-0.5">High-fidelity mock data — CIPC · SARS · CSD · B-BBEE Commission · eTender Portal · FIC</p>
        </div>
        <div className="flex items-center gap-2">
          <Search size={12} className="text-[#334155]" />
          <span className="text-[#334155] text-[11px]">4 suppliers · 3 tenders · 8 audit events</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-[#e2e8f0] overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={'px-3 py-2 text-[12px] font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ' + (activeTab === t.id ? 'border-[#d4a843] text-[#0f172a]' : 'border-transparent text-[#64748b] hover:text-[#334155]')}
          >
            {t.label}
            {t.badge && <span className="text-[9px] font-bold bg-red-900/40 text-[#dc2626] px-1 py-0.5 rounded">{t.badge}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'overview'  && <TabErrorBoundary tab="overview"><OverviewTab /></TabErrorBoundary>}
      {activeTab === 'cipc'      && <TabErrorBoundary tab="cipc"><CIPCTab /></TabErrorBoundary>}
      {activeTab === 'sars'      && <TabErrorBoundary tab="sars"><SARSTab /></TabErrorBoundary>}
      {activeTab === 'csd'       && <TabErrorBoundary tab="csd"><CSDTab /></TabErrorBoundary>}
      {activeTab === 'bbbee'     && <TabErrorBoundary tab="bbbee"><BBBEETab /></TabErrorBoundary>}
      {activeTab === 'etenders'  && <TabErrorBoundary tab="etenders"><ETenderTab /></TabErrorBoundary>}
      {activeTab === 'ledger'    && <TabErrorBoundary tab="ledger"><LedgerTab /></TabErrorBoundary>}
      {activeTab === 'fic'       && <TabErrorBoundary tab="fic"><FICTab /></TabErrorBoundary>}
    </div>
  );
}

import { useState } from 'react';
import { Search, SlidersHorizontal, X, Lock, ExternalLink } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { IntegrityScore } from '../components/ui/IntegrityScore';
import { mockTenders, type Tender } from '../data/mockData';
import { mockBidSubmissions } from '../data/extendedData';
import { useNavigation } from '../context/NavigationContext';
import { useScenario } from '../context/ScenarioContext';

function TenderDetailPanel({ tender, onClose }: { tender: Tender; onClose: () => void }) {
  const { navigateTo } = useNavigation();
  const { scenarioData } = useScenario();
  
  // Merge bids from mock and scenario
  const allBids = [...mockBidSubmissions, ...(scenarioData?.bidSubmissions || [])];
  const bids = allBids.filter(b => b.tenderRef === tender.reference);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-end">
      <div className="w-[520px] h-full bg-[#f8fafc] border-l border-[#e2e8f0] flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="classification-bar px-5 py-1.5 flex items-center justify-between shrink-0">
          <span className="text-[#334155] text-[9px] font-bold uppercase tracking-widest">TENDER DETAIL — RESTRICTED</span>
          <button onClick={onClose} className="text-[#334155] hover:text-[#0f172a] transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-gov">
          {/* Identity */}
          <div className="px-5 py-4 border-b border-[#e2e8f0]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-mono text-[#0284c7] text-[11px] mb-1">{tender.reference}</p>
                <h2 className="text-[#0f172a] font-bold text-[14px] leading-snug">{tender.title}</h2>
                <p className="text-[#64748b] text-[11px] mt-1">{tender.department}</p>
              </div>
              <IntegrityScore score={tender.integrityScore} size="md" />
            </div>
            <div className="flex gap-2 mt-3">
              <Badge label={tender.riskLevel} variant="risk" riskLevel={tender.riskLevel} dot />
              <Badge label={tender.status.replace('_', ' ')} variant="status" status={tender.status} />
            </div>
          </div>

          {/* Risk score bar */}
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <div className="flex justify-between mb-1.5">
              <span className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest">AI Risk Score</span>
              <span className="text-[#0f172a] font-mono font-bold text-[12px]">{tender.riskScore} / 100</span>
            </div>
            <div className="bg-[#f1f5f9] rounded-sm h-2 border border-[#e2e8f0]">
              <div
                className="h-2 rounded-sm transition-all"
                style={{
                  width: `${tender.riskScore}%`,
                  background: tender.riskScore >= 75 ? '#ef4444' : tender.riskScore >= 50 ? '#f97316' : tender.riskScore >= 25 ? '#eab308' : '#22c55e'
                }}
              />
            </div>
          </div>

          {/* Data grid */}
          <div className="px-5 py-4 border-b border-[#e2e8f0]">
            <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-3">Tender Details</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: 'Contract Value', value: `R${(tender.value / 1_000_000).toFixed(1)}M` },
                { label: 'Province', value: tender.province },
                { label: 'Category', value: tender.category },
                { label: 'No. of Bidders', value: String(tender.biddersCount) },
                { label: 'Submitted', value: tender.submittedDate },
                { label: 'Closing Date', value: tender.closingDate },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[#334155] text-[10px] uppercase tracking-wider">{item.label}</p>
                  <p className="text-[#0f172a] font-semibold text-[12px] font-mono mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          {tender.flags.length > 0 && (
            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Active Flags</p>
              <div className="space-y-1.5">
                {tender.flags.map((f: string) => (
                  <div key={f} className="flex items-center gap-2 text-[11px] text-[#dc2626] bg-red-950/40 border border-red-900/50 px-3 py-1.5 rounded-sm">
                    <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bids — Level 2: linked to CSD dossiers */}
          {bids.length > 0 && (
            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Bids ({bids.length})</p>
              <div className="space-y-1.5">
                {bids.map(b => (
                  <div key={b.id} className={`flex items-center justify-between px-3 py-2 rounded-sm border ${b.status === 'REJECTED' || b.status === 'ESCALATED' ? 'border-red-900/50 bg-[#fee2e2]' : b.status === 'PASSED' ? 'border-green-900/50 bg-green-950/10' : 'border-[#e2e8f0] bg-white'}`}>
                    <div>
                      <p className="text-[#0f172a] text-[11px] font-semibold">{b.vendorName}</p>
                      <p className="font-mono text-[#0284c7] text-[10px]">{b.vendorCSD}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0f172a] text-[12px]">R{(b.totalBidValue / 1_000_000).toFixed(1)}M</span>
                      <Badge label={b.status} variant="status" status={b.status === 'PASSED' ? 'CLEARED' : b.status === 'REJECTED' ? 'SUSPENDED' : 'UNDER_REVIEW'} />
                      <button
                        onClick={() => navigateTo('supplier-intelligence', b.vendorCSD)}
                        className="flex items-center gap-1 text-[10px] text-[#d4a843] border border-[#d4a843]/40 bg-[#d4a843]/10 px-2 py-1 rounded-sm hover:bg-[#d4a843]/20 transition-colors"
                      >
                        <ExternalLink size={10} /> Dossier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions — hard-blocked if flags exist */}
          <div className="px-5 py-4">
            <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Actions</p>
            <div className="space-y-1.5">
              <button className="w-full text-left text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-2 rounded-sm hover:bg-[#0f2040] transition-colors">
                Generate XAI Integrity Report
              </button>
              {(tender.riskLevel === 'CRITICAL' || tender.riskLevel === 'HIGH') && (
                <button className="w-full text-left text-[11px] font-semibold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-3 py-2 rounded-sm hover:bg-red-950/60 transition-colors">
                  Suspend Tender — Pending Investigation
                </button>
              )}
              <button className="w-full text-left text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-2 rounded-sm hover:border-[#cbd5e1] transition-colors">
                View Immutable Audit Log
              </button>
              <button className="w-full text-left text-[11px] font-semibold text-purple-400 border border-purple-900/60 bg-purple-950/40 px-3 py-2 rounded-sm hover:bg-purple-950/60 transition-colors">
                Refer to SIU / Auditor-General
              </button>

              {/* HARD BLOCK: Award button only exists when ALL conditions are met */}
              {tender.flags.length === 0 && tender.riskLevel === 'LOW' && tender.status === 'CLEARED' ? (
                <div className="pt-2 border-t border-[#e2e8f0]">
                  <button className="w-full text-left text-[11px] font-bold text-[#16a34a] border border-green-900/60 bg-green-950/40 px-3 py-2 rounded-sm hover:bg-green-950/60 transition-colors uppercase tracking-wide">
                    Proceed to Award — Requires 3-Signature Chain
                  </button>
                  <p className="text-[#334155] text-[10px] mt-1.5 leading-relaxed">
                    SCM Officer → Accounting Officer → National Treasury. All 3 must sign. No single person can complete the chain.
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#e2e8f0]">
                  <div className="w-full text-[11px] font-bold text-[#334155] border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 rounded-sm uppercase tracking-wide flex items-center gap-2 cursor-not-allowed select-none">
                    <Lock size={11} />
                    Award Blocked — {tender.flags.length > 0 ? `${tender.flags.length} unresolved flag${tender.flags.length !== 1 ? 's' : ''}` : `Status: ${tender.status}`}
                  </div>
                  <p className="text-[#334155] text-[10px] mt-1.5 leading-relaxed">
                    This button does not exist while flags are active. Any attempt to override is automatically referred to the Auditor-General and SIU.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tenders() {
  const { scenarioData } = useScenario();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState<Tender | null>(null);

  // Merge mock tenders with scenario tenders
  const allTenders = [...(scenarioData?.tenders || []), ...mockTenders];

  const filtered = allTenders.filter((t: Tender) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'ALL' || t.riskLevel === riskFilter;
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchRisk && matchStatus;
  });

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#334155]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tenders..."
            className="bg-white border border-[#e2e8f0] rounded-sm pl-8 pr-3 py-1.5 text-[12px] text-[#334155] placeholder-[#2a4a6b] focus:outline-none focus:border-[#cbd5e1] w-56 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={11} className="text-[#334155]" />
          <span className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mr-1">Risk:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm border transition-colors ${riskFilter === r ? 'bg-[#0c1e38] border-[#cbd5e1] text-[#0284c7]' : 'bg-white border-[#e2e8f0] text-[#334155] hover:text-[#64748b]'}`}>
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mr-1">Status:</span>
          {['ALL', 'FLAGGED', 'UNDER_REVIEW', 'CLEARED', 'SUSPENDED', 'AWARDED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm border transition-colors ${statusFilter === s ? 'bg-[#0c1e38] border-[#cbd5e1] text-[#0284c7]' : 'bg-white border-[#e2e8f0] text-[#334155] hover:text-[#64748b]'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="ml-auto text-[#334155] text-[11px] font-mono">{filtered.length} / {mockTenders.length} records</span>
      </div>

      {/* Table */}
      <Card>
        <CardHeader title="Tender Pipeline" subtitle="Click any row to open detail panel" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Integrity</th>
                <th>Reference</th>
                <th>Title</th>
                <th>Department</th>
                <th>Province</th>
                <th className="text-right">Value</th>
                <th>Bidders</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Closing</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="cursor-pointer" onClick={() => setSelected(t)}>
                  <td><IntegrityScore score={t.integrityScore} size="sm" showLabel={false} /></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{t.reference}</span></td>
                  <td>
                    <div>
                      <p className="text-[#0f172a] font-medium text-[12px]">{t.title}</p>
                      {t.flags.length > 0 && (
                        <div className="flex gap-1 mt-0.5 flex-wrap">
                          {t.flags.slice(0, 2).map((f: string) => (
                            <span key={f} className="text-[9px] text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1 py-0.5 rounded-sm">{f}</span>
                          ))}
                          {t.flags.length > 2 && <span className="text-[9px] text-[#64748b]">+{t.flags.length - 2}</span>}
                        </div>
                      )}
                    </div>
                  </td>
                  <td><span className="text-[#64748b] text-[11px]">{t.department}</span></td>
                  <td><span className="text-[#64748b] text-[11px]">{t.province}</span></td>
                  <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(t.value / 1_000_000).toFixed(0)}M</span></td>
                  <td><span className="font-mono text-[#64748b]">{t.biddersCount}</span></td>
                  <td><Badge label={t.riskLevel} variant="risk" riskLevel={t.riskLevel} dot /></td>
                  <td><Badge label={t.status.replace('_', ' ')} variant="status" status={t.status} /></td>
                  <td><span className="font-mono text-[#64748b] text-[11px]">{t.closingDate}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#334155] text-[12px]">No tenders match the selected filters.</div>
          )}
        </div>
      </Card>

      {selected && <TenderDetailPanel tender={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle, Users, ExternalLink } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { IntegrityScore } from '../components/ui/IntegrityScore';
import { mockVendors, type Vendor } from '../data/mockData';
import { mockVendorViability, mockBBBEEVerifications, mockJVScreenings } from '../data/securityData2';
import { useNavigation } from '../context/NavigationContext';
import { getCSDProfile } from '../data/mockData_csd';
import { getSARSProfile } from '../data/mockData_sars';
import { getBBBEEProfile } from '../data/mockData_bbbee';

function ComplianceItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      {ok ? <CheckCircle size={12} className="text-[#16a34a] shrink-0" /> : <XCircle size={12} className="text-[#dc2626] shrink-0" />}
      <span className={ok ? 'text-[#334155]' : 'text-[#dc2626]'}>{label}</span>
    </div>
  );
}
function VendorRow({ vendor }: { vendor: Vendor }) {
  const [expanded, setExpanded] = useState(false);
  const { navigateTo } = useNavigation();
  const viability = mockVendorViability.find(v => v.vendorId === vendor.id);
  const bbbee = mockBBBEEVerifications.find(b => b.vendorId === vendor.id);
  // Level 1+2: live dossier lookup via aligned CSD number
  const csdProfile = getCSDProfile(vendor.csdNumber);
  const sarsProfile = getSARSProfile(vendor.csdNumber);
  const bbbeeProfile = getBBBEEProfile(vendor.csdNumber);
  const hasDossier = !!csdProfile;
  const leftBorder: Record<string, string> = {
    CRITICAL: 'border-l-red-500', HIGH: 'border-l-orange-500',
    MEDIUM: 'border-l-yellow-500', LOW: 'border-l-green-500',
  };

  return (
    <>
      <tr className={`cursor-pointer border-l-2 ${leftBorder[vendor.riskLevel]}`} onClick={() => setExpanded(!expanded)}>
        <td><IntegrityScore score={vendor.reputationScore} size="sm" showLabel={false} /></td>
        <td>
          <p className="text-[#0f172a] font-semibold text-[12px]">{vendor.name}</p>
          <p className="text-[#334155] text-[10px] font-mono mt-0.5">{vendor.cipcNumber}</p>
          {viability?.blocked && <span className="text-[9px] text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block">VIABILITY BLOCKED</span>}
        </td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{vendor.csdNumber}</span></td>
        <td><span className="text-[#64748b] text-[11px]">{vendor.sector}</span></td>
        <td><span className="text-[#64748b] text-[11px]">{vendor.province}</span></td>
        <td>
          <div>
            <span className="font-mono text-[#0f172a] font-semibold">L{vendor.bbbeeLevel}</span>
            {bbbeeProfile && bbbeeProfile.fronting_risk !== 'NONE' && (
              <span className="ml-1 text-[9px] text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1 py-0.5 rounded-sm">FRONTING</span>
            )}
          </div>
        </td>
        <td><span className="font-mono text-[#0f172a]">{vendor.activeContracts}</span></td>
        <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(vendor.totalContractValue / 1_000_000).toFixed(0)}M</span></td>
        <td><Badge label={vendor.riskLevel} variant="risk" riskLevel={vendor.riskLevel} dot /></td>
        <td><Badge label={vendor.legalStatus.replace('_', ' ')} variant="status" status={vendor.legalStatus} /></td>
        <td><button className="text-[#334155] hover:text-[#0284c7] transition-colors">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button></td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={11} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4 space-y-4">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Compliance + B-BBEE (#16)</p>
                  <div className="space-y-1.5">
                    <ComplianceItem
                      label="Tax Clearance (SARS)"
                      ok={sarsProfile ? sarsProfile.tcs_status === 'compliant' : vendor.taxCompliant}
                    />
                    <ComplianceItem
                      label="CIPC Registration"
                      ok={vendor.legalStatus !== 'BLACKLISTED' && vendor.legalStatus !== 'SUSPENDED'}
                    />
                    <ComplianceItem
                      label="CSD Active Record"
                      ok={csdProfile ? csdProfile.eligible_to_bid : vendor.legalStatus === 'COMPLIANT'}
                    />
                    {bbbeeProfile ? (
                      <div>
                        <ComplianceItem
                          label={`B-BBEE ${bbbeeProfile.b_bbee_status_level} — Commission DB`}
                          ok={bbbeeProfile.commission_database_match && bbbeeProfile.agency_accredited}
                        />
                        {bbbeeProfile.fronting_risk !== 'NONE' && (
                          <div className="ml-5 mt-1 space-y-1">
                            <p className="text-[#334155] text-[9px] font-bold uppercase tracking-wider">Fronting Indicators:</p>
                            {bbbeeProfile.fronting_indicators.slice(0, 2).map((fi, i) => (
                              <p key={i} className="text-[#dc2626] text-[10px] leading-relaxed">⚠ {fi}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : bbbee ? (
                      <div>
                        <ComplianceItem label={`B-BBEE L${vendor.bbbeeLevel} — Commission DB`} ok={bbbee.verificationStatus === 'VERIFIED'} />
                        {bbbee.verificationStatus !== 'VERIFIED' && (
                          <div className="ml-5 mt-1 space-y-1">
                            <p className="text-[#334155] text-[9px] font-bold uppercase tracking-wider">Fraud Indicators:</p>
                            {bbbee.fraudIndicators.map((fi, i) => (
                              <p key={i} className="text-[#dc2626] text-[10px] leading-relaxed">⚠ {fi}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <ComplianceItem label="B-BBEE Certificate" ok={vendor.bbbeeLevel <= 4} />
                    )}
                    {sarsProfile && sarsProfile.outstanding_returns > 0 && (
                      <p className="text-[#dc2626] text-[10px]">⚠ {sarsProfile.outstanding_returns} outstanding SARS returns</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Past Performance</p>
                  <div className="bg-white border border-[#e2e8f0] rounded-sm p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#64748b] text-[11px]">Delivery Score</span>
                      <span className="text-[#0f172a] font-mono font-bold text-[13px]">{vendor.pastPerformance}%</span>
                    </div>
                    <div className="bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                      <div className="h-1.5 rounded-sm" style={{ width: `${vendor.pastPerformance}%`, background: vendor.pastPerformance >= 75 ? '#22c55e' : vendor.pastPerformance >= 50 ? '#eab308' : '#ef4444' }} />
                    </div>
                    <p className="text-[#334155] text-[10px] mt-2">Based on {vendor.activeContracts} active contracts</p>
                  </div>
                </div>

                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Viability Check (#5)</p>
                  {viability ? (
                    <div className="space-y-1.5">
                      <div className="bg-white border border-[#e2e8f0] rounded-sm p-2.5 space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#64748b]">Trading (months)</span>
                          <span className={`font-mono font-bold ${viability.monthsTrading < 24 ? 'text-[#ea580c]' : 'text-[#0f172a]'}`}>{viability.monthsTrading}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#64748b]">Employees</span>
                          <span className={`font-mono font-bold ${viability.employeeCount < 10 ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>{viability.employeeCount}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#64748b]">Revenue/Contract</span>
                          <span className={`font-mono font-bold ${viability.revenueToContractRatio < 0.1 ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>{(viability.revenueToContractRatio * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#64748b]">Bank acct age (days)</span>
                          <span className={`font-mono font-bold ${viability.bankAccountAgeDays < 90 ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>{viability.bankAccountAgeDays}</span>
                        </div>
                      </div>
                      {viability.viabilityFlags.length > 0 && (
                        <div className="space-y-1">
                          {viability.viabilityFlags.map((f, i) => (
                            <p key={i} className="text-[#dc2626] text-[10px] leading-relaxed">⚠ {f}</p>
                          ))}
                        </div>
                      )}
                      {viability.blocked && (
                        <div className="bg-red-950/40 border border-red-900/50 rounded-sm px-2.5 py-1.5 text-[11px] text-[#dc2626] font-bold">
                          BID BLOCKED — Financially incapable
                        </div>
                      )}
                    </div>
                  ) : <p className="text-[#334155] text-[11px]">No viability data</p>}
                </div>

                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Actions</p>
                  <div className="space-y-1.5">
                    {hasDossier && (
                      <button
                        onClick={e => { e.stopPropagation(); navigateTo('supplier-intelligence', vendor.csdNumber); }}
                        className="w-full flex items-center gap-2 text-[11px] font-semibold text-[#d4a843] border border-[#d4a843]/40 bg-[#d4a843]/10 px-3 py-1.5 rounded-sm hover:bg-[#d4a843]/20 transition-colors"
                      >
                        <ExternalLink size={11} />
                        View Supplier Dossier
                      </button>
                    )}
                    <button className="w-full text-left text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">View Ownership Graph</button>
                    {vendor.riskLevel === 'CRITICAL' && (
                      <button className="w-full text-left text-[11px] font-semibold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-3 py-1.5 rounded-sm hover:bg-red-950/60 transition-colors">Blacklist Vendor</button>
                    )}
                    <button className="w-full text-left text-[11px] font-semibold text-purple-400 border border-purple-900/60 bg-purple-950/40 px-3 py-1.5 rounded-sm hover:bg-purple-950/60 transition-colors">Refer to SIU</button>
                  </div>
                </div>
              </div>

              {vendor.flags.length > 0 && (
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Risk Flags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.flags.map(f => (
                      <div key={f} className="flex items-center gap-2 text-[11px] text-[#dc2626] bg-red-950/40 border border-red-900/50 px-2.5 py-1.5 rounded-sm">
                        <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function Vendors() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'vendors' | 'bbbee' | 'jv'>('vendors');

  const filtered = mockVendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.cipcNumber.includes(search) || v.sector.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'ALL' || v.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const bbbeeIssues = mockBBBEEVerifications.filter(b => b.verificationStatus !== 'VERIFIED').length;
  const jvFlagged = mockJVScreenings.filter(j => j.status === 'FLAGGED').length;

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Monitored', value: '1,851', color: 'text-[#0f172a]' },
          { label: 'Blacklisted', value: '23', color: 'text-[#dc2626]' },
          { label: 'B-BBEE Cert Issues', value: String(bbbeeIssues), color: 'text-[#ea580c]' },
          { label: 'JV/Consortium Flagged', value: String(jvFlagged), color: 'text-[#dc2626]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-[#e2e8f0]">
        {[['vendors', 'Vendor Registry'], ['bbbee', 'B-BBEE Verification (#16)'], ['jv', 'JV / Consortium Screening (#17)']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id as 'vendors' | 'bbbee' | 'jv')}
            className={`px-4 py-2 text-[12px] font-semibold border-b-2 transition-colors ${activeTab === id ? 'border-[#d4a843] text-[#0f172a]' : 'border-transparent text-[#64748b] hover:text-[#334155]'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'vendors' && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#334155]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
                className="bg-white border border-[#e2e8f0] rounded-sm pl-8 pr-3 py-1.5 text-[12px] text-[#334155] placeholder-[#2a4a6b] focus:outline-none focus:border-[#cbd5e1] w-56 transition-colors" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mr-1">Risk:</span>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
                <button key={r} onClick={() => setRiskFilter(r)}
                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm border transition-colors ${riskFilter === r ? 'bg-[#0c1e38] border-[#cbd5e1] text-[#0284c7]' : 'bg-white border-[#e2e8f0] text-[#334155] hover:text-[#64748b]'}`}>
                  {r}
                </button>
              ))}
            </div>
            <span className="ml-auto text-[#334155] text-[11px] font-mono">{filtered.length} records</span>
          </div>
          <Card>
            <CardHeader title="Vendor Registry" subtitle="Includes viability checks (#5) and B-BBEE Commission verification (#16) — click to expand. Gold button = live dossier available." />
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Score</th><th>Vendor Name</th><th>CSD Number</th><th>Sector</th>
                    <th>Province</th><th>B-BBEE</th><th>Contracts</th>
                    <th className="text-right">Total Value</th><th>Risk</th><th>Legal Status</th><th></th>
                  </tr>
                </thead>
                <tbody>{filtered.map(v => <VendorRow key={v.id} vendor={v} />)}</tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'bbbee' && (
        <Card>
          <CardHeader title="B-BBEE Certificate Verification — Commission Database" subtitle="Loophole #16 closed: every certificate verified against B-BBEE Commission national database and issuing agency accreditation" />
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th><th>Cert Number</th><th>Issuing Agency</th><th>Accredited</th>
                  <th>Claimed Level</th><th>Commission Level</th><th>Expiry</th><th>Status</th><th>Issues</th>
                </tr>
              </thead>
              <tbody>
                {mockBBBEEVerifications.map(b => (
                  <tr key={b.vendorId} className={b.verificationStatus !== 'VERIFIED' ? 'bg-red-950/10' : ''}>
                    <td><span className="text-[#0f172a] font-semibold text-[12px]">{b.vendorName}</span></td>
                    <td><span className="font-mono text-[#0284c7] text-[11px]">{b.certNumber}</span></td>
                    <td><span className="text-[#334155] text-[11px]">{b.issuingAgency}</span></td>
                    <td>
                      <div className={`flex items-center gap-1.5 text-[11px] ${b.agencyAccredited ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                        {b.agencyAccredited ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {b.agencyAccredited ? 'Accredited' : 'NOT ACCREDITED'}
                      </div>
                    </td>
                    <td><span className="font-mono font-bold text-[#0f172a]">L{b.claimedLevel}</span></td>
                    <td>
                      <span className={`font-mono font-bold ${b.commissionVerifiedLevel === null ? 'text-[#dc2626]' : b.commissionVerifiedLevel !== b.claimedLevel ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                        {b.commissionVerifiedLevel !== null ? `L${b.commissionVerifiedLevel}` : 'NOT FOUND'}
                      </span>
                    </td>
                    <td><span className="font-mono text-[#64748b] text-[11px]">{b.expiryDate}</span></td>
                    <td>
                      <Badge label={b.verificationStatus.replace(/_/g, ' ')} variant="status"
                        status={b.verificationStatus === 'VERIFIED' ? 'CLEARED' : 'SUSPENDED'} dot />
                    </td>
                    <td>
                      {b.fraudIndicators.length > 0 ? (
                        <div className="space-y-0.5">
                          {b.fraudIndicators.map((fi, i) => <p key={i} className="text-[#dc2626] text-[10px] max-w-xs">⚠ {fi}</p>)}
                        </div>
                      ) : <span className="text-[#16a34a] text-[11px]">✓ None</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'jv' && (
        <div className="space-y-4">
          <div className="relative overflow-hidden border border-purple-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500" />
            <Users size={15} className="text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-purple-400 font-bold text-[12px] uppercase tracking-wide">JV / Consortium Screening — Loophole #17 Closed</p>
              <p className="text-[#64748b] text-[11px] mt-0.5">
                Every JV member is individually screened through the ownership graph engine. A flagged entity cannot hide behind a clean JV partner.
                Clean-vehicle detection identifies JVs formed shortly before bid submission where one member has prior flags.
              </p>
            </div>
          </div>
          {mockJVScreenings.map(jv => (
            <Card key={jv.id} glow={jv.status === 'FLAGGED' ? 'red' : 'none'}>
              <CardHeader
                title={jv.jvName}
                subtitle={`${jv.tenderRef} · Registered: ${jv.registeredDate} · ${jv.members.length} members`}
                action={
                  <div className="flex gap-2">
                    <Badge label={jv.aggregateRisk} variant="risk" riskLevel={jv.aggregateRisk} dot />
                    <Badge label={jv.status} variant="status" status={jv.status === 'CLEARED' ? 'CLEARED' : jv.status === 'FLAGGED' ? 'FLAGGED' : 'UNDER_REVIEW'} />
                  </div>
                }
              />
              <div className="p-4 space-y-3">
                {jv.cleanVehicleDetected && (
                  <div className="flex items-start gap-2 bg-red-950/30 border border-red-900/50 rounded-sm p-3">
                    <AlertTriangle size={13} className="text-[#dc2626] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#dc2626] font-bold text-[12px]">Clean Vehicle Pattern Detected</p>
                      <p className="text-[#dc2626]/70 text-[11px] mt-0.5">{jv.cleanVehicleDetail}</p>
                    </div>
                  </div>
                )}
                <table>
                  <thead>
                    <tr>
                      <th>Member</th><th>CIPC</th><th className="text-right">Participation</th>
                      <th>Risk</th><th>PEP Link</th><th>Official Link</th><th>Prior Flags</th><th>Graph Run</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jv.members.map(m => (
                      <tr key={m.cipcNumber} className={m.riskLevel === 'CRITICAL' || m.riskLevel === 'HIGH' ? 'bg-red-950/10' : ''}>
                        <td>
                          <p className="text-[#0f172a] font-semibold text-[12px]">{m.name}</p>
                          {m.flags.map(f => <span key={f} className="text-[9px] text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1 py-0.5 rounded-sm mr-1">{f}</span>)}
                        </td>
                        <td><span className="font-mono text-[#0284c7] text-[11px]">{m.cipcNumber}</span></td>
                        <td className="text-right"><span className="font-mono font-bold text-[#0f172a]">{m.participationPercent}%</span></td>
                        <td><Badge label={m.riskLevel} variant="risk" riskLevel={m.riskLevel} dot /></td>
                        <td>
                          <div className={`flex items-center gap-1 text-[11px] ${m.pepLinked ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                            {m.pepLinked ? <XCircle size={11} /> : <CheckCircle size={11} />}
                            {m.pepLinked ? 'YES' : 'No'}
                          </div>
                        </td>
                        <td>
                          <div className={`flex items-center gap-1 text-[11px] ${m.officialLinked ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                            {m.officialLinked ? <XCircle size={11} /> : <CheckCircle size={11} />}
                            {m.officialLinked ? 'YES' : 'No'}
                          </div>
                        </td>
                        <td><span className={`font-mono font-bold text-[12px] ${m.previousFlags > 0 ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>{m.previousFlags}</span></td>
                        <td>
                          <div className={`flex items-center gap-1 text-[11px] ${m.ownershipGraphRun ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                            {m.ownershipGraphRun ? <CheckCircle size={11} /> : <XCircle size={11} />}
                            {m.ownershipGraphRun ? 'Done' : 'PENDING'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

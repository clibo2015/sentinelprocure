
import { useState } from 'react';
import { Siren, FileCheck, ChevronDown, ChevronUp, Hash, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockEnforcementCases, mockEvidencePackages, type EnforcementCase } from '../data/extendedData';
import { mockReferralTracking } from '../data/securityData2';
import { useNavigation } from '../context/NavigationContext';
import { allCSDProfiles } from '../data/mockData_csd';

const agencyColors: Record<string, { bg: string; border: string; text: string }> = {
  SIU:   { bg: 'bg-red-950/60',    border: 'border-red-900/60',    text: 'text-[#dc2626]' },
  HAWKS: { bg: 'bg-orange-950/60', border: 'border-orange-900/60', text: 'text-[#ea580c]' },
  NPA:   { bg: 'bg-purple-950/60', border: 'border-purple-900/60', text: 'text-purple-400' },
  AGSA:  { bg: 'bg-[#0c1e38]',     border: 'border-[#cbd5e1]',     text: 'text-[#0284c7]' },
  NT:    { bg: 'bg-[#f1f5f9]',     border: 'border-[#e2e8f0]',     text: 'text-[#334155]' },
};

const statusColors: Record<string, string> = {
  REFERRED:    'text-[#0284c7]',
  ACTIVE:      'text-yellow-500',
  PROSECUTION: 'text-[#ea580c]',
  CONVICTION:  'text-[#16a34a]',
  CLOSED:      'text-[#64748b]',
};

function CaseRow({ ec }: { ec: EnforcementCase }) {
  const [expanded, setExpanded] = useState(false);
  const { navigateTo } = useNavigation();
  const ac = agencyColors[ec.agency];
  const evidencePkgs = mockEvidencePackages.filter(e => e.caseRef === ec.caseRef);
  // Level 2: find CSD profiles for linked vendors by name match
  const linkedCSDProfiles = ec.linkedVendors.map(vendorName =>
    allCSDProfiles.find(p => p.supplier_name.toLowerCase().includes(vendorName.toLowerCase().split(' ')[0]))
  ).filter(Boolean);

  return (
    <>
      <tr className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td><span className="font-mono text-[#0284c7] text-[11px]">{ec.caseRef}</span></td>
        <td>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wide ${ac.bg} ${ac.border} ${ac.text}`}>
            {ec.agency}
          </div>
        </td>
        <td>
          <p className="text-[#0f172a] font-medium text-[12px]">{ec.title}</p>
          <p className="text-[#334155] text-[10px] mt-0.5">{ec.linkedTenders.join(', ')}</p>
        </td>
        <td><Badge label={ec.severity} variant="risk" riskLevel={ec.severity} dot /></td>
        <td className="text-right">
          <span className="font-mono font-bold text-[#dc2626]">R{(ec.estimatedLoss / 1_000_000).toFixed(0)}M</span>
        </td>
        <td>
          <span className={`font-semibold text-[12px] ${statusColors[ec.status]}`}>{ec.status}</span>
        </td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{new Date(ec.referredAt).toLocaleDateString('en-ZA')}</span></td>
        <td>
          <div className="flex items-center gap-1.5">
            <FileCheck size={11} className="text-[#0284c7]" />
            <span className="font-mono text-[#0284c7] text-[11px]">{ec.evidencePackages}</span>
          </div>
        </td>
        <td>
          <button className="text-[#334155] hover:text-[#0284c7] transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={9} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Case Summary</p>
                  <div className="bg-white border border-[#e2e8f0] rounded-sm p-3">
                    <p className="text-[#334155] text-[12px] leading-relaxed">{ec.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white border border-[#e2e8f0] rounded-sm p-2.5">
                      <p className="text-[#334155] text-[10px] uppercase tracking-wider">Linked Vendors</p>
                      {ec.linkedVendors.map(v => (
                        <div key={v} className="flex items-center justify-between mt-0.5">
                          <p className="text-[#0f172a] text-[11px] font-semibold">{v}</p>
                          {linkedCSDProfiles.find(p => p && p.supplier_name.toLowerCase().includes(v.toLowerCase().split(' ')[0])) && (
                            <button
                              onClick={() => {
                                const p = linkedCSDProfiles.find(pr => pr && pr.supplier_name.toLowerCase().includes(v.toLowerCase().split(' ')[0]));
                                if (p) navigateTo('supplier-intelligence', p.csd_supplier_no);
                              }}
                              className="flex items-center gap-1 text-[9px] text-[#d4a843] hover:text-[#d4a843]/80 transition-colors"
                            >
                              <ExternalLink size={9} /> Dossier
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-white border border-[#e2e8f0] rounded-sm p-2.5">
                      <p className="text-[#334155] text-[10px] uppercase tracking-wider">Last Update</p>
                      <p className="text-[#0f172a] text-[11px] font-mono mt-0.5">{new Date(ec.lastUpdate).toLocaleDateString('en-ZA')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Evidence Packages</p>
                  {evidencePkgs.length > 0 ? evidencePkgs.map(pkg => (
                    <div key={pkg.id} className="bg-white border border-[#e2e8f0] rounded-sm p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#0284c7] text-[11px] font-mono">{pkg.id}</span>
                        <div className="flex gap-1.5">
                          <Badge label={pkg.status} variant="status" status={pkg.status === 'SUBMITTED' ? 'CLEARED' : pkg.status === 'READY' ? 'AWARDED' : 'UNDER_REVIEW'} />
                          {pkg.legalAdmissible && <Badge label="ADMISSIBLE" variant="status" status="CLEARED" />}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {pkg.items.map(item => (
                          <div key={item.hash} className="flex items-start gap-2 text-[10px]">
                            <Hash size={9} className="text-[#334155] shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-[#0284c7] font-semibold">{item.type}: </span>
                              <span className="text-[#64748b]">{item.description}</span>
                            </div>
                            <span className="font-mono text-[#1e3a5f] text-[9px] shrink-0">{item.hash.slice(0, 14)}…</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div className="bg-white border border-[#e2e8f0] rounded-sm p-3 text-center">
                      <p className="text-[#334155] text-[11px]">Evidence package being compiled…</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#e2e8f0]">
                <button className="text-[11px] font-semibold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-3 py-1.5 rounded-sm hover:bg-red-950/60 transition-colors">
                  Escalate to NPA
                </button>
                <button className="text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">
                  Download Evidence Package
                </button>
                <button className="text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-1.5 rounded-sm hover:border-[#cbd5e1] transition-colors">
                  Update Case Status
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function Enforcement() {
  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-orange-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
        <Siren size={15} className="text-[#ea580c] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#ea580c] font-bold text-[12px] uppercase tracking-wide">Direct Enforcement Integration — SIU · Hawks · NPA · AGSA</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Secure real-time data feeds to investigative bodies. Every flagged case automatically compiles an immutable, legally admissible evidence package
            including data trails, NLP analysis, ownership graphs, and blockchain-verified audit logs — ready for prosecution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Cases', value: mockEnforcementCases.length, color: 'text-[#0f172a]' },
          { label: 'Active Investigations', value: mockEnforcementCases.filter(e => e.status === 'ACTIVE').length, color: 'text-yellow-500' },
          { label: 'In Prosecution', value: mockEnforcementCases.filter(e => e.status === 'PROSECUTION').length, color: 'text-[#ea580c]' },
          { label: 'Evidence Packages', value: mockEnforcementCases.reduce((s, e) => s + e.evidencePackages, 0), color: 'text-[#0284c7]' },
          { label: 'Total Exposure', value: `R${(mockEnforcementCases.reduce((s, e) => s + e.estimatedLoss, 0) / 1_000_000).toFixed(0)}M`, color: 'text-[#dc2626]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Agency status */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { agency: 'SIU', full: 'Special Investigating Unit', cases: mockEnforcementCases.filter(e => e.agency === 'SIU').length, status: 'CONNECTED' },
          { agency: 'HAWKS', full: 'Directorate for Priority Crime', cases: mockEnforcementCases.filter(e => e.agency === 'HAWKS').length, status: 'CONNECTED' },
          { agency: 'NPA', full: 'National Prosecuting Authority', cases: mockEnforcementCases.filter(e => e.agency === 'NPA').length, status: 'CONNECTED' },
          { agency: 'AGSA', full: 'Auditor-General South Africa', cases: mockEnforcementCases.filter(e => e.agency === 'AGSA').length, status: 'CONNECTED' },
        ].map(a => {
          const ac = agencyColors[a.agency];
          return (
            <div key={a.agency} className={`bg-white border rounded-sm p-3 ${ac.border}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[13px] font-bold ${ac.text}`}>{a.agency}</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[#16a34a] text-[9px] font-bold uppercase">Live</span>
                </div>
              </div>
              <p className="text-[#64748b] text-[10px]">{a.full}</p>
              <p className="text-[#0f172a] font-mono font-bold text-lg mt-1">{a.cases}</p>
              <p className="text-[#334155] text-[10px]">active cases</p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader title="Enforcement Case Register" subtitle="Click any row to view evidence packages and case details" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Case Reference</th>
                <th>Agency</th>
                <th>Case Title</th>
                <th>Severity</th>
                <th className="text-right">Est. Loss</th>
                <th>Status</th>
                <th>Referred</th>
                <th>Evidence Pkgs</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockEnforcementCases.map(ec => <CaseRow key={ec.id} ec={ec} />)}
            </tbody>
          </table>
        </div>
      </Card>

      {/* LOOPHOLE #11: Referral tracking — compromised receiving official detection */}
      <div className="relative overflow-hidden border border-[#cbd5e1] rounded-sm bg-white px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#4a7ab5]" />
        <Clock size={15} className="text-[#0284c7] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#0284c7] font-bold text-[12px] uppercase tracking-wide">Loophole #11 Closed — Referral Tracking & Compromised Official Detection</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Once a case leaves SentinelProcure, it previously disappeared into a black box. Now every referral is tracked:
            acknowledgement deadlines, activity timelines, stall detection (no activity for 14+ days), and receiving officer risk scoring.
            Stalled cases are automatically escalated to the next level and flagged for independent verification.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader title="Referral Tracking Register" subtitle="Loophole #11 closed — every referral monitored post-submission, stalled cases auto-escalated" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Case Ref</th><th>Agency</th><th>Referred</th><th>Acknowledged</th>
                <th>Days Since Activity</th><th>Receiving Officer</th><th>Officer Risk</th>
                <th>Independent Verify</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReferralTracking.map(rt => (
                <tr key={rt.id} className={rt.stalledFlag ? 'bg-orange-950/10' : rt.status === 'PENDING_ACK' ? 'bg-yellow-950/10' : ''}>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{rt.caseRef}</span></td>
                  <td>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm border ${
                      rt.agency === 'SIU' ? 'text-[#dc2626] bg-red-950/60 border-red-900/60' :
                      rt.agency === 'HAWKS' ? 'text-[#ea580c] bg-orange-950/60 border-orange-900/60' :
                      'text-[#0284c7] bg-[#0c1e38] border-[#cbd5e1]'
                    }`}>{rt.agency}</span>
                  </td>
                  <td><span className="font-mono text-[#64748b] text-[11px]">{new Date(rt.referredAt).toLocaleDateString('en-ZA')}</span></td>
                  <td>
                    {rt.acknowledgedAt
                      ? <span className="font-mono text-[#16a34a] text-[11px]">{new Date(rt.acknowledgedAt).toLocaleDateString('en-ZA')}</span>
                      : <span className="text-[#dc2626] text-[11px] font-bold">NOT ACKNOWLEDGED</span>
                    }
                  </td>
                  <td>
                    <span className={`font-mono font-bold text-[12px] ${rt.daysSinceActivity > 14 ? 'text-[#dc2626]' : rt.daysSinceActivity > 7 ? 'text-[#ea580c]' : 'text-[#16a34a]'}`}>
                      {rt.daysSinceActivity}d
                    </span>
                    {rt.stalledFlag && (
                      <div className="flex items-center gap-1 text-[10px] text-[#ea580c] mt-0.5">
                        <AlertTriangle size={9} />STALLED — Auto-escalating
                      </div>
                    )}
                  </td>
                  <td>
                    <p className="text-[#334155] text-[11px]">{rt.receivingOfficer}</p>
                    {rt.receivingOfficerRiskScore > 50 && (
                      <p className="text-[#ea580c] text-[10px]">⚠ Officer risk score: {rt.receivingOfficerRiskScore}</p>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                        <div className="h-1.5 rounded-sm" style={{ width: `${rt.receivingOfficerRiskScore}%`, background: rt.receivingOfficerRiskScore > 50 ? '#f97316' : '#22c55e' }} />
                      </div>
                      <span className={`font-mono font-bold text-[11px] ${rt.receivingOfficerRiskScore > 50 ? 'text-[#ea580c]' : 'text-[#16a34a]'}`}>{rt.receivingOfficerRiskScore}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`flex items-center gap-1.5 text-[11px] ${rt.independentVerification ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                      {rt.independentVerification ? '✓ Verified' : '✗ Not verified'}
                    </div>
                  </td>
                  <td>
                    <Badge
                      label={rt.status.replace('_', ' ')}
                      variant="status"
                      status={rt.status === 'ACTIVE' ? 'CLEARED' : rt.status === 'STALLED' ? 'FLAGGED' : rt.status === 'PENDING_ACK' ? 'UNDER_REVIEW' : 'CLEARED'}
                      dot
                    />
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


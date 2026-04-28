
import { Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { IntegrityScore } from '../components/ui/IntegrityScore';
import { mockEmergencyTenders } from '../data/securityData2';

export function EmergencyProcurement() {
  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-[#d4a843]/40 rounded-sm bg-white px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4a843]" />
        <Zap size={15} className="text-[#d4a843] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#d4a843] font-bold text-[12px] uppercase tracking-wide">Emergency Procurement — Enhanced Scrutiny Mode (NOT Reduced)</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Emergency procurement is the highest-risk fraud vector in SA (PPE 2020: R14.3B lost). Speed is maintained but scrutiny is INCREASED, not reduced.
            Every emergency tender requires: independent oversight officer assignment, real-time price verification, ownership graph completion,
            and AGSA notification within 24 hours. Tenders without these controls are automatically suspended.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Emergency Tenders', value: mockEmergencyTenders.length, color: 'text-[#0f172a]' },
          { label: 'Oversight Assigned', value: mockEmergencyTenders.filter(e => e.independentOversightAssigned).length, color: 'text-[#16a34a]' },
          { label: 'Suspended (Controls Missing)', value: mockEmergencyTenders.filter(e => e.status === 'SUSPENDED').length, color: 'text-[#dc2626]' },
          { label: 'Price Verified', value: mockEmergencyTenders.filter(e => e.priceVerified).length, color: 'text-[#0284c7]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {mockEmergencyTenders.map(et => (
        <Card key={et.id} glow={et.status === 'SUSPENDED' ? 'red' : et.aiValidationScore < 50 ? 'orange' : 'none'}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#d4a843] bg-[#1a1205] border border-[#2a1f0a] px-2 py-0.5 rounded-sm uppercase tracking-wide">
                    {et.disasterType} Emergency
                  </span>
                  <Badge label={et.status} variant="status" status={et.status === 'AWARDED' ? 'CLEARED' : et.status === 'SUSPENDED' ? 'SUSPENDED' : 'UNDER_REVIEW'} dot />
                  <Badge label="ENHANCED SCRUTINY" variant="default" />
                </div>
                <p className="text-[#0f172a] font-bold text-[13px]">{et.title}</p>
                <p className="text-[#64748b] text-[11px] mt-0.5">{et.reference} · {et.department}</p>
                <p className="text-[#334155] text-[10px] mt-1 italic">{et.fastTrackJustification}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[#334155] text-[10px] uppercase tracking-wider">Contract Value</p>
                  <p className="text-[#0f172a] font-mono font-bold">R{(et.value / 1_000_000).toFixed(0)}M</p>
                </div>
                <IntegrityScore score={et.aiValidationScore} size="md" />
              </div>
            </div>

            {/* Control checklist */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Mandatory Controls Checklist</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Price Verification Completed', ok: et.priceVerified },
                    { label: 'Ownership Graph Completed', ok: et.ownershipVerified },
                    { label: 'Independent Oversight Assigned', ok: et.independentOversightAssigned },
                    { label: 'AGSA Notified', ok: et.independentOversightAssigned },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-2 text-[11px]">
                      {c.ok ? <CheckCircle size={11} className="text-[#16a34a] shrink-0" /> : <XCircle size={11} className="text-[#dc2626] shrink-0" />}
                      <span className={c.ok ? 'text-[#334155]' : 'text-[#dc2626]'}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Oversight Details</p>
                <div className="bg-white border border-[#e2e8f0] rounded-sm p-3 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#64748b]">Oversight Officer</span>
                    <span className={`font-semibold ${et.independentOversightAssigned ? 'text-[#0f172a]' : 'text-[#dc2626]'}`}>{et.oversightOfficer}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#64748b]">Declared</span>
                    <span className="font-mono text-[#334155]">{new Date(et.declaredAt).toLocaleDateString('en-ZA')}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#64748b]">Closing</span>
                    <span className="font-mono text-[#334155]">{new Date(et.closingDate).toLocaleDateString('en-ZA')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flags */}
            {et.flags.length > 0 && (
              <div className="mb-4">
                <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Active Flags</p>
                <div className="space-y-1">
                  {et.flags.map(f => (
                    <div key={f} className={`flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-sm border ${et.status === 'SUSPENDED' ? 'text-[#dc2626] bg-red-950/40 border-red-900/50' : 'text-yellow-500 bg-yellow-950/40 border-yellow-900/50'}`}>
                      <AlertTriangle size={10} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {et.status === 'SUSPENDED' && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-sm p-3 mb-4">
                <p className="text-[#dc2626] font-bold text-[12px]">TENDER SUSPENDED — Mandatory controls not completed</p>
                <p className="text-[#dc2626]/70 text-[11px] mt-0.5">Award is blocked until all mandatory controls are satisfied. This mirrors the PPE 2020 failure where emergency procurement bypassed all oversight.</p>
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-[#e2e8f0]">
              {!et.independentOversightAssigned && <button className="text-[11px] font-semibold text-[#d4a843] border border-[#2a1f0a] bg-[#1a1205] px-3 py-1.5 rounded-sm hover:bg-[#221808] transition-colors">Assign Oversight Officer</button>}
              <button className="text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">View Full Audit Trail</button>
              <button className="text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-1.5 rounded-sm hover:border-[#cbd5e1] transition-colors">Notify AGSA</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}


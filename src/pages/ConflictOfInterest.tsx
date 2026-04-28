
import { AlertTriangle, UserX, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { mockCommitteeMembers } from '../data/securityData2';

export function ConflictOfInterest() {
  const conflicts = mockCommitteeMembers.filter(m => m.conflictDetected);
  const nonCompliant = mockCommitteeMembers.filter(m => m.recusalRequired && !m.recusalComplied);
  const noDeclaration = mockCommitteeMembers.filter(m => !m.declarationSubmitted);

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-red-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
        <ShieldAlert size={15} className="text-[#dc2626] shrink-0 mt-0.5 pulse-critical" />
        <div>
          <p className="text-[#dc2626] font-bold text-[12px] uppercase tracking-wide">Evaluation Committee Conflict of Interest Monitor</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Every committee member's identity is cross-referenced against the ownership graph database, PEP lists, and vendor director records.
            Conflicts are detected automatically. Non-compliant recusals are escalated to the Accounting Officer and AGSA.
            This directly addresses the Zondo Commission finding that officials appoint themselves to evaluate tenders where they have undisclosed interests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Members Screened', value: mockCommitteeMembers.length, color: 'text-[#0f172a]' },
          { label: 'Conflicts Detected', value: conflicts.length, color: 'text-[#dc2626]' },
          { label: 'Recusal Non-Compliance', value: nonCompliant.length, color: 'text-[#dc2626]' },
          { label: 'Declarations Missing', value: noDeclaration.length, color: 'text-[#ea580c]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {nonCompliant.length > 0 && (
        <div className="relative overflow-hidden border border-red-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
          <p className="text-[#dc2626] font-bold text-[12px] uppercase tracking-wide mb-1">CRITICAL: Recusal Non-Compliance Detected</p>
          {nonCompliant.map(m => (
            <p key={m.id} className="text-[#64748b] text-[11px]">
              <span className="text-red-300 font-semibold">{m.name}</span> ({m.role} — {m.tenderRef}) has a confirmed conflict of interest but has NOT recused themselves. Tender award is BLOCKED pending resolution.
            </p>
          ))}
        </div>
      )}

      <Card>
        <CardHeader title="Committee Member Screening Register" subtitle="All members cross-referenced against ownership graphs, PEP lists, and vendor director records" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Member</th><th>Role</th><th>Tender Ref</th><th>Declaration</th>
                <th>Conflict Detected</th><th>Conflict Type</th><th>Recusal Required</th><th>Recusal Complied</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockCommitteeMembers.map(m => (
                <tr key={m.id} className={m.conflictDetected && !m.recusalComplied ? 'bg-red-950/10' : ''}>
                  <td>
                    <p className="text-[#0f172a] font-semibold text-[12px]">{m.name}</p>
                    <p className="text-[#334155] text-[10px] font-mono">{m.idNumber}</p>
                  </td>
                  <td><span className="text-[#64748b] text-[11px]">{m.role}</span></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{m.tenderRef}</span></td>
                  <td>
                    <div className={`flex items-center gap-1.5 text-[11px] ${m.declarationSubmitted ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                      {m.declarationSubmitted ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {m.declarationSubmitted ? 'Submitted' : 'MISSING'}
                    </div>
                  </td>
                  <td>
                    <div className={`flex items-center gap-1.5 text-[11px] ${m.conflictDetected ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                      {m.conflictDetected ? <AlertTriangle size={11} /> : <CheckCircle size={11} />}
                      {m.conflictDetected ? 'CONFLICT' : 'Clear'}
                    </div>
                  </td>
                  <td>
                    {m.conflictType ? (
                      <div>
                        <p className="text-[#dc2626] text-[11px] font-semibold">{m.conflictType}</p>
                        <p className="text-[#64748b] text-[10px] max-w-xs">{m.conflictDetail}</p>
                      </div>
                    ) : <span className="text-[#334155] text-[11px]">—</span>}
                  </td>
                  <td>
                    <div className={`flex items-center gap-1.5 text-[11px] ${m.recusalRequired ? 'text-[#ea580c]' : 'text-[#64748b]'}`}>
                      {m.recusalRequired ? <UserX size={11} /> : <CheckCircle size={11} />}
                      {m.recusalRequired ? 'REQUIRED' : 'Not required'}
                    </div>
                  </td>
                  <td>
                    {m.recusalRequired ? (
                      <div className={`flex items-center gap-1.5 text-[11px] ${m.recusalComplied ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                        {m.recusalComplied ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {m.recusalComplied ? 'Complied' : 'NON-COMPLIANT'}
                      </div>
                    ) : <span className="text-[#334155] text-[11px]">N/A</span>}
                  </td>
                  <td>
                    {m.conflictDetected && !m.recusalComplied ? (
                      <button className="text-[10px] font-bold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-2 py-1 rounded-sm hover:bg-red-950/60 transition-colors">
                        Block & Escalate
                      </button>
                    ) : (
                      <button className="text-[10px] font-bold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-2 py-1 rounded-sm hover:bg-[#0f2040] transition-colors">
                        View Graph
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Screening Methodology" subtitle="How conflicts are detected — multi-source cross-referencing" />
        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { check: 'Ownership Graph Cross-Reference', detail: 'Member ID cross-referenced against all vendor director and shareholder records in the ownership graph database', icon: '🔗' },
            { check: 'PEP Database Match', detail: 'Member and immediate family members checked against Politically Exposed Persons database — 94.1% confidence threshold', icon: '👤' },
            { check: 'Spouse / Family Screening', detail: 'Spouse, children, siblings, and parents of committee members screened against vendor ownership records', icon: '👨‍👩‍👧' },
            { check: 'Historical Tender Pattern', detail: 'Member\'s previous tender evaluations cross-referenced against vendors they evaluated — rotating bias detection', icon: '📊' },
            { check: 'Financial Disclosure Verification', detail: 'Declared financial interests verified against CIPC, SARS, and banking data — undisclosed interests flagged', icon: '💰' },
            { check: 'Department Isolation Rule', detail: 'Officials cannot evaluate tenders for their own department or any department where they have a reporting relationship', icon: '🏛️' },
          ].map(c => (
            <div key={c.check} className="bg-white border border-[#e2e8f0] rounded-sm p-3">
              <p className="text-[#0f172a] text-[12px] font-semibold mb-1">{c.icon} {c.check}</p>
              <p className="text-[#64748b] text-[11px] leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


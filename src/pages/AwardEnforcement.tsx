import { useState } from 'react';
import { Lock, ShieldOff, CheckCircle, AlertTriangle, Eye, FileCheck, Siren, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { IntegrityScore } from '../components/ui/IntegrityScore';

type AwardGateStatus = 'HARD_BLOCKED' | 'PENDING_SIGNATURES' | 'READY_TO_AWARD' | 'AWARDED';

interface AwardGate {
  tenderId: string;
  tenderRef: string;
  tenderTitle: string;
  tenderValue: number;
  integrityScore: number;
  riskLevel: string;
  hardBlocks: { reason: string; detail: string; resolvedBy: string | null }[];
  signatureChain: {
    step: number;
    role: string;
    name: string | null;
    signedAt: string | null;
    clearanceRequired: string;
    completed: boolean;
    blocked: boolean;
    blockReason?: string;
  }[];
  overrideAttempts: {
    by: string;
    role: string;
    attemptedAt: string;
    action: string;
    autoReferred: boolean;
    referredTo: string[];
    publiclyLogged: boolean;
  }[];
  status: AwardGateStatus;
}

const mockAwardGates: AwardGate[] = [
  {
    tenderId: 'T001',
    tenderRef: 'GT/DPW/2024/001',
    tenderTitle: 'Gauteng Road Infrastructure Rehabilitation Phase 3',
    tenderValue: 487_000_000,
    integrityScore: 12,
    riskLevel: 'CRITICAL',
    status: 'HARD_BLOCKED',
    hardBlocks: [
      { reason: 'Unresolved CRITICAL Flag - Specification Rigging', detail: 'RF001: 14 spec clauses match sole bidder catalogue. NLP confidence 97.3%. Cannot award until flag resolved by Accounting Officer + NT dual-auth.', resolvedBy: null },
      { reason: 'Unresolved CRITICAL Flag - Inflated Pricing', detail: 'RF002: Bid price 312% above benchmark. Aggregate BoQ overcharge R331M. Auto-block threshold exceeded.', resolvedBy: null },
      { reason: 'Beneficial Owner is PEP', detail: 'Ownership graph confirms beneficial owner is spouse of DPW official on evaluation committee. Award is legally void under PFMA s57.', resolvedBy: null },
      { reason: 'Evaluation Committee Conflict - Non-Compliant', detail: 'J. Mahlangu (Chairperson) has confirmed conflict of interest and has NOT recused. Award blocked until recusal complied or member replaced.', resolvedBy: null },
      { reason: 'Viability Block', detail: 'Vendor revenue (R8.5M) is 1.7% of contract value (R487M). Financially incapable of performing contract.', resolvedBy: null },
    ],
    signatureChain: [
      { step: 1, role: 'SCM Officer', name: null, signedAt: null, clearanceRequired: 'L3', completed: false, blocked: true, blockReason: 'Cannot sign while hard blocks are active' },
      { step: 2, role: 'Accounting Officer', name: null, signedAt: null, clearanceRequired: 'L4', completed: false, blocked: true, blockReason: 'Step 1 not completed' },
      { step: 3, role: 'National Treasury', name: null, signedAt: null, clearanceRequired: 'L5', completed: false, blocked: true, blockReason: 'Step 2 not completed' },
    ],
    overrideAttempts: [
      {
        by: 'N. Mokoena',
        role: 'SCM Officer',
        attemptedAt: '2024-11-09T14:22:00Z',
        action: 'Attempted to clear RF001 (Spec Rigging) to unblock award',
        autoReferred: true,
        referredTo: ['Auditor-General SA', 'SIU', 'National Treasury'],
        publiclyLogged: true,
      },
    ],
  },
  {
    tenderId: 'T006',
    tenderRef: 'NW/HOUSING/2024/021',
    tenderTitle: 'North West RDP Housing Development - 500 Units',
    tenderValue: 156_000_000,
    integrityScore: 5,
    riskLevel: 'CRITICAL',
    status: 'HARD_BLOCKED',
    hardBlocks: [
      { reason: 'Tender Suspended by System', detail: 'Automatic suspension triggered. Rotating winner pattern confirmed p < 0.001. Case SIU/2024/NW/0445 active.', resolvedBy: null },
      { reason: 'Vendor Blacklisted', detail: 'BuildRight NW Consortium is on the national blacklist. Award to a blacklisted entity is a criminal offence under PFMA.', resolvedBy: null },
      { reason: 'GPS Verification Spoofed', detail: 'Site visit GPS data confirmed spoofed. Photo EXIF places image in Johannesburg CBD. Payments frozen.', resolvedBy: null },
    ],
    signatureChain: [
      { step: 1, role: 'SCM Officer', name: null, signedAt: null, clearanceRequired: 'L3', completed: false, blocked: true, blockReason: 'Tender suspended - no signatures accepted' },
      { step: 2, role: 'Accounting Officer', name: null, signedAt: null, clearanceRequired: 'L4', completed: false, blocked: true, blockReason: 'Step 1 not completed' },
      { step: 3, role: 'National Treasury', name: null, signedAt: null, clearanceRequired: 'L5', completed: false, blocked: true, blockReason: 'Step 2 not completed' },
    ],
    overrideAttempts: [],
  },
  {
    tenderId: 'T004',
    tenderRef: 'EC/WATER/2024/033',
    tenderTitle: 'Eastern Cape Rural Water Reticulation',
    tenderValue: 312_000_000,
    integrityScore: 87,
    riskLevel: 'LOW',
    status: 'AWARDED',
    hardBlocks: [],
    signatureChain: [
      { step: 1, role: 'SCM Officer', name: 'P. Erasmus', signedAt: '2024-10-16T09:14:00Z', clearanceRequired: 'L3', completed: true, blocked: false },
      { step: 2, role: 'Accounting Officer', name: 'T. van Wyk', signedAt: '2024-10-16T11:30:00Z', clearanceRequired: 'L4', completed: true, blocked: false },
      { step: 3, role: 'National Treasury', name: 'Dr. M. Sithole (NT)', signedAt: '2024-10-17T08:00:00Z', clearanceRequired: 'L5', completed: true, blocked: false },
    ],
    overrideAttempts: [],
  },
  {
    tenderId: 'T008',
    tenderRef: 'NC/ENERGY/2024/009',
    tenderTitle: 'Northern Cape Solar Farm Grid Connection',
    tenderValue: 678_000_000,
    integrityScore: 93,
    riskLevel: 'LOW',
    status: 'PENDING_SIGNATURES',
    hardBlocks: [],
    signatureChain: [
      { step: 1, role: 'SCM Officer', name: 'A. Botha', signedAt: '2024-07-31T10:00:00Z', clearanceRequired: 'L3', completed: true, blocked: false },
      { step: 2, role: 'Accounting Officer', name: null, signedAt: null, clearanceRequired: 'L4', completed: false, blocked: false },
      { step: 3, role: 'National Treasury', name: null, signedAt: null, clearanceRequired: 'L5', completed: false, blocked: true, blockReason: 'Step 2 not completed' },
    ],
    overrideAttempts: [],
  },
];

function GateStatusBadge({ status }: { status: AwardGateStatus }) {
  const map = {
    HARD_BLOCKED:       { label: 'HARD BLOCKED',       cls: 'text-[#dc2626] bg-red-950/60 border-red-900/60' },
    PENDING_SIGNATURES: { label: 'PENDING SIGNATURES', cls: 'text-yellow-500 bg-yellow-950/60 border-yellow-900/60' },
    READY_TO_AWARD:     { label: 'READY TO AWARD',     cls: 'text-[#16a34a] bg-green-950/60 border-green-900/60' },
    AWARDED:            { label: 'AWARDED',             cls: 'text-[#0284c7] bg-[#0c1e38] border-[#cbd5e1]' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border ${cls}`}>
      {label}
    </span>
  );
}

function SignatureStep({ step }: { step: AwardGate['signatureChain'][0] }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-sm border ${
      step.completed ? 'bg-[#dcfce7] border-green-900/50' :
      step.blocked   ? 'bg-white border-[#e2e8f0]' :
                       'bg-[#0c1e38] border-[#cbd5e1]'
    }`}>
      <div className={`w-7 h-7 rounded-sm border flex items-center justify-center shrink-0 text-[11px] font-bold ${
        step.completed ? 'bg-green-950/60 border-green-900/60 text-[#16a34a]' :
        step.blocked   ? 'bg-white border-[#e2e8f0] text-[#334155]' :
                         'bg-[#0c1e38] border-[#d4a843]/40 text-[#d4a843]'
      }`}>
        {step.completed ? 'OK' : step.step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-[12px] font-semibold ${step.completed ? 'text-[#16a34a]' : step.blocked ? 'text-[#334155]' : 'text-[#0f172a]'}`}>
            {step.role}
          </p>
          <span className="text-[9px] font-bold text-[#334155] bg-[#f1f5f9] border border-[#e2e8f0] px-1.5 py-0.5 rounded-sm">
            Clearance {step.clearanceRequired} required
          </span>
        </div>
        {step.completed && step.name && (
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Signed by <span className="text-[#0f172a] font-semibold">{step.name}</span> at {new Date(step.signedAt!).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        )}
        {!step.completed && step.blocked && step.blockReason && (
          <p className="text-[#334155] text-[11px] mt-0.5 italic">{step.blockReason}</p>
        )}
        {!step.completed && !step.blocked && (
          <p className="text-[#d4a843] text-[11px] mt-0.5">Awaiting signature</p>
        )}
      </div>
    </div>
  );
}

function AwardGateCard({ gate }: { gate: AwardGate }) {
  const [expanded, setExpanded] = useState(gate.status === 'HARD_BLOCKED' || gate.overrideAttempts.length > 0);

  return (
    <Card glow={gate.status === 'HARD_BLOCKED' ? 'red' : gate.status === 'AWARDED' ? 'green' : 'none'}>
      <div className="p-4 cursor-pointer hover:bg-slate-700/10 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <IntegrityScore score={gate.integrityScore} size="sm" showLabel={false} />
            <div className="min-w-0">
              <p className="font-mono text-[#0284c7] text-[10px]">{gate.tenderRef}</p>
              <p className="text-[#0f172a] font-semibold text-[13px] leading-snug">{gate.tenderTitle}</p>
              <p className="text-[#64748b] text-[11px] mt-0.5">
                R{(gate.tenderValue / 1_000_000).toFixed(0)}M
                {gate.hardBlocks.length > 0 && (
                  <span className="ml-2 text-[#dc2626] font-semibold">{gate.hardBlocks.length} hard block{gate.hardBlocks.length !== 1 ? 's' : ''}</span>
                )}
                {gate.overrideAttempts.length > 0 && (
                  <span className="ml-2 text-[#ea580c] font-semibold">{gate.overrideAttempts.length} override attempt{gate.overrideAttempts.length !== 1 ? 's' : ''} logged</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <GateStatusBadge status={gate.status} />
            <button className="text-[#334155] hover:text-[#0284c7] transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#e2e8f0] p-4 space-y-4">
          {gate.hardBlocks.length > 0 && (
            <div>
              <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Lock size={9} /> Hard Blocks - Award Physically Impossible Until Resolved
              </p>
              <div className="space-y-2">
                {gate.hardBlocks.map((block, i) => (
                  <div key={i} className="flex items-start gap-2 bg-red-950/30 border border-red-900/50 rounded-sm p-3">
                    <ShieldOff size={13} className="text-[#dc2626] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#dc2626] font-bold text-[12px]">{block.reason}</p>
                      <p className="text-[#dc2626]/70 text-[11px] mt-0.5 leading-relaxed">{block.detail}</p>
                      {block.resolvedBy
                        ? <p className="text-[#16a34a] text-[10px] mt-1">Resolved by {block.resolvedBy}</p>
                        : <p className="text-[#334155] text-[10px] mt-1 italic">Unresolved - requires dual-authorisation to clear</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FileCheck size={9} /> Cryptographic Approval Chain - All 3 Signatures Required
            </p>
            <div className="space-y-2">
              {gate.signatureChain.map(step => <SignatureStep key={step.step} step={step} />)}
            </div>
            {gate.status === 'HARD_BLOCKED' && (
              <div className="mt-3 bg-white border border-[#e2e8f0] rounded-sm p-3">
                <p className="text-[#334155] text-[11px] leading-relaxed">
                  <span className="text-[#0f172a] font-semibold">Why signatures are disabled:</span> The signature chain is locked while any hard block is active.
                  No award button exists in the system. This is enforced at the API level - not just the UI.
                  Even a system administrator cannot bypass this without leaving a permanent, publicly visible audit trail.
                </p>
              </div>
            )}
            {gate.status === 'AWARDED' && (
              <div className="mt-3 bg-[#dcfce7] border border-green-900/50 rounded-sm p-3 flex items-center gap-2">
                <CheckCircle size={13} className="text-[#16a34a] shrink-0" />
                <p className="text-[#16a34a] text-[11px]">
                  Award completed. All 3 signatures verified. Immutable record created. Citizen Portal updated.
                </p>
              </div>
            )}
          </div>

          {gate.overrideAttempts.length > 0 && (
            <div>
              <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Siren size={9} /> Override Attempts - Automatically Referred and Publicly Logged
              </p>
              <div className="space-y-2">
                {gate.overrideAttempts.map((attempt, i) => (
                  <div key={i} className="bg-orange-950/30 border border-orange-900/50 rounded-sm p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[#ea580c] font-bold text-[12px]">
                          {attempt.by} ({attempt.role}) at {new Date(attempt.attemptedAt).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                        <p className="text-[#334155] text-[11px] mt-0.5">{attempt.action}</p>
                      </div>
                      <div className="shrink-0 space-y-1">
                        {attempt.autoReferred && (
                          <div className="flex items-center gap-1 text-[10px] text-[#dc2626] bg-red-950/40 border border-red-900/50 px-2 py-0.5 rounded-sm">
                            <Siren size={9} /> Auto-referred
                          </div>
                        )}
                        {attempt.publiclyLogged && (
                          <div className="flex items-center gap-1 text-[10px] text-[#0284c7] bg-[#0c1e38] border border-[#cbd5e1] px-2 py-0.5 rounded-sm">
                            <Eye size={9} /> Public record
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-[#64748b]">Auto-referred to:</span>
                      {attempt.referredTo.map(r => (
                        <span key={r} className="text-[10px] font-semibold text-purple-400 bg-purple-950/40 border border-purple-900/50 px-2 py-0.5 rounded-sm">{r}</span>
                      ))}
                    </div>
                    <p className="text-[#334155] text-[10px] mt-2 italic">
                      This attempt is permanently recorded on the immutable audit ledger and visible on the Citizen Transparency Portal.
                      The official cannot retract or delete this record.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gate.status === 'READY_TO_AWARD' && (
            <div className="pt-2 border-t border-[#e2e8f0]">
              <button className="w-full text-[12px] font-bold uppercase tracking-wide text-[#16a34a] border border-green-900/60 bg-green-950/40 py-2.5 rounded-sm hover:bg-green-950/60 transition-colors">
                Proceed to Award - All Conditions Met
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function AwardEnforcement() {
  const hardBlocked = mockAwardGates.filter(g => g.status === 'HARD_BLOCKED').length;
  const overrideAttempts = mockAwardGates.reduce((s, g) => s + g.overrideAttempts.length, 0);
  const awarded = mockAwardGates.filter(g => g.status === 'AWARDED').length;
  const pending = mockAwardGates.filter(g => g.status === 'PENDING_SIGNATURES').length;

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="bg-white border border-[#d4a843]/30 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <Lock size={16} className="text-[#d4a843] shrink-0 mt-0.5" />
          <div>
            <p className="text-[#d4a843] font-bold text-[13px] uppercase tracking-wide">Award Enforcement Engine - Hard Locks Active</p>
            <p className="text-[#64748b] text-[11px] mt-1 leading-relaxed max-w-4xl">
              A corrupt official cannot ignore flags and award anyway because <span className="text-[#0f172a] font-semibold">the award button does not exist</span> while any hard block is active.
              This is enforced at the API level - not just the UI. Every override attempt is automatically referred to the Auditor-General, SIU, and National Treasury
              within 60 seconds, and permanently published to the Citizen Portal. The official cannot un-ring that bell.
              Award requires 3 cryptographic signatures from 3 different officials at 3 different clearance levels.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Hard Blocked', value: hardBlocked, color: 'text-[#dc2626]', sub: 'Award physically impossible' },
          { label: 'Override Attempts', value: overrideAttempts, color: 'text-[#ea580c]', sub: 'Auto-referred to SIU/AGSA' },
          { label: 'Pending Signatures', value: pending, color: 'text-yellow-500', sub: 'Awaiting approval chain' },
          { label: 'Awarded (Clean)', value: awarded, color: 'text-[#16a34a]', sub: 'All conditions met' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
            <p className="text-[#334155] text-[10px] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="How Award is Prevented - The 4 Layers" subtitle="Each layer is independent. All 4 must be satisfied before an award can proceed." />
        <div className="p-4 grid grid-cols-4 gap-3">
          {[
            {
              layer: '1. Hard Blocks',
              icon: <Lock size={14} />,
              color: 'border-red-900/60',
              text: 'text-[#dc2626]',
              bg: 'bg-[#fee2e2]',
              points: [
                'Unresolved CRITICAL or HIGH flags = no award button',
                'Blacklisted vendor = award illegal under PFMA',
                'Conflict of interest non-compliance = award void',
                'Viability block = financially incapable vendor',
                'Suspended tender = award impossible',
              ],
            },
            {
              layer: '2. Signature Chain',
              icon: <FileCheck size={14} />,
              color: 'border-[#cbd5e1]',
              text: 'text-[#0284c7]',
              bg: 'bg-[#0c1e38]',
              points: [
                'SCM Officer (L3) signs first',
                'Accounting Officer (L4) countersigns',
                'National Treasury (L5) final approval',
                'Each signer must be a different person',
                'No signer can be from vendor department',
              ],
            },
            {
              layer: '3. Override Deterrence',
              icon: <Siren size={14} />,
              color: 'border-orange-900/60',
              text: 'text-[#ea580c]',
              bg: 'bg-orange-950/20',
              points: [
                'Override attempt auto-referred to AGSA in 60s',
                'SIU and NT notified simultaneously',
                'Official name published to Citizen Portal',
                'Record is permanent - cannot be deleted',
                '3+ attempts = automatic account suspension',
              ],
            },
            {
              layer: '4. Public Accountability',
              icon: <Eye size={14} />,
              color: 'border-purple-900/60',
              text: 'text-purple-400',
              bg: 'bg-purple-950/20',
              points: [
                'Every award decision visible on Citizen Portal',
                'Integrity score published alongside award',
                'All 3 signatories names are public record',
                'Any cleared flag before award is disclosed',
                'Post-award milestones tracked publicly',
              ],
            },
          ].map(l => (
            <div key={l.layer} className={`rounded-sm border p-3 ${l.bg} ${l.color}`}>
              <div className={`flex items-center gap-2 mb-2 ${l.text}`}>
                {l.icon}
                <p className="text-[11px] font-bold uppercase tracking-wide">{l.layer}</p>
              </div>
              <ul className="space-y-1.5">
                {l.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[10px] text-[#64748b]">
                    <span className="shrink-0 mt-0.5">-</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#0f172a] font-semibold text-[13px]">Tender Award Gates</p>
            <p className="text-[#64748b] text-[11px]">Live status of every tender in the award pipeline</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#dc2626] bg-red-950/40 border border-red-900/50 px-2.5 py-1.5 rounded-sm font-bold uppercase tracking-wide">
            <AlertTriangle size={10} />
            {hardBlocked} tenders hard-blocked
          </div>
        </div>
        <div className="space-y-3">
          {mockAwardGates.map(gate => <AwardGateCard key={gate.tenderId} gate={gate} />)}
        </div>
      </div>
    </div>
  );
}


import { Link, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockSubcontractors, type SubcontractorNode } from '../data/securityData2';

function TierNode({ node }: { node: SubcontractorNode }) {
  const indent = (node.tier - 1) * 24;
  const riskBorder = node.riskLevel === 'CRITICAL' ? 'border-red-900/60' : node.riskLevel === 'HIGH' ? 'border-orange-900/60' : node.riskLevel === 'MEDIUM' ? 'border-yellow-900/60' : 'border-[#e2e8f0]';
  const riskBg = node.riskLevel === 'CRITICAL' ? 'bg-[#fee2e2]' : node.riskLevel === 'HIGH' ? 'bg-orange-950/20' : 'bg-white';

  return (
    <div className="flex items-start gap-2" style={{ paddingLeft: indent }}>
      {node.tier > 1 && (
        <div className="flex flex-col items-center shrink-0 mt-1">
          <div className="w-4 h-px bg-[#1e3a5f]" />
        </div>
      )}
      <div className={`flex-1 border rounded-sm p-3 mb-2 ${riskBorder} ${riskBg}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <Building2 size={13} className={node.riskLevel === 'CRITICAL' ? 'text-[#dc2626]' : node.riskLevel === 'HIGH' ? 'text-[#ea580c]' : 'text-[#0284c7]'} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[#0f172a] font-semibold text-[12px]">{node.name}</p>
                <span className="text-[#334155] text-[10px] font-bold uppercase tracking-wide">Tier {node.tier}</span>
                <Badge label={node.riskLevel} variant="risk" riskLevel={node.riskLevel} dot />
              </div>
              <p className="text-[#334155] text-[10px] font-mono mt-0.5">{node.cipcNumber} · Registered: {node.registeredDate} · {node.employeeCount} employees</p>
              {node.linkedToOfficial && (
                <div className="flex items-start gap-1.5 mt-1.5">
                  <AlertTriangle size={10} className="text-[#dc2626] shrink-0 mt-0.5" />
                  <p className="text-[#dc2626] text-[10px] font-semibold">{node.officialLink}</p>
                </div>
              )}
              {node.flags.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {node.flags.map(f => (
                    <span key={f} className="text-[9px] text-[#dc2626] bg-red-950/50 border border-red-900/40 px-1.5 py-0.5 rounded-sm">{f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#0f172a] font-mono font-bold text-[12px]">R{(node.contractValue / 1_000_000).toFixed(0)}M</p>
            <p className="text-[#64748b] text-[10px]">{node.percentOfPrime.toFixed(1)}% of prime</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubcontractorChain() {
  const allNodes = mockSubcontractors.flatMap(s => s.chain);
  const officialLinked = allNodes.filter(n => n.linkedToOfficial).length;
  const criticalTier2 = allNodes.filter(n => n.tier > 1 && n.riskLevel === 'CRITICAL').length;

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-purple-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500" />
        <Link size={15} className="text-purple-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-purple-400 font-bold text-[12px] uppercase tracking-wide">Subcontractor Chain Monitor — Full Supply Chain Visibility</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            A vendor can win a clean tender then subcontract 80% to a shell company owned by the awarding official.
            This is how the Eskom R1B/month theft operated. Every subcontractor at every tier is now screened:
            ownership graphs run, official links detected, and suspicious tier-2/3 entities flagged automatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Contracts Monitored', value: mockSubcontractors.length, color: 'text-[#0f172a]' },
          { label: 'Total Subcontractors', value: allNodes.filter(n => n.tier > 1).length, color: 'text-[#0284c7]' },
          { label: 'Official-Linked Subcontractors', value: officialLinked, color: 'text-[#dc2626]' },
          { label: 'Critical Tier-2/3 Entities', value: criticalTier2, color: 'text-[#dc2626]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {mockSubcontractors.map(chain => (
        <Card key={chain.contractRef} glow={chain.chain.some(n => n.linkedToOfficial) ? 'red' : 'none'}>
          <CardHeader
            title={`${chain.primeContractor} — Supply Chain`}
            subtitle={`Contract: ${chain.contractRef} · ${chain.chain.length} entities in chain`}
            action={chain.chain.some(n => n.linkedToOfficial) ? <Badge label="OFFICIAL LINK DETECTED" variant="risk" riskLevel="CRITICAL" dot /> : <Badge label="CHAIN CLEAR" variant="status" status="CLEARED" />}
          />
          <div className="p-4">
            {chain.chain.map((node) => (
              <TierNode key={node.id} node={node} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}


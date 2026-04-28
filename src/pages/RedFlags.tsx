import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Clock, Hash, Lock } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockRedFlags, type RedFlag } from '../data/mockData';
import { mockOperationalExclusivity } from '../data/securityData2';
import { useScenario } from '../context/ScenarioContext';

function FlagRow({ flag }: { flag: RedFlag }) {
  const [expanded, setExpanded] = useState(false);

  const leftBorder: Record<string, string> = {
    CRITICAL: 'border-l-red-500',
    HIGH:     'border-l-orange-500',
    MEDIUM:   'border-l-yellow-500',
    LOW:      'border-l-green-500',
  };

  return (
    <>
      <tr
        className={`cursor-pointer border-l-2 ${leftBorder[flag.severity]}`}
        onClick={() => setExpanded(!expanded)}
      >
        <td>
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} className={
              flag.severity === 'CRITICAL' ? 'text-[#dc2626]' :
              flag.severity === 'HIGH' ? 'text-[#ea580c]' : 'text-yellow-500'
            } />
            <span className="font-mono text-[#0284c7] text-[11px]">{flag.id}</span>
          </div>
        </td>
        <td><Badge label={flag.severity} variant="risk" riskLevel={flag.severity} dot /></td>
        <td><span className="text-[#0f172a] font-medium text-[12px]">{flag.type}</span></td>
        <td><span className="font-mono text-[#0284c7] text-[11px]">{flag.tenderRef}</span></td>
        <td>
          <p className="text-[#334155] text-[11px] max-w-xs truncate">{flag.description}</p>
        </td>
        <td><span className="text-[#64748b] text-[11px] font-mono">{flag.agentName}</span></td>
        <td>
          <div className="flex items-center gap-1 text-[#64748b] text-[11px]">
            <Clock size={10} />
            {new Date(flag.detectedAt).toLocaleDateString('en-ZA')}
          </div>
        </td>
        <td><Badge label={flag.status} variant="status" status={flag.status} /></td>
        <td>
          <button className="text-[#334155] hover:text-[#0284c7] transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={9} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4">
              <div className="grid grid-cols-3 gap-6">
                {/* Evidence */}
                <div className="col-span-2">
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Hash size={9} /> Evidence Trail — XAI Report
                  </p>
                  <div className="bg-white border border-[#e2e8f0] rounded-sm p-3">
                    <p className="text-[#334155] text-[12px] leading-relaxed mb-2">{flag.description}</p>
                    <div className="border-t border-[#e2e8f0] pt-2 mt-2">
                      <p className="text-[#0284c7] text-[11px] font-semibold mb-1">Supporting Evidence:</p>
                      <p className="text-[#64748b] text-[11px] leading-relaxed font-mono">{flag.evidence}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Recommended Actions</p>
                  <div className="space-y-1.5 mb-4">
                    {flag.severity === 'CRITICAL' && (
                      <>
                        <ActionItem label="Suspend tender pending investigation" level="critical" />
                        <ActionItem label="Refer to SIU and Auditor-General" level="critical" />
                        <ActionItem label="Request SCM official justification" level="high" />
                      </>
                    )}
                    {flag.severity === 'HIGH' && (
                      <>
                        <ActionItem label="Place under enhanced review" level="high" />
                        <ActionItem label="Request additional documentation" level="high" />
                        <ActionItem label="Notify accounting officer" level="medium" />
                      </>
                    )}
                    {(flag.severity === 'MEDIUM' || flag.severity === 'LOW') && (
                      <>
                        <ActionItem label="Log for monitoring" level="medium" />
                        <ActionItem label="Request clarification from bidder" level="medium" />
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button className="w-full text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors text-left">
                      Generate XAI Report
                    </button>
                    <button className="w-full text-[11px] font-semibold text-purple-400 border border-purple-900/60 bg-purple-950/40 px-3 py-1.5 rounded-sm hover:bg-purple-950/60 transition-colors text-left">
                      Escalate to SIU
                    </button>
                    <button className="w-full text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-1.5 rounded-sm hover:border-[#cbd5e1] transition-colors text-left">
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ActionItem({ label, level }: { label: string; level: 'critical' | 'high' | 'medium' }) {
  const styles = {
    critical: 'text-[#dc2626] border-red-900/60 bg-red-950/40',
    high:     'text-[#ea580c] border-orange-900/60 bg-orange-950/40',
    medium:   'text-yellow-500 border-yellow-900/60 bg-yellow-950/40',
  };
  return (
    <div className={`flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-sm border ${styles[level]}`}>
      <span className="w-1 h-1 rounded-full bg-current shrink-0" />
      {label}
    </div>
  );
}

export function RedFlags() {
  const { scenarioData } = useScenario();
  const [filter, setFilter] = useState<string>('ALL');
  const filters = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'OPEN', 'INVESTIGATING', 'ESCALATED'];

  const allRedFlags = [...(scenarioData?.redFlags || []), ...mockRedFlags];

  const filtered = allRedFlags.filter(flag => {
    if (filter === 'ALL') return true;
    return (flag.severity as string) === filter || (flag.status as string) === filter;
  });

  const summaryStats = [
    { label: 'Total Active Flags', value: allRedFlags.filter(f => f.status !== 'RESOLVED').length, color: 'text-[#0f172a]' },
    { label: 'Critical Severity', value: allRedFlags.filter(f => f.severity === 'CRITICAL').length, color: 'text-[#dc2626]' },
    { label: 'Under Investigation', value: allRedFlags.filter(f => f.status === 'INVESTIGATING').length, color: 'text-yellow-500' },
    { label: 'Escalated to SIU', value: allRedFlags.filter(f => f.status === 'ESCALATED').length, color: 'text-purple-400' },
  ];

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <span className="text-[#334155] text-[10px] font-bold uppercase tracking-widest">Filter:</span>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-sm border transition-colors ${
              filter === f
                ? 'bg-[#0c1e38] border-[#cbd5e1] text-[#0284c7]'
                : 'bg-white border-[#e2e8f0] text-[#334155] hover:text-[#64748b] hover:border-[#cbd5e1]'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[#334155] text-[11px] font-mono">{filtered.length} records</span>
      </div>

      {/* Table */}
      <Card>
        <CardHeader title="Active Red Flags" subtitle="Click any row to expand evidence trail and recommended actions" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Flag ID</th>
                <th>Severity</th>
                <th>Type</th>
                <th>Tender Ref</th>
                <th>Description</th>
                <th>Detecting Agent</th>
                <th>Detected</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(flag => <FlagRow key={flag.id} flag={flag} />)}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#334155] text-[12px]">No flags match the selected filter.</div>
          )}
        </div>
      </Card>

      {/* LOOPHOLE #10: Operational exclusivity detection */}
      <div className="relative overflow-hidden border border-yellow-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-500" />
        <Lock size={15} className="text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-500 font-bold text-[12px] uppercase tracking-wide">Loophole #10 Closed — Operational Exclusivity Detection</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            NLP alone cannot detect specs that are linguistically neutral but operationally exclusive — e.g. requiring an ISO sub-category held by only 1 supplier,
            a 14-day delivery window only achievable with pre-positioned stock, or a proprietary software system sold by a bidder.
            The Operational Exclusivity Engine cross-references spec requirements against market availability data to detect these patterns.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Operational Exclusivity Flags"
          subtitle="Specs that are linguistically neutral but effectively exclude all but one supplier — beyond NLP detection"
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Tender Ref</th><th>Flag Type</th><th>Description</th><th>Market Impact</th>
                <th className="text-right">Excluded</th><th className="text-right">Capable</th>
                <th className="text-right">Confidence</th><th>Severity</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOperationalExclusivity.map(oe => (
                <tr key={oe.id} className={oe.severity === 'CRITICAL' ? 'bg-red-950/10' : 'bg-orange-950/10'}>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{oe.tenderRef}</span></td>
                  <td>
                    <span className="text-[11px] font-semibold text-[#ea580c]">
                      {oe.flagType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td><p className="text-[#334155] text-[11px] max-w-xs leading-relaxed">{oe.description}</p></td>
                  <td><p className="text-[#64748b] text-[11px] max-w-xs leading-relaxed">{oe.marketImpact}</p></td>
                  <td className="text-right"><span className="font-mono font-bold text-[#dc2626]">{oe.suppliersExcluded}</span></td>
                  <td className="text-right"><span className="font-mono font-bold text-[#0f172a]">{oe.suppliersCapable}</span></td>
                  <td className="text-right">
                    <span className={`font-mono font-bold text-[12px] ${oe.confidence >= 95 ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>
                      {oe.confidence}%
                    </span>
                  </td>
                  <td><Badge label={oe.severity} variant="risk" riskLevel={oe.severity} dot /></td>
                  <td><Badge label={oe.status} variant="status" status={oe.status === 'OPEN' ? 'FLAGGED' : oe.status === 'INVESTIGATING' ? 'UNDER_REVIEW' : 'CLEARED'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


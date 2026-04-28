import { Eye, Shield, Activity, Zap, Bot, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockAgentActivity } from '../data/mockData';
import { mockRotationPatterns, mockScoreGamingAlerts } from '../data/securityData2';

const agentProfiles = [
  {
    name: 'NLP-Spec-Auditor-v2',
    type: 'WATCHDOG',
    description: 'Scans tender specifications in real-time for biased, restrictive, or brand-specific language that may favour a particular vendor.',
    status: 'ACTIVE' as const,
    scansToday: 47, flagsRaised: 3, accuracy: 97.3,
    icon: <Eye size={14} />, color: 'blue',
  },
  {
    name: 'Entity-Resolution-Engine',
    type: 'WATCHDOG',
    description: 'Traverses ownership graphs across CSD, CIPC, SARS, and banking data to uncover hidden beneficial ownership and fronting schemes.',
    status: 'ACTIVE' as const,
    scansToday: 312, flagsRaised: 8, accuracy: 94.1,
    icon: <Shield size={14} />, color: 'purple',
  },
  {
    name: 'Market-Intelligence-Engine',
    type: 'WATCHDOG',
    description: 'Compares bid prices against 47 benchmarks from local and global procurement databases to detect price padding and gold-plating.',
    status: 'ACTIVE' as const,
    scansToday: 89, flagsRaised: 5, accuracy: 91.8,
    icon: <Activity size={14} />, color: 'green',
  },
  {
    name: 'Collusion-Detection-Agent',
    type: 'GUARDIAN',
    description: 'Identifies rotating winner patterns, identical bid structures, and shared metadata across different departments and time periods.',
    status: 'INTERVENING' as const,
    scansToday: 156, flagsRaised: 4, accuracy: 89.2,
    icon: <Zap size={14} />, color: 'orange',
  },
  {
    name: 'Autonomous-Mitigation-Agent',
    type: 'GUARDIAN',
    description: 'Intervenes during the procurement process by requesting justifications for deviations and suggesting neutral re-specifications.',
    status: 'INTERVENING' as const,
    scansToday: 23, flagsRaised: 2, accuracy: 96.5,
    icon: <Bot size={14} />, color: 'red',
  },
  {
    name: 'Compliance-as-Code-Engine',
    type: 'COMPLIANCE',
    description: 'Dynamically applies B-BBEE, PPPFA, and local content rules to every evaluation, ensuring regulatory compliance at every step.',
    status: 'IDLE' as const,
    scansToday: 247, flagsRaised: 0, accuracy: 99.9,
    icon: <Shield size={14} />, color: 'green',
  },
  {
    name: 'Whistleblower-Triage-NLP',
    type: 'WATCHDOG',
    description: 'Categorises and prioritises anonymous tips using NLP, routing high-confidence alerts directly into the risk engine and SIU.',
    status: 'ACTIVE' as const,
    scansToday: 12, flagsRaised: 3, accuracy: 88.7,
    icon: <Eye size={14} />, color: 'yellow',
  },
];

const colorMap: Record<string, { border: string; iconBg: string; iconText: string }> = {
  blue:   { border: 'border-[#cbd5e1]',    iconBg: 'bg-[#0c1e38]',    iconText: 'text-[#0284c7]' },
  purple: { border: 'border-purple-900/60', iconBg: 'bg-purple-950/60', iconText: 'text-purple-400' },
  green:  { border: 'border-green-900/60',  iconBg: 'bg-green-950/60',  iconText: 'text-[#16a34a]' },
  orange: { border: 'border-orange-900/60', iconBg: 'bg-orange-950/60', iconText: 'text-[#ea580c]' },
  red:    { border: 'border-red-900/60',    iconBg: 'bg-red-950/60',    iconText: 'text-[#dc2626]' },
  yellow: { border: 'border-yellow-900/60', iconBg: 'bg-yellow-950/60', iconText: 'text-yellow-500' },
};

const statusDot: Record<string, string> = {
  ACTIVE:       'bg-green-500',
  IDLE:         'bg-[#2a4a6b]',
  INTERVENING:  'bg-orange-500 pulse-critical',
};

export function Agents() {
  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Agents', value: agentProfiles.filter(a => a.status === 'ACTIVE').length, color: 'text-[#16a34a]' },
          { label: 'Currently Intervening', value: agentProfiles.filter(a => a.status === 'INTERVENING').length, color: 'text-[#ea580c]' },
          { label: 'Total Scans Today', value: agentProfiles.reduce((s, a) => s + a.scansToday, 0), color: 'text-[#0284c7]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Agent registry table */}
      <Card>
        <CardHeader title="Agent Registry" subtitle="Autonomous AI agents — Sentinel Framework v2.4" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-right">Scans Today</th>
                <th className="text-right">Flags Raised</th>
                <th className="text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {agentProfiles.map(agent => {
                const c = colorMap[agent.color];
                return (
                  <tr key={agent.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-sm border ${c.iconBg} ${c.border} ${c.iconText} shrink-0`}>
                          {agent.icon}
                        </div>
                        <span className="text-[#0f172a] font-mono text-[11px] font-semibold">{agent.name}</span>
                      </div>
                    </td>
                    <td><Badge label={agent.type} variant="default" /></td>
                    <td><p className="text-[#64748b] text-[11px] max-w-xs">{agent.description}</p></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[agent.status]}`} />
                        <Badge label={agent.status} variant="status" status={agent.status} />
                      </div>
                    </td>
                    <td className="text-right"><span className="font-mono text-[#0f172a]">{agent.scansToday}</span></td>
                    <td className="text-right">
                      <span className={`font-mono font-bold ${agent.flagsRaised > 0 ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                        {agent.flagsRaised}
                      </span>
                    </td>
                    <td className="text-right"><span className="font-mono text-[#16a34a] font-semibold">{agent.accuracy}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Activity log */}
      <Card>
        <CardHeader title="Immutable Activity Log" subtitle="Blockchain-backed audit trail — all agent actions are permanently recorded" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Timestamp (SAST)</th>
                <th>Agent</th>
                <th>Type</th>
                <th>Action</th>
                <th>Target</th>
                <th>Outcome</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAgentActivity.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-1.5 text-[#64748b]">
                      <Clock size={10} />
                      <span className="font-mono text-[11px]">
                        {new Date(a.timestamp).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'medium' })}
                      </span>
                    </div>
                  </td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{a.agentName}</span></td>
                  <td><Badge label={a.agentType} variant="default" /></td>
                  <td><span className="text-[#334155] text-[12px]">{a.action}</span></td>
                  <td><span className="font-mono text-[#64748b] text-[11px]">{a.target}</span></td>
                  <td><span className="text-[#64748b] text-[11px]">{a.outcome}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[a.status]}`} />
                      <Badge label={a.status} variant="status" status={a.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* LOOPHOLE #9: Extended 60-month rotation pattern detection */}
      <div className="relative overflow-hidden border border-orange-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
        <RefreshCw size={15} className="text-[#ea580c] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#ea580c] font-bold text-[12px] uppercase tracking-wide">Loophole #9 Closed — 60-Month Rotation Pattern Detection + Re-Entry Alert</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            The previous 36-month window allowed rings to go dormant for 24 months and re-enter clean. The window is now 60 months.
            Additionally, re-entry detection flags any entity that was dormant for 18+ months and is now bidding again — regardless of pattern score.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader title="Collusion Ring Pattern Analysis — 60-Month Window" subtitle="Extended detection window closes the long-cycle dormancy loophole" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Pattern ID</th><th>Entities in Ring</th><th>Window</th><th>Tenders Analysed</th>
                <th>Win Distribution</th><th>Confidence</th><th>Dormancy</th><th>Re-Entry</th><th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {mockRotationPatterns.map(p => (
                <tr key={p.id} className={p.reEntryDetected ? 'bg-orange-950/10' : p.riskLevel === 'CRITICAL' ? 'bg-red-950/10' : ''}>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{p.id}</span></td>
                  <td>
                    <div className="space-y-0.5">
                      {p.entities.map(e => <p key={e} className="text-[#334155] text-[11px]">{e}</p>)}
                    </div>
                  </td>
                  <td><span className="font-mono text-[#0f172a] font-bold">{p.windowMonths}mo</span></td>
                  <td><span className="font-mono text-[#0f172a]">{p.tendersAnalysed}</span></td>
                  <td>
                    <div className="space-y-0.5">
                      {Object.entries(p.winsPerEntity).map(([entity, wins]) => (
                        <div key={entity} className="flex items-center gap-2 text-[10px]">
                          <span className="text-[#64748b] truncate max-w-[120px]">{entity.split(' ')[0]}</span>
                          <span className="font-mono text-[#0f172a] font-bold">{wins} wins</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`font-mono font-bold text-[12px] ${p.patternConfidence >= 90 ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>
                      {p.patternConfidence}%
                    </span>
                  </td>
                  <td>
                    <span className={`font-mono text-[11px] ${p.dormancyMonths > 0 ? 'text-[#ea580c]' : 'text-[#64748b]'}`}>
                      {p.dormancyMonths > 0 ? `${p.dormancyMonths}mo dormant` : 'Active'}
                    </span>
                  </td>
                  <td>
                    {p.reEntryDetected ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#ea580c] font-bold mb-0.5">
                          <AlertTriangle size={10} />RE-ENTRY DETECTED
                        </div>
                        <p className="text-[#64748b] text-[10px] max-w-xs">{p.reEntryDetail}</p>
                      </div>
                    ) : <span className="text-[#334155] text-[11px]">—</span>}
                  </td>
                  <td><Badge label={p.riskLevel} variant="risk" riskLevel={p.riskLevel} dot /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* LOOPHOLE #14: Score gaming detection */}
      <Card>
        <CardHeader
          title="Integrity Score Gaming Detection — Loophole #14 Closed"
          subtitle="Detects vendors structuring bids to stay just below detection thresholds — threshold-boundary pricing, cover bids, score calibration"
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Tender Ref</th><th>Vendor</th><th>Pattern Detected</th><th>Detail</th><th>Confidence</th><th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {mockScoreGamingAlerts.map(sg => (
                <tr key={sg.id} className="bg-orange-950/10">
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{sg.tenderRef}</span></td>
                  <td><span className="text-[#0f172a] font-semibold text-[12px]">{sg.vendorName}</span></td>
                  <td>
                    <span className="text-[#ea580c] font-semibold text-[11px]">{sg.detectedPattern}</span>
                  </td>
                  <td><p className="text-[#64748b] text-[11px] max-w-sm leading-relaxed">{sg.detail}</p></td>
                  <td><span className={`font-mono font-bold text-[12px] ${sg.confidence >= 90 ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>{sg.confidence}%</span></td>
                  <td><Badge label={sg.severity} variant="risk" riskLevel={sg.severity} dot /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Anti-Gaming Measures Active</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { measure: 'Randomised Threshold Jitter', detail: 'Auto-block thresholds vary ±15% randomly per tender — vendors cannot reliably target a specific boundary' },
              { measure: 'Aggregate BoQ Analysis', detail: 'Total bid value checked against total benchmark regardless of individual line item scores' },
              { measure: 'Statistical Boundary Detection', detail: 'Bids where all items cluster within 5% of a threshold trigger automatic gaming flag' },
            ].map(m => (
              <div key={m.measure} className="bg-white border border-[#e2e8f0] rounded-sm p-3">
                <p className="text-[#0f172a] text-[11px] font-semibold mb-1">{m.measure}</p>
                <p className="text-[#64748b] text-[10px] leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}


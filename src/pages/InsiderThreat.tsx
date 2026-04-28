
import { Clock, Monitor } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { mockInsiderEvents, mockSystemUsers } from '../data/securityData2';

const anomalyColors: Record<string, string> = {
  'Unauthorised Override Attempt': 'text-[#dc2626] bg-red-950/40 border-red-900/50',
  'After-Hours Sensitive Access': 'text-[#dc2626] bg-red-950/40 border-red-900/50',
  'Conflict of Interest — Same Department': 'text-[#ea580c] bg-orange-950/40 border-orange-900/50',
  'Conflict of Interest — Linked Department': 'text-[#ea580c] bg-orange-950/40 border-orange-900/50',
  'Unusual Hours + Bulk Data Export': 'text-[#dc2626] bg-red-950/40 border-red-900/50',
};

export function InsiderThreat() {
  const flagged = mockInsiderEvents.filter(e => e.flagged).length;
  const unreviewed = mockInsiderEvents.filter(e => e.flagged && !e.reviewed).length;
  const highRisk = mockSystemUsers.filter(u => u.riskScore >= 70).length;

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-red-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
        <Monitor size={15} className="text-[#dc2626] shrink-0 mt-0.5 pulse-critical" />
        <div>
          <p className="text-[#dc2626] font-bold text-[12px] uppercase tracking-wide">Insider Threat Detection — All User Actions Monitored</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            The most dangerous attack vector is a legitimate user with elevated privileges. Every action taken within SentinelProcure
            is logged, timestamped, and analysed for anomalies: after-hours access, bulk data exports, override attempts, and
            conflict-of-interest violations. High-risk users are automatically flagged for review and their actions require additional authorisation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Events Monitored Today', value: mockInsiderEvents.length, color: 'text-[#0f172a]' },
          { label: 'Flagged Events', value: flagged, color: 'text-[#dc2626]' },
          { label: 'Awaiting Review', value: unreviewed, color: 'text-[#ea580c]' },
          { label: 'High-Risk Users', value: highRisk, color: 'text-[#dc2626]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="Anomalous Activity Log" subtitle="All flagged user actions — reviewed by independent internal audit team" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th><th>User</th><th>Role</th><th>Action</th>
                <th>Target</th><th>IP Address</th><th>Risk Score</th><th>Anomaly Type</th><th>Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {mockInsiderEvents.map(event => (
                <tr key={event.id} className={event.flagged && !event.reviewed ? 'bg-red-950/10' : ''}>
                  <td>
                    <div className="flex items-center gap-1.5 text-[#64748b]">
                      <Clock size={10} />
                      <span className="font-mono text-[11px]">{new Date(event.timestamp).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </td>
                  <td><span className="text-[#0f172a] font-semibold text-[12px]">{event.userName}</span></td>
                  <td><span className="text-[#64748b] text-[11px]">{event.userRole.replace('_', ' ')}</span></td>
                  <td><span className="text-[#334155] text-[11px]">{event.action}</span></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{event.target}</span></td>
                  <td><span className="font-mono text-[#334155] text-[11px]">{event.ipAddress}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                        <div className="h-1.5 rounded-sm" style={{ width: `${event.riskScore}%`, background: event.riskScore >= 80 ? '#ef4444' : event.riskScore >= 50 ? '#f97316' : '#22c55e' }} />
                      </div>
                      <span className={`font-mono font-bold text-[12px] ${event.riskScore >= 80 ? 'text-[#dc2626]' : event.riskScore >= 50 ? 'text-[#ea580c]' : 'text-[#16a34a]'}`}>{event.riskScore}</span>
                    </div>
                  </td>
                  <td>
                    {event.anomalyType ? (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border ${anomalyColors[event.anomalyType] ?? 'text-[#ea580c] bg-orange-950/40 border-orange-900/50'}`}>
                        {event.anomalyType}
                      </span>
                    ) : <span className="text-[#334155] text-[11px]">Normal</span>}
                  </td>
                  <td>
                    {event.reviewed
                      ? <span className="text-[#16a34a] text-[11px]">✓ Reviewed</span>
                      : event.flagged
                        ? <button className="text-[10px] font-bold text-[#ea580c] border border-orange-900/60 bg-orange-950/40 px-2 py-0.5 rounded-sm hover:bg-orange-950/60 transition-colors">Review</button>
                        : <span className="text-[#334155] text-[11px]">—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Detection Rules" subtitle="Automated anomaly detection — triggers immediate review queue" />
        <div className="p-4 grid grid-cols-2 gap-3">
          {[
            { rule: 'After-Hours Access to Sensitive Data', detail: 'Access to whistleblower tips, ownership graphs, or enforcement cases between 20:00–06:00 SAST triggers immediate alert' },
            { rule: 'Override Attempt on Own Department', detail: 'Any attempt to clear a flag or approve a tender in the user\'s own department is blocked and logged as a conflict of interest' },
            { rule: 'Bulk Data Export', detail: 'Exports of >100 records trigger review. Exports of >500 records require dual authorisation and AGSA notification' },
            { rule: 'Rapid Sequential Actions', detail: '>20 actions in 10 minutes triggers rate-limiting and anomaly flag — possible automated script or compromised session' },
            { rule: 'Repeated Failed Override Attempts', detail: '3+ failed override attempts in 24 hours results in automatic account suspension pending review' },
            { rule: 'Whistleblower Tip Access by Accused Department', detail: 'Officials from a department named in a tip cannot access that tip — routing is automatically redirected to SIU Liaison' },
          ].map(r => (
            <div key={r.rule} className="bg-white border border-[#e2e8f0] rounded-sm p-3">
              <p className="text-[#0f172a] text-[12px] font-semibold mb-1">{r.rule}</p>
              <p className="text-[#64748b] text-[11px] leading-relaxed">{r.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


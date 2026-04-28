
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockVariationOrders } from '../data/securityData2';

export function VariationOrders() {
  const blocked = mockVariationOrders.filter(v => v.status === 'BLOCKED').length;
  const flagged = mockVariationOrders.filter(v => v.status === 'FLAGGED').length;
  const totalVOValue = mockVariationOrders.reduce((s, v) => s + v.voValue, 0);

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-orange-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
        <TrendingUp size={15} className="text-[#ea580c] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#ea580c] font-bold text-[12px] uppercase tracking-wide">Variation Order Monitor — Cumulative Limit Enforcement</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Post-award variation orders are the most common mechanism for inflating contract values after a clean award.
            Cumulative VOs exceeding 15% trigger mandatory review. VOs exceeding 30% are automatically blocked and require
            dual authorisation from the Accounting Officer and National Treasury. Early VOs (within 30 days of award) are flagged as a pattern indicator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total VOs Submitted', value: mockVariationOrders.length, color: 'text-[#0f172a]' },
          { label: 'Auto-Blocked', value: blocked, color: 'text-[#dc2626]' },
          { label: 'Flagged for Review', value: flagged, color: 'text-[#ea580c]' },
          { label: 'Total VO Value', value: `R${(totalVOValue / 1_000_000).toFixed(1)}M`, color: 'text-[#d4a843]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="Variation Order Register" subtitle="All VOs tracked cumulatively — automatic block at 30% threshold" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>VO Number</th><th>Contract Ref</th><th>Project</th><th>Description</th>
                <th className="text-right">Original Value</th><th className="text-right">VO Value</th>
                <th>Cumulative %</th><th>Approved By</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockVariationOrders.map(vo => {
                const cumColor = vo.cumulativePercent >= 30 ? 'text-[#dc2626]' : vo.cumulativePercent >= 15 ? 'text-[#ea580c]' : 'text-[#16a34a]';
                return (
                  <tr key={vo.id} className={vo.status === 'BLOCKED' ? 'bg-red-950/10' : vo.status === 'FLAGGED' ? 'bg-orange-950/10' : ''}>
                    <td><span className="font-mono text-[#0284c7] text-[11px]">{vo.voNumber}</span></td>
                    <td><span className="font-mono text-[#0284c7] text-[11px]">{vo.contractRef}</span></td>
                    <td><span className="text-[#0f172a] text-[12px]">{vo.project}</span></td>
                    <td>
                      <p className="text-[#334155] text-[11px] max-w-xs">{vo.description}</p>
                      {vo.aiFlag && (
                        <div className="flex items-start gap-1.5 mt-1">
                          <AlertTriangle size={10} className="text-[#dc2626] shrink-0 mt-0.5" />
                          <p className="text-[#dc2626] text-[10px] leading-relaxed">{vo.aiFlag}</p>
                        </div>
                      )}
                    </td>
                    <td className="text-right"><span className="font-mono text-[#334155]">R{(vo.originalValue / 1_000_000).toFixed(0)}M</span></td>
                    <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(vo.voValue / 1_000_000).toFixed(1)}M</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                          <div className="h-1.5 rounded-sm" style={{ width: `${Math.min(vo.cumulativePercent, 100)}%`, background: vo.cumulativePercent >= 30 ? '#ef4444' : vo.cumulativePercent >= 15 ? '#f97316' : '#22c55e' }} />
                        </div>
                        <span className={`font-mono font-bold text-[12px] ${cumColor}`}>{vo.cumulativePercent.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td><span className="text-[#64748b] text-[11px]">{vo.approvedBy}</span></td>
                    <td>
                      <Badge
                        label={vo.status}
                        variant="status"
                        status={vo.status === 'APPROVED' ? 'CLEARED' : vo.status === 'BLOCKED' ? 'SUSPENDED' : vo.status === 'FLAGGED' ? 'FLAGGED' : vo.status === 'REJECTED' ? 'SUSPENDED' : 'UNDER_REVIEW'}
                        dot
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="VO Threshold Rules" subtitle="Automatic enforcement — cannot be bypassed without dual authorisation" />
        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { threshold: '0–15% cumulative', action: 'Standard approval — SCM Officer', color: 'border-green-900/50', text: 'text-[#16a34a]' },
            { threshold: '15–30% cumulative', action: 'Enhanced review — Accounting Officer approval required', color: 'border-orange-900/60', text: 'text-[#ea580c]' },
            { threshold: '>30% cumulative', action: 'AUTO-BLOCKED — Dual auth: Accounting Officer + National Treasury', color: 'border-red-900/60', text: 'text-[#dc2626]' },
          ].map(r => (
            <div key={r.threshold} className={`bg-white border rounded-sm p-3 ${r.color}`}>
              <p className={`text-[12px] font-bold mb-1 ${r.text}`}>{r.threshold}</p>
              <p className="text-[#64748b] text-[11px]">{r.action}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


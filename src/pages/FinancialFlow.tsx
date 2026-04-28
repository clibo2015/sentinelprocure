
import { DollarSign, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockFinancialFlows, mockBenchmarkIntegrity } from '../data/securityData2';

function fmt(n: number) {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  return `R${n.toLocaleString()}`;
}

export function FinancialFlow() {
  const ficAlerted = mockFinancialFlows.filter(f => f.ficAlerted).length;
  const suspiciousTotal = mockFinancialFlows.reduce((s, f) => s + f.suspiciousTransfers.filter(t => t.flagged).reduce((a, t) => a + t.amount, 0), 0);

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-[#cbd5e1] rounded-sm bg-white px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#4a7ab5]" />
        <DollarSign size={15} className="text-[#0284c7] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#0284c7] font-bold text-[12px] uppercase tracking-wide">Financial Flow Monitor — FIC Integration & Post-Payment Tracking</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            The system tracks what happens to government money AFTER it leaves the treasury account.
            Integration with the Financial Intelligence Centre (FIC) flags suspicious transfers within 30 days of payment.
            Kickback patterns — rapid transfers to shell companies, offshore accounts, or politically connected individuals — are detected automatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Contracts Monitored', value: mockFinancialFlows.length, color: 'text-[#0f172a]' },
          { label: 'FIC Alerts Raised', value: ficAlerted, color: 'text-[#dc2626]' },
          { label: 'Suspicious Transfer Value', value: fmt(suspiciousTotal), color: 'text-[#dc2626]' },
          { label: 'Benchmark Sources Active', value: mockBenchmarkIntegrity.filter(b => b.externalFeedActive).length, color: 'text-[#16a34a]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Financial flows */}
      <Card>
        <CardHeader title="Post-Payment Flow Analysis" subtitle="FIC-integrated monitoring — suspicious transfers flagged within 24 hours of detection" />
        <div className="p-4 space-y-4">
          {mockFinancialFlows.map(flow => (
            <div key={flow.id} className={`border rounded-sm p-4 ${flow.kickbackRisk === 'CRITICAL' ? 'border-red-900/60 bg-red-950/10' : flow.kickbackRisk === 'HIGH' ? 'border-orange-900/60' : 'border-[#e2e8f0] bg-white'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[#0284c7] text-[11px]">{flow.contractRef}</span>
                    <Badge label={flow.kickbackRisk} variant="risk" riskLevel={flow.kickbackRisk} dot />
                    {flow.ficAlerted && <span className="text-[10px] font-bold text-[#dc2626] bg-red-950/40 border border-red-900/50 px-2 py-0.5 rounded-sm uppercase tracking-wide">FIC ALERTED</span>}
                  </div>
                  <p className="text-[#0f172a] font-semibold text-[12px]">{flow.vendor}</p>
                  {flow.ficCaseRef && <p className="text-[#64748b] text-[10px] font-mono mt-0.5">FIC Case: {flow.ficCaseRef}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[#334155] text-[10px] uppercase tracking-wider">Payment Amount</p>
                  <p className="text-[#0f172a] font-mono font-bold text-[14px]">{flow.amount > 0 ? fmt(flow.amount) : 'Blocked'}</p>
                  {flow.paymentDate && <p className="text-[#334155] text-[10px] font-mono">{flow.paymentDate}</p>}
                </div>
              </div>

              {flow.suspiciousTransfers.length > 0 ? (
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Suspicious Transfers Detected</p>
                  <div className="space-y-2">
                    {flow.suspiciousTransfers.map((t, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2.5 rounded-sm border text-[11px] ${t.flagged ? 'bg-red-950/30 border-red-900/50' : 'bg-white border-[#e2e8f0]'}`}>
                        <div className="flex items-center gap-2 flex-1">
                          <ArrowRight size={11} className={t.flagged ? 'text-[#dc2626]' : 'text-[#334155]'} />
                          <span className={t.flagged ? 'text-red-300' : 'text-[#334155]'}>{t.destination}</span>
                        </div>
                        <span className={`font-mono font-bold ${t.flagged ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>{fmt(t.amount)}</span>
                        <span className="text-[#64748b]">Day +{t.daysAfterPayment}</span>
                        {t.flagged && <AlertTriangle size={11} className="text-[#dc2626]" />}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-[#16a34a]">
                  <CheckCircle size={11} />
                  No suspicious transfers detected — payment flow normal
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Benchmark integrity */}
      <Card>
        <CardHeader
          title="Price Benchmark Data Integrity"
          subtitle="Loophole #4 closed: benchmark sources audited for contamination — corrupted historical data isolated"
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Benchmark Source</th><th>Last Updated</th><th className="text-right">Records</th>
                <th>Integrity Score</th><th>External Feed</th><th>Contamination Status</th>
              </tr>
            </thead>
            <tbody>
              {mockBenchmarkIntegrity.map(b => (
                <tr key={b.source}>
                  <td><span className="text-[#0f172a] font-medium text-[12px]">{b.source}</span></td>
                  <td><span className="font-mono text-[#64748b] text-[11px]">{b.lastUpdated}</span></td>
                  <td className="text-right"><span className="font-mono text-[#334155]">{b.recordCount.toLocaleString()}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                        <div className="h-1.5 rounded-sm" style={{ width: `${b.integrityScore}%`, background: b.integrityScore >= 80 ? '#22c55e' : b.integrityScore >= 60 ? '#eab308' : '#ef4444' }} />
                      </div>
                      <span className={`font-mono font-bold text-[12px] ${b.integrityScore >= 80 ? 'text-[#16a34a]' : b.integrityScore >= 60 ? 'text-yellow-500' : 'text-[#dc2626]'}`}>{b.integrityScore}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`flex items-center gap-1.5 text-[11px] ${b.externalFeedActive ? 'text-[#16a34a]' : 'text-[#64748b]'}`}>
                      {b.externalFeedActive ? <CheckCircle size={11} /> : <span className="w-2 h-2 rounded-full bg-[#2a4a6b]" />}
                      {b.externalFeedActive ? 'Live Feed' : 'Static'}
                    </div>
                  </td>
                  <td>
                    {b.suspectedContamination ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#ea580c] mb-0.5">
                          <AlertTriangle size={10} />
                          Contamination Suspected
                        </div>
                        <p className="text-[#64748b] text-[10px] max-w-xs">{b.contaminationDetail}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a]">
                        <CheckCircle size={11} />
                        Clean
                      </div>
                    )}
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


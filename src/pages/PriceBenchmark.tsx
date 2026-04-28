
import { AlertTriangle, ShoppingCart, TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockPriceAlerts } from '../data/extendedData';
import { mockBoQAggregates } from '../data/securityData2';
import { useScenario } from '../context/ScenarioContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigation } from '../context/NavigationContext';

const CHART_STYLE = {
  tooltip: { background: '#080d18', border: '1px solid #0f1e35', borderRadius: 2, fontSize: 11, color: '#94a3b8' },
  axis: { fill: '#2a4a6b', fontSize: 10 },
  grid: '#0f1e35',
};

function fmt(p: number) {
  if (p >= 1_000_000) return `R${(p / 1_000_000).toFixed(1)}M`;
  if (p >= 1_000) return `R${(p / 1_000).toFixed(0)}k`;
  return `R${p.toLocaleString()}`;
}

export function PriceBenchmark() {
  const { navigateTo } = useNavigation();
  const { scenarioData } = useScenario();
  
  const allPriceAlerts = [...(scenarioData?.priceAlerts || []), ...mockPriceAlerts];
  const blocked = allPriceAlerts.filter(a => a.status === 'BLOCKED').length;
  const totalExposure = allPriceAlerts.reduce((s, a) => s + Math.max(0, a.quotedPrice - a.govBenchmark), 0);

  const chartData = allPriceAlerts.slice(0, 5).map(a => ({
    name: a.itemDescription.length > 22 ? a.itemDescription.slice(0, 22) + '…' : a.itemDescription,
    Quoted: a.quotedPrice,
    Benchmark: a.govBenchmark,
    Retail: a.retailPrice || Math.round(a.govBenchmark * 0.85),
  }));

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-red-900/60 rounded-sm bg-[#0d0a0a] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
        <AlertTriangle size={15} className="text-[#dc2626] shrink-0 mt-0.5 pulse-critical" />
        <div>
          <p className="text-[#dc2626] font-bold text-[12px] uppercase tracking-wide">Dynamic Price Benchmarking Engine — Active</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Inspired by documented SA fraud: Eskom R80,000 knee guards (retail R320), R238,000 mop (retail R450), and R14.3B PPE fraud (2020 COVID).
            All bid line items cross-referenced against retail, historical government, and international benchmarks in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Bids Auto-Blocked', value: String(blocked), color: 'text-[#dc2626]', sub: 'Price threshold exceeded' },
          { label: 'Under Review', value: String(mockPriceAlerts.filter(a => a.status === 'UNDER_REVIEW').length), color: 'text-yellow-500', sub: 'Awaiting justification' },
          { label: 'Cleared', value: String(mockPriceAlerts.filter(a => a.status === 'CLEARED').length), color: 'text-[#16a34a]', sub: 'Within acceptable range' },
          { label: 'Est. Overcharge Prevented', value: fmt(totalExposure), color: 'text-[#d4a843]', sub: 'Across flagged line items' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
            <p className="text-[#334155] text-[10px] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="Price Anomaly Visualiser" subtitle="Quoted vs government benchmark vs retail — top 5 worst offenders" />
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={CHART_STYLE.grid} />
              <XAxis dataKey="name" tick={{ fill: '#2a4a6b', fontSize: 9 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" />
              <YAxis tick={CHART_STYLE.axis} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
              <Tooltip contentStyle={CHART_STYLE.tooltip} formatter={(v) => [fmt(Number(v)), '']} />
              <Bar dataKey="Quoted" fill="#ef4444" radius={[2, 2, 0, 0]} opacity={0.85} name="Quoted" />
              <Bar dataKey="Benchmark" fill="#1e3a5f" radius={[2, 2, 0, 0]} name="Gov Benchmark" />
              <Bar dataKey="Retail" fill="#166534" radius={[2, 2, 0, 0]} opacity={0.7} name="Retail" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-1 justify-center">
            {[['Quoted Price', '#ef4444'], ['Gov Benchmark', '#1e3a5f'], ['Retail Price', '#166534']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Price Alert Register" subtitle="All flagged line items — auto-blocked if markup exceeds 500% above benchmark" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>Tender Ref</th>
                <th>Item Description</th>
                <th className="text-right">Quoted</th>
                <th className="text-right">Gov Benchmark</th>
                <th className="text-right">Retail</th>
                <th className="text-right">Markup</th>
                <th>Status</th>
                <th>Real-World Context</th>
                <th>eTender Link</th>
              </tr>
            </thead>
            <tbody>
              {allPriceAlerts.map(alert => (
                <tr key={alert.id}>
                  <td><Badge label={alert.severity} variant="risk" riskLevel={alert.severity} dot /></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{alert.tenderRef}</span></td>
                  <td><span className="text-[#0f172a] text-[12px]">{alert.itemDescription}</span></td>
                  <td className="text-right">
                    <span className={`font-mono font-bold text-[12px] ${alert.severity === 'CRITICAL' ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>
                      {fmt(alert.quotedPrice)}
                    </span>
                  </td>
                  <td className="text-right"><span className="font-mono text-[#334155]">{fmt(alert.govBenchmark)}</span></td>
                  <td className="text-right">
                    <span className="font-mono text-[#16a34a]">{alert.retailPrice > 0 ? fmt(alert.retailPrice) : '—'}</span>
                  </td>
                  <td className="text-right">
                    <span className={`font-mono font-bold text-[13px] ${alert.markupPercent > 1000 ? 'text-[#dc2626]' : alert.markupPercent > 200 ? 'text-[#ea580c]' : 'text-yellow-500'}`}>
                      +{alert.markupPercent.toLocaleString()}%
                    </span>
                  </td>
                  <td>
                    <Badge
                      label={alert.status.replace('_', ' ')}
                      variant="status"
                      status={alert.status === 'BLOCKED' ? 'SUSPENDED' : alert.status === 'FLAGGED' ? 'FLAGGED' : alert.status === 'UNDER_REVIEW' ? 'UNDER_REVIEW' : 'CLEARED'}
                    />
                  </td>
                  <td>
                    {alert.realWorldExample ? (
                      <div className="flex items-start gap-1.5 max-w-xs">
                        <ShoppingCart size={10} className="text-[#d4a843] shrink-0 mt-0.5" />
                        <p className="text-[#64748b] text-[10px] leading-relaxed">{alert.realWorldExample}</p>
                      </div>
                    ) : <span className="text-[#334155] text-[11px]">—</span>}
                  </td>
                
                  <td>
                    <button
                      onClick={() => navigateTo('supplier-intelligence')}
                      className="flex items-center gap-1 text-[10px] text-[#d4a843] border border-[#d4a843]/40 bg-[#d4a843]/10 px-2 py-1 rounded-sm hover:bg-[#d4a843]/20 transition-colors whitespace-nowrap"
                    >
                      <ExternalLink size={9} /> eTender
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Auto-Rejection Thresholds" subtitle="Configurable by National Treasury — current active rules" />
        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { rule: 'Auto-Block', threshold: '>500% above gov benchmark', action: 'Bid automatically rejected — vendor notified immediately', color: 'border-red-900/60', text: 'text-[#dc2626]' },
            { rule: 'Mandatory Review', threshold: '200–500% above benchmark', action: 'Escalated to SCM officer — justification required within 48h', color: 'border-orange-900/60', text: 'text-[#ea580c]' },
            { rule: 'Advisory Flag', threshold: '50–200% above benchmark', action: 'Logged and monitored — included in evaluation report', color: 'border-yellow-900/60', text: 'text-yellow-500' },
          ].map(r => (
            <div key={r.rule} className={`bg-white border rounded-sm p-3 ${r.color}`}>
              <p className={`text-[11px] font-bold uppercase tracking-wide mb-1 ${r.text}`}>{r.rule}</p>
              <p className="text-[#0f172a] text-[12px] font-semibold mb-1">{r.threshold}</p>
              <p className="text-[#64748b] text-[11px]">{r.action}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* LOOPHOLE #3 FIX: Aggregate BoQ Analysis */}
      <div className="relative overflow-hidden border border-[#fdba74] rounded-sm bg-[#fff7ed] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
        <TrendingUp size={15} className="text-[#ea580c] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#ea580c] font-bold text-[12px] uppercase tracking-wide">Loophole #3 Closed — Aggregate BoQ Spread-Inflation Detection</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            A vendor can price every line item below the per-item threshold while collectively overcharging by hundreds of percent.
            The aggregate analysis detects this pattern: if total BoQ value exceeds benchmark by more than 100%, the bid is blocked
            regardless of individual line item scores. Statistical threshold-boundary pricing is also flagged as a gaming indicator.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Aggregate BoQ Analysis"
          subtitle="Total bid value vs total benchmark — spread-inflation pattern detection"
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Tender Ref</th>
                <th>Vendor</th>
                <th className="text-right">Total Quoted</th>
                <th className="text-right">Total Benchmark</th>
                <th className="text-right">Aggregate Markup</th>
                <th>Spread Pattern</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockBoQAggregates.map(agg => (
                <tr key={agg.tenderRef} className={agg.spreadPattern ? 'bg-red-950/10' : ''}>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{agg.tenderRef}</span></td>
                  <td><span className="text-[#0f172a] text-[12px]">{agg.vendorName}</span></td>
                  <td className="text-right">
                    <span className={`font-mono font-bold text-[12px] ${agg.aggregateMarkup > 100 ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>
                      R{(agg.totalQuoted / 1_000_000).toFixed(0)}M
                    </span>
                  </td>
                  <td className="text-right"><span className="font-mono text-[#334155]">R{(agg.totalBenchmark / 1_000_000).toFixed(0)}M</span></td>
                  <td className="text-right">
                    <span className={`font-mono font-bold text-[13px] ${agg.aggregateMarkup > 100 ? 'text-[#dc2626]' : agg.aggregateMarkup > 20 ? 'text-[#ea580c]' : 'text-[#16a34a]'}`}>
                      +{agg.aggregateMarkup}%
                    </span>
                  </td>
                  <td>
                    {agg.spreadPattern ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#dc2626] mb-0.5">
                          <AlertTriangle size={10} />
                          <span className="font-semibold">DETECTED</span>
                        </div>
                        <p className="text-[#64748b] text-[10px] max-w-xs leading-relaxed">{agg.spreadPatternDetail}</p>
                      </div>
                    ) : (
                      <span className="text-[#16a34a] text-[11px]">✓ No pattern</span>
                    )}
                  </td>
                  <td>
                    <Badge
                      label={agg.status}
                      variant="status"
                      status={agg.status === 'BLOCKED' ? 'SUSPENDED' : agg.status === 'FLAGGED' ? 'FLAGGED' : 'CLEARED'}
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


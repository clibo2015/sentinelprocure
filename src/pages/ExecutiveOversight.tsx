
import { Eye } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { executiveMetrics, predictiveRiskData, systemicVulnerabilities } from '../data/extendedData';
import { mockTenders, riskTrendData, savingsData } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const CHART_STYLE = {
  tooltip: { background: '#080d18', border: '1px solid #0f1e35', borderRadius: 2, fontSize: 11, color: '#94a3b8' },
  axis: { fill: '#2a4a6b', fontSize: 10 },
  grid: '#0f1e35',
};

export function ExecutiveOversight() {
  const criticalCount = mockTenders.filter(t => t.riskLevel === 'CRITICAL').length;
  void criticalCount;

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">

      {/* Executive header */}
      <div className="bg-white border border-[#cbd5e1]/60 rounded-sm overflow-hidden">
        <div className="bg-[#0c1e38] border-b border-[#cbd5e1]/60 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#f1f5f9] border border-[#d4a843]/40 rounded-sm flex items-center justify-center">
              <Eye size={14} className="text-[#d4a843]" />
            </div>
            <div>
              <p className="text-[#0f172a] font-bold text-[13px]">Executive Oversight Dashboard</p>
              <p className="text-[#0284c7] text-[10px] font-semibold uppercase tracking-widest">
                Auditor-General · National Treasury · SIU · Hawks — Restricted Access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge label="PREDICTIVE ANALYTICS ACTIVE" variant="status" status="ACTIVE" dot />
            <Badge label="REAL-TIME" variant="status" status="ACTIVE" />
          </div>
        </div>
        <div className="px-5 py-3">
          <p className="text-[#64748b] text-[11px] leading-relaxed max-w-4xl">
            Strategic foresight dashboard for oversight bodies. Provides predictive risk scores for ongoing tenders,
            highlights systemic vulnerabilities, and delivers actionable intelligence — moving beyond reactive reporting
            to proactive governance. Aligned with Zondo Commission Recommendation 9.4 on technology-enabled oversight.
          </p>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {executiveMetrics.map(m => (
          <div key={m.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-[#0f172a] font-bold text-xl font-mono">{m.value}</p>
            <p className={`text-[10px] font-semibold mt-1 ${m.positive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
              {m.positive ? '▲' : '▼'} {m.change}
            </p>
            <p className="text-[#334155] text-[10px] mt-1">{m.detail}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader title="Risk Trend — 6 Month View" subtitle="Critical and high severity flags over time" />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={riskTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="execCrit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={CHART_STYLE.grid} />
                <XAxis dataKey="month" tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_STYLE.tooltip} />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#execCrit)" strokeWidth={1.5} name="Critical" />
                <Area type="monotone" dataKey="high" stroke="#f97316" fill="none" strokeWidth={1.5} strokeDasharray="3 2" name="High" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Funds Protected (R Millions)" subtitle="Prevented losses vs recovered — YTD" />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={savingsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={CHART_STYLE.grid} />
                <XAxis dataKey="month" tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_STYLE.tooltip} formatter={(v) => [`R${v}M`, '']} />
                <Bar dataKey="prevented" fill="#166534" radius={[2, 2, 0, 0]} name="Prevented" />
                <Bar dataKey="recovered" fill="#1e3a5f" radius={[2, 2, 0, 0]} name="Recovered" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Predictive risk table */}
      <Card>
        <CardHeader
          title="Predictive Fraud Risk — Active Tenders"
          subtitle="AI-predicted fraud probability vs current risk score — 30-day forward projection"
          action={<Badge label="PREDICTIVE MODEL v3.1" variant="default" />}
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Tender Reference</th>
                <th>Current Risk Score</th>
                <th>Predicted Fraud Risk (30d)</th>
                <th>Delta</th>
                <th>Trend</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {predictiveRiskData.map(p => {
                const delta = p.predictedFraud - p.currentRisk;
                const tender = mockTenders.find(t => t.reference === p.tender);
                return (
                  <tr key={p.tender}>
                    <td>
                      <div>
                        <span className="font-mono text-[#0284c7] text-[11px]">{p.tender}</span>
                        {tender && <p className="text-[#334155] text-[10px] mt-0.5">{tender.title}</p>}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                          <div className="h-1.5 rounded-sm" style={{ width: `${p.currentRisk}%`, background: p.currentRisk >= 75 ? '#ef4444' : '#f97316' }} />
                        </div>
                        <span className="font-mono text-[#0f172a] text-[12px] font-bold">{p.currentRisk}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                          <div className="h-1.5 rounded-sm" style={{ width: `${p.predictedFraud}%`, background: p.predictedFraud >= 75 ? '#ef4444' : '#f97316' }} />
                        </div>
                        <span className={`font-mono text-[12px] font-bold ${p.predictedFraud >= 80 ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>{p.predictedFraud}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`font-mono font-bold text-[12px] ${delta > 0 ? 'text-[#dc2626]' : delta < 0 ? 'text-[#16a34a]' : 'text-[#64748b]'}`}>
                        {delta > 0 ? '+' : ''}{delta}
                      </span>
                    </td>
                    <td>
                      <span className={`text-[11px] font-semibold ${p.trend === 'INCREASING' ? 'text-[#dc2626]' : p.trend === 'DECREASING' ? 'text-[#16a34a]' : 'text-[#64748b]'}`}>
                        {p.trend === 'INCREASING' ? '▲ Increasing' : p.trend === 'DECREASING' ? '▼ Decreasing' : '● Stable'}
                      </span>
                    </td>
                    <td>
                      <span className="text-[11px] text-[#64748b]">
                        {p.predictedFraud >= 90 ? 'Immediate suspension recommended' :
                         p.predictedFraud >= 75 ? 'Enhanced monitoring required' :
                         p.predictedFraud >= 50 ? 'Standard review process' :
                         'No action required'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Systemic vulnerabilities */}
      <Card>
        <CardHeader
          title="Systemic Vulnerability Assessment"
          subtitle="Structural weaknesses in the procurement ecosystem — strategic foresight for policy intervention"
        />
        <div className="p-4 space-y-3">
          {systemicVulnerabilities.map(v => (
            <div key={v.area} className="flex items-start gap-4 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm">
              <div className="shrink-0 w-32">
                <p className="text-[#0f172a] text-[12px] font-semibold">{v.area}</p>
                <div className="mt-1.5 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                  <div
                    className="h-1.5 rounded-sm"
                    style={{ width: `${v.risk}%`, background: v.risk >= 80 ? '#ef4444' : v.risk >= 60 ? '#f97316' : '#eab308' }}
                  />
                </div>
                <p className={`font-mono font-bold text-[11px] mt-0.5 ${v.risk >= 80 ? 'text-[#dc2626]' : v.risk >= 60 ? 'text-[#ea580c]' : 'text-yellow-500'}`}>
                  Risk: {v.risk}/100
                </p>
              </div>
              <div className="flex-1">
                <p className="text-[#64748b] text-[11px] leading-relaxed">{v.description}</p>
              </div>
              <div className="shrink-0">
                <Badge label={v.risk >= 80 ? 'CRITICAL' : v.risk >= 60 ? 'HIGH' : 'MEDIUM'} variant="risk" riskLevel={v.risk >= 80 ? 'CRITICAL' : v.risk >= 60 ? 'HIGH' : 'MEDIUM'} dot />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

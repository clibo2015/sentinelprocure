import {
  AlertTriangle, TrendingUp, ShieldCheck, Zap,
  DollarSign, FileWarning, Users, Bot, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { IntegrityScore } from '../components/ui/IntegrityScore';
import {
  mockTenders, mockRedFlags, riskTrendData, savingsData,
  categoryBreakdown, provinceRiskData
} from '../data/mockData';
import { mockDataSummary } from '../data/mockData_index';
import { allETenders } from '../data/mockData_etender';
import { useScenario } from '../context/ScenarioContext';
import type { Tender, RedFlag, Vendor } from '../data/mockData';
import type { BidSubmission } from '../data/extendedData';

const CHART_STYLE = {
  tooltip: { background: '#080d18', border: '1px solid #0f1e35', borderRadius: 2, fontSize: 11, color: '#94a3b8' },
  axis: { fill: '#2a4a6b', fontSize: 10 },
  grid: '#0f1e35',
};

export function Dashboard() {
  const { scenarioData } = useScenario();
  const allTenders = [...(scenarioData?.tenders || []), ...mockTenders];
  const allRedFlags = [...(scenarioData?.redFlags || []), ...mockRedFlags];
  
  const criticalTenders = allTenders.filter((t: Tender) => t.riskLevel === 'CRITICAL');
  const openFlags = allRedFlags.filter((f: RedFlag) => f.status !== 'RESOLVED');

  // Level 3: unified counts from both old and new datasets
  const totalTenders = allTenders.length + allETenders.length;
  const totalVendors = mockDataSummary.csd.total + 1843 + (scenarioData?.vendors?.length || 0);
  const ineligibleVendors = mockDataSummary.csd.ineligible + (scenarioData?.vendors?.filter((v: Vendor) => v.riskLevel === 'CRITICAL').length || 0);
  const blockedBids = mockDataSummary.etenders.blocked_bids + (scenarioData?.bidSubmissions?.filter((b: BidSubmission) => b.status === 'REJECTED').length || 0);
  const riggedTenders = mockDataSummary.etenders.rigged + (scenarioData?.tenders?.filter((t: Tender) => t.riskLevel === 'CRITICAL').length || 0);
  const frontingConfirmed = mockDataSummary.bbbee.fronting_confirmed + (scenarioData?.vendors?.filter((v: Vendor) => v.flags.includes('Fronting')).length || 0);

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">

      {/* Critical alert banner */}
      {criticalTenders.length > 0 && (
        <div className="relative overflow-hidden border border-[#fca5a5] rounded-sm bg-[#fef2f2] px-4 py-3 flex items-center gap-3">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
          <AlertTriangle size={15} className="text-[#dc2626] shrink-0 pulse-critical" />
          <div className="flex-1">
            <span className="text-[#dc2626] font-bold text-[12px] uppercase tracking-wide">
              CRITICAL INTERVENTION REQUIRED
            </span>
            <span className="text-[#64748b] text-[11px] ml-3">
              {criticalTenders.length} tenders flagged · Estimated exposure: R846M+ · Human review required before award
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#dc2626] border border-[#fca5a5] bg-[#fee2e2] px-3 py-1.5 rounded-sm hover:bg-[#fecaca] transition-colors shrink-0">
            Review <ArrowRight size={11} />
          </button>
        </div>
      )}

      {/* KPI row 1 */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Active Tenders" value={String(totalTenders)} subtitle="Across 9 provinces + eTender portal" icon={<FileWarning size={16} />} color="green" trend={{ value: `${riggedTenders} rigged detected`, positive: false }} />
        <StatCard title="Critical Flags" value={String(openFlags.length)} subtitle="Require immediate action" icon={<AlertTriangle size={16} />} color="red" trend={{ value: '2 escalated to SIU', positive: false }} />
        <StatCard title="Funds Protected" value="R1.2B" subtitle="Prevented losses YTD" icon={<DollarSign size={16} />} color="green" trend={{ value: '34% above target', positive: true }} />
        <StatCard title="AI Agents Active" value="7" subtitle="3 currently intervening" icon={<Bot size={16} />} color="gold" trend={{ value: '99.7% uptime', positive: true }} />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Vendors Monitored" value={totalVendors.toLocaleString()} subtitle="CSD-registered suppliers" icon={<Users size={16} />} color="green" />
        <StatCard title="Ineligible Vendors" value={String(ineligibleVendors)} subtitle={`${blockedBids} bids auto-blocked`} icon={<ShieldCheck size={16} />} color="red" />
        <StatCard title="Compliance Rate" value="94.2%" subtitle="B-BBEE & PPPFA adherence" icon={<TrendingUp size={16} />} color="green" trend={{ value: '+2.1% vs last quarter', positive: true }} />
        <StatCard title="B-BBEE Fronting" value={String(frontingConfirmed)} subtitle="Confirmed fronting cases" icon={<Zap size={16} />} color="yellow" trend={{ value: `${mockDataSummary.bbbee.unaccredited_agency} unaccredited agencies`, positive: false }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Risk trend */}
        <Card className="col-span-2">
          <CardHeader title="Risk Flag Trend" subtitle="Monthly breakdown by severity — last 6 months" />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={riskTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCrit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={CHART_STYLE.grid} />
                <XAxis dataKey="month" tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_STYLE.tooltip} labelStyle={{ color: '#64748b' }} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#4a6a8a' }} />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#gCrit)" strokeWidth={1.5} name="Critical" />
                <Area type="monotone" dataKey="high" stroke="#f97316" fill="url(#gHigh)" strokeWidth={1.5} name="High" />
                <Area type="monotone" dataKey="medium" stroke="#eab308" fill="none" strokeWidth={1.5} strokeDasharray="3 2" name="Medium" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader title="Flags by Sector" subtitle="Procurement category risk distribution" />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" paddingAngle={2}>
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_STYLE.tooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {categoryBreakdown.map(c => (
                <div key={c.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: c.fill }} />
                    <span className="text-[#64748b]">{c.name}</span>
                  </div>
                  <span className="text-[#334155] font-mono font-semibold">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Savings */}
        <Card>
          <CardHeader title="Funds Protected (R Millions)" subtitle="Prevented losses vs recovered funds — YTD" />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={savingsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={CHART_STYLE.grid} />
                <XAxis dataKey="month" tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_STYLE.axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_STYLE.tooltip} formatter={(v) => [`R${v}M`, '']} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#4a6a8a' }} />
                <Bar dataKey="prevented" fill="#166534" radius={[2, 2, 0, 0]} name="Prevented" />
                <Bar dataKey="recovered" fill="#1e3a5f" radius={[2, 2, 0, 0]} name="Recovered" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Provincial risk */}
        <Card>
          <CardHeader title="Risk Distribution by District" subtitle="Aggregate risk score by regional municipality" />
          <div className="p-4 space-y-2">
            {provinceRiskData.sort((a, b) => b.score - a.score).map(p => {
              const barColor = p.score >= 75 ? '#ef4444' : p.score >= 50 ? '#f97316' : p.score >= 30 ? '#eab308' : '#22c55e';
              return (
                <div key={p.province} className="flex items-center gap-3">
                  <span className="text-[#64748b] text-[11px] w-28 shrink-0 font-mono">{p.province}</span>
                  <div className="flex-1 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                    <div className="h-1.5 rounded-sm transition-all" style={{ width: `${p.score}%`, background: barColor }} />
                  </div>
                  <span className="text-[#334155] text-[11px] font-mono font-semibold w-6 text-right">{p.score}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Critical tenders table */}
      <Card>
        <CardHeader
          title="Critical Tender Alerts"
          subtitle="Tenders requiring immediate human review before award"
          action={<Badge label="Requires Action" variant="risk" riskLevel="CRITICAL" dot />}
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Integrity</th>
                <th>Reference</th>
                <th>Tender Title</th>
                <th>Department</th>
                <th className="text-right">Value</th>
                <th>Bidders</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {allTenders
                .filter((t: Tender) => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH')
                .slice(0, 5)
                .map((tender: Tender) => (
                  <tr key={tender.id} className="cursor-pointer">
                    <td><IntegrityScore score={tender.integrityScore} size="sm" showLabel={false} /></td>
                    <td><span className="font-mono text-[#0284c7] text-[11px]">{tender.reference}</span></td>
                    <td><span className="text-[#0f172a] font-medium text-[12px]">{tender.title}</span></td>
                    <td><span className="text-[#64748b] text-[11px]">{tender.department}</span></td>
                    <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(tender.value / 1_000_000).toFixed(0)}M</span></td>
                    <td><span className="font-mono text-[#64748b]">{tender.biddersCount}</span></td>
                    <td><Badge label={tender.riskLevel} variant="risk" riskLevel={tender.riskLevel} dot /></td>
                    <td><Badge label={tender.status.replace('_', ' ')} variant="status" status={tender.status} /></td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {tender.flags.slice(0, 2).map((f: string) => (
                          <span key={f} className="text-[10px] text-[#dc2626] bg-red-950/60 border border-red-900/40 px-1.5 py-0.5 rounded-sm">{f}</span>
                        ))}
                        {tender.flags.length > 2 && <span className="text-[10px] text-[#64748b]">+{tender.flags.length - 2}</span>}
                      </div>
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

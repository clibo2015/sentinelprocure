import { Globe, Shield, Eye, CheckCircle } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { IntegrityScore } from '../components/ui/IntegrityScore';
import { Badge } from '../components/ui/Badge';
import { mockTenders, mockContracts } from '../data/mockData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const radarData = [
  { subject: 'Transparency', A: 78 },
  { subject: 'Competition', A: 62 },
  { subject: 'Compliance', A: 94 },
  { subject: 'Value for Money', A: 71 },
  { subject: 'Delivery', A: 83 },
  { subject: 'Integrity', A: 61 },
];

export function Transparency() {
  const publicTenders = mockTenders.filter(t => t.status === 'CLEARED' || t.status === 'AWARDED');
  const avgIntegrity = Math.round(mockTenders.reduce((s, t) => s + t.integrityScore, 0) / mockTenders.length);

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">

      {/* Official portal header */}
      <div className="bg-white border border-[#cbd5e1]/60 rounded-sm overflow-hidden">
        <div className="bg-[#0c1e38] border-b border-[#cbd5e1]/60 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm flex items-center justify-center">
              <Globe size={14} className="text-[#d4a843]" />
            </div>
            <div>
              <p className="text-[#0f172a] font-bold text-[13px] tracking-tight">
                South Africa Public Procurement Transparency Portal
              </p>
              <p className="text-[#0284c7] text-[10px] font-semibold uppercase tracking-widest">
                Powered by SentinelProcure AI · National Treasury · Open Government Initiative
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#16a34a] bg-green-950/40 border border-green-900/50 px-2 py-1 rounded-sm uppercase tracking-wide">
              <Shield size={10} />
              Blockchain Verified
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0284c7] bg-[#0c1e38] border border-[#cbd5e1] px-2 py-1 rounded-sm uppercase tracking-wide">
              <Eye size={10} />
              PAIA Compliant
            </div>
          </div>
        </div>
        <div className="px-5 py-3">
          <p className="text-[#64748b] text-[12px] leading-relaxed max-w-4xl">
            This portal provides citizens, civil society, and oversight bodies with real-time visibility into government procurement integrity.
            All data is derived from AI analysis of public procurement records in accordance with the{' '}
            <span className="text-[#334155] font-semibold">Public Procurement Act 28 of 2024</span>.
            Final procurement decisions remain with authorised officials.
          </p>
        </div>
      </div>

      {/* National score + radar */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-5 flex flex-col items-center justify-center text-center">
          <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-4">
            National Procurement Integrity Score
          </p>
          <IntegrityScore score={avgIntegrity} size="lg" />
          <div className="mt-4 w-full space-y-2 text-[11px]">
            <div className="flex justify-between py-1.5 border-b border-[#e2e8f0]">
              <span className="text-[#64748b]">Active Tenders</span>
              <span className="font-mono text-[#0f172a] font-semibold">{mockTenders.length}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#e2e8f0]">
              <span className="text-[#64748b]">Monitored Contracts</span>
              <span className="font-mono text-[#0f172a] font-semibold">{mockContracts.length}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#e2e8f0]">
              <span className="text-[#64748b]">Registered Vendors</span>
              <span className="font-mono text-[#0f172a] font-semibold">1,847</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#64748b]">Data Sources</span>
              <span className="font-mono text-[#0284c7] font-semibold">CSD · CIPC · SARS</span>
            </div>
          </div>
        </Card>

        <Card className="col-span-2">
          <CardHeader title="Procurement Health Radar" subtitle="Multi-dimensional integrity assessment — national aggregate" />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#0f1e35" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#2a4a6b', fontSize: 10 }} />
                <Radar name="Score" dataKey="A" stroke="#1e3a5f" fill="#1e3a5f" fillOpacity={0.4} strokeWidth={1.5} />
                <Tooltip contentStyle={{ background: '#080d18', border: '1px solid #0f1e35', borderRadius: 2, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* All projects table */}
      <Card>
        <CardHeader
          title="Major Infrastructure Projects — Public Integrity Register"
          subtitle="Citizens can track the integrity of government projects in real-time"
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Integrity Score</th>
                <th>Reference</th>
                <th>Project</th>
                <th>Department</th>
                <th>Province</th>
                <th className="text-right">Value</th>
                <th>Category</th>
                <th>Status</th>
                <th>Integrity Bar</th>
              </tr>
            </thead>
            <tbody>
              {mockTenders.map(tender => {
                const barColor = tender.integrityScore >= 75 ? '#22c55e' : tender.integrityScore >= 50 ? '#eab308' : tender.integrityScore >= 25 ? '#f97316' : '#ef4444';
                return (
                  <tr key={tender.id}>
                    <td><IntegrityScore score={tender.integrityScore} size="sm" showLabel={false} /></td>
                    <td><span className="font-mono text-[#0284c7] text-[11px]">{tender.reference}</span></td>
                    <td><span className="text-[#0f172a] font-medium text-[12px]">{tender.title}</span></td>
                    <td><span className="text-[#64748b] text-[11px]">{tender.department}</span></td>
                    <td><span className="text-[#64748b] text-[11px]">{tender.province}</span></td>
                    <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(tender.value / 1_000_000).toFixed(0)}M</span></td>
                    <td><span className="text-[#64748b] text-[11px]">{tender.category}</span></td>
                    <td><Badge label={tender.status.replace('_', ' ')} variant="status" status={tender.status} /></td>
                    <td>
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
                          <div className="h-1.5 rounded-sm" style={{ width: `${tender.integrityScore}%`, background: barColor }} />
                        </div>
                        <span className="font-mono text-[11px] font-semibold w-6" style={{ color: barColor }}>
                          {tender.integrityScore}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cleared projects */}
      <Card>
        <CardHeader
          title="Integrity-Verified Awards"
          subtitle="Contracts that passed full AI integrity review — publicly disclosed"
          action={
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#16a34a] bg-green-950/40 border border-green-900/50 px-2 py-1 rounded-sm uppercase tracking-wide">
              <CheckCircle size={10} />
              {publicTenders.length} Verified
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Score</th>
                <th>Reference</th>
                <th>Project</th>
                <th>Province</th>
                <th className="text-right">Value</th>
                <th>Bidders</th>
                <th>Status</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {publicTenders.map(t => (
                <tr key={t.id}>
                  <td><IntegrityScore score={t.integrityScore} size="sm" showLabel={false} /></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{t.reference}</span></td>
                  <td><span className="text-[#0f172a] font-medium text-[12px]">{t.title}</span></td>
                  <td><span className="text-[#64748b] text-[11px]">{t.province}</span></td>
                  <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(t.value / 1_000_000).toFixed(0)}M</span></td>
                  <td><span className="font-mono text-[#64748b]">{t.biddersCount}</span></td>
                  <td><Badge label={t.status.replace('_', ' ')} variant="status" status={t.status} /></td>
                  <td>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a]">
                      <CheckCircle size={11} />
                      Integrity Verified
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer */}
      <div className="border-t border-[#e2e8f0] pt-4 text-center space-y-1">
        <p className="text-[#334155] text-[10px] font-semibold uppercase tracking-widest">
          SentinelProcure AI · National Treasury · Republic of South Africa
        </p>
        <p className="text-[#1a2a3a] text-[10px]">
          Public Procurement Act 28 of 2024 · Zondo Commission Recommendations · POPIA · PAIA · B-BBEE Act
        </p>
      </div>
    </div>
  );
}

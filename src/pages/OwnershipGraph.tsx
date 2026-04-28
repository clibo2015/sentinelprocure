import React, { useState } from 'react';
import { AlertTriangle, User, Building2, ShieldAlert, Crown, ExternalLink } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockOwnershipGraphs, type OwnershipNode, type OwnershipGraph } from '../data/extendedData';
import { useNavigation } from '../context/NavigationContext';
import { useScenario } from '../context/ScenarioContext';
import { allCIPCProfiles } from '../data/mockData_cipc';

const nodeIcons: Record<string, React.ReactNode> = {
  COMPANY:  <Building2 size={12} />,
  SHELL:    <Building2 size={12} />,
  PERSON:   <User size={12} />,
  PEP:      <Crown size={12} />,
  OFFICIAL: <ShieldAlert size={12} />,
};

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  COMPANY:  { bg: 'bg-[#0c1e38]',    border: 'border-[#cbd5e1]',    text: 'text-[#0284c7]' },
  SHELL:    { bg: 'bg-red-950/60',   border: 'border-red-900/60',   text: 'text-[#dc2626]' },
  PERSON:   { bg: 'bg-[#f1f5f9]',    border: 'border-[#e2e8f0]',    text: 'text-[#334155]' },
  PEP:      { bg: 'bg-purple-950/60',border: 'border-purple-900/60',text: 'text-purple-400' },
  OFFICIAL: { bg: 'bg-orange-950/60',border: 'border-orange-900/60',text: 'text-[#ea580c]' },
};

function NodeCard({ node }: { node: OwnershipNode }) {
  const { navigateTo } = useNavigation();
  const c = nodeColors[node.type];
  // Level 2: find matching CIPC profile by label match
  const cipcProfile = allCIPCProfiles.find(p =>
    node.details.includes(p.company_reg_no) || p.company_name.toLowerCase().includes(node.label.toLowerCase().split(' ')[0])
  );
  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-sm border ${c.bg} ${c.border} ${node.flagged ? 'ring-1 ring-red-500/30' : ''}`}>
      <div className={`shrink-0 mt-0.5 ${c.text}`}>{nodeIcons[node.type]}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className={`text-[11px] font-semibold ${c.text}`}>{node.label}</p>
          {node.flagged && <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-critical" />}
        </div>
        <p className="text-[#334155] text-[9px] uppercase tracking-wider mt-0.5">{node.type}</p>
        <p className="text-[#64748b] text-[10px] mt-0.5 leading-relaxed">{node.details}</p>
        {cipcProfile && (
          <button
            onClick={() => navigateTo('supplier-intelligence', cipcProfile.company_reg_no)}
            className="mt-1 flex items-center gap-1 text-[9px] text-[#d4a843] hover:text-[#d4a843]/80 transition-colors"
          >
            <ExternalLink size={9} /> View CIPC Profile
          </button>
        )}
      </div>
    </div>
  );
}

function GraphPanel({ graph }: { graph: OwnershipGraph }) {
  return (
    <div className="space-y-4">
      {/* Risk summary */}
      <div className={`border rounded-sm p-3 ${graph.pepLinked || graph.officialLinked ? 'bg-red-950/30 border-red-900/50' : 'bg-white border-[#e2e8f0]'}`}>
        <div className="flex items-start gap-2">
          <AlertTriangle size={13} className={graph.pepLinked ? 'text-[#dc2626] shrink-0 mt-0.5' : 'text-[#ea580c] shrink-0 mt-0.5'} />
          <div>
            <p className="text-[#0f172a] font-semibold text-[12px]">{graph.vendorName}</p>
            <p className="text-[#64748b] text-[11px] mt-1 leading-relaxed">{graph.riskSummary}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {graph.pepLinked && <Badge label="PEP LINKED" variant="risk" riskLevel="CRITICAL" dot />}
              {graph.officialLinked && <Badge label="OFFICIAL LINKED" variant="risk" riskLevel="CRITICAL" dot />}
              <Badge label={`${graph.shellLayers} Shell Layer${graph.shellLayers !== 1 ? 's' : ''}`} variant="risk" riskLevel={graph.shellLayers >= 3 ? 'CRITICAL' : 'HIGH'} />
            </div>
          </div>
        </div>
      </div>

      {/* Visual graph — ASCII-style relationship map */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-sm p-4">
        <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-3">Ownership Network Graph</p>
        <div className="space-y-2">
          {graph.edges.map((edge, i) => {
            const fromNode = graph.nodes.find(n => n.id === edge.from);
            const toNode = graph.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border min-w-0 flex-1 ${nodeColors[fromNode.type].bg} ${nodeColors[fromNode.type].border}`}>
                  <span className={nodeColors[fromNode.type].text}>{nodeIcons[fromNode.type]}</span>
                  <span className={`truncate ${nodeColors[fromNode.type].text}`}>{fromNode.label}</span>
                </div>
                <div className={`flex items-center gap-1 shrink-0 ${edge.suspicious ? 'text-[#dc2626]' : 'text-[#334155]'}`}>
                  <div className={`h-px w-6 ${edge.suspicious ? 'bg-red-500' : 'bg-[#1e3a5f]'}`} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap">{edge.label}</span>
                  <div className={`h-px w-6 ${edge.suspicious ? 'bg-red-500' : 'bg-[#1e3a5f]'}`} />
                  <span className="text-[10px]">→</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border min-w-0 flex-1 ${nodeColors[toNode.type].bg} ${nodeColors[toNode.type].border}`}>
                  <span className={nodeColors[toNode.type].text}>{nodeIcons[toNode.type]}</span>
                  <span className={`truncate ${nodeColors[toNode.type].text}`}>{toNode.label}</span>
                </div>
                {edge.suspicious && <AlertTriangle size={11} className="text-[#dc2626] shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Node details */}
      <div>
        <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Entity Details</p>
        <div className="grid grid-cols-2 gap-2">
          {graph.nodes.map(node => <NodeCard key={node.id} node={node} />)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-[#e2e8f0]">
        <button className="text-[11px] font-semibold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-3 py-1.5 rounded-sm hover:bg-red-950/60 transition-colors">
          Refer to Hawks / SIU
        </button>
        <button className="text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">
          Export Graph Report
        </button>
        <button className="text-[11px] font-semibold text-purple-400 border border-purple-900/60 bg-purple-950/40 px-3 py-1.5 rounded-sm hover:bg-purple-950/60 transition-colors">
          Flag All Entities
        </button>
      </div>
    </div>
  );
}

export function OwnershipGraph() {
  const { scenarioData } = useScenario();
  const allGraphs = [...(scenarioData?.ownershipGraphs || []), ...mockOwnershipGraphs];
  const [selected, setSelected] = useState<OwnershipGraph>(allGraphs[0]);

  // Update selection if active scenario changes and provides a graph
  React.useEffect(() => {
    if (scenarioData?.ownershipGraphs?.[0]) {
      setSelected(scenarioData.ownershipGraphs[0]);
    } else {
      setSelected(mockOwnershipGraphs[0]);
    }
  }, [scenarioData]);

  const summaryStats = [
    { label: 'PEP-Linked Vendors', value: allGraphs.filter(g => g.pepLinked).length, color: 'text-[#dc2626]' },
    { label: 'Official-Linked Vendors', value: allGraphs.filter(g => g.officialLinked).length, color: 'text-[#ea580c]' },
    { label: 'Shell Companies Exposed', value: allGraphs.reduce((s, g) => s + g.shellLayers, 0), color: 'text-purple-400' },
    { label: 'Graphs Analysed', value: allGraphs.length, color: 'text-[#0284c7]' },
  ];

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      {/* ... previous content ... */}
      <div className="grid grid-cols-4 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Vendor selector */}
        <div className="space-y-2">
          <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest">Select Vendor</p>
          {allGraphs.map(g => (
            <button
              key={g.vendorId}
              onClick={() => setSelected(g)}
              className={`w-full text-left p-3 rounded-sm border transition-colors ${selected.vendorId === g.vendorId ? 'bg-[#0c1e38] border-[#cbd5e1]' : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'}`}
            >
              <p className="text-[#0f172a] text-[12px] font-semibold">{g.vendorName}</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {g.pepLinked && <Badge label="PEP" variant="risk" riskLevel="CRITICAL" />}
                {g.officialLinked && <Badge label="OFFICIAL" variant="risk" riskLevel="CRITICAL" />}
                <Badge label={`${g.shellLayers} shells`} variant="risk" riskLevel={g.shellLayers >= 3 ? 'CRITICAL' : 'HIGH'} />
              </div>
            </button>
          ))}
        </div>

        {/* Graph panel */}
        <div className="col-span-2">
          <Card>
            <CardHeader title="Ownership Graph Analysis" subtitle="Graph Neural Network traversal — multi-layer beneficial ownership" />
            <div className="p-4">
              <GraphPanel graph={selected} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

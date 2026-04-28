import React, { useState } from 'react';
import { useScenario, type ScenarioId } from '../context/ScenarioContext';
import { Play, ShieldAlert, CheckCircle, Users, X, Info, Building } from 'lucide-react';
import { Badge } from './ui/Badge';

export const ScenarioSimulationPanel: React.FC = () => {
  const { activeScenario, activateScenario } = useScenario();
  const [isOpen, setIsOpen] = useState(false);

  const scenarios: { id: ScenarioId; title: string; icon: React.ReactNode; desc: string; color: string }[] = [
    {
      id: 'SCENARIO_1',
      title: 'Scenario 1: Clean Baseline',
      icon: <CheckCircle className="text-green-500" size={18} />,
      desc: 'Verify standard tender processing without false alarms.',
      color: 'border-green-500/20 bg-green-50/30'
    },
    {
      id: 'SCENARIO_2',
      title: 'Scenario 2: Eskom Knee Guard',
      icon: <ShieldAlert className="text-red-500" size={18} />,
      desc: 'Detect 17,000% price padding & tax fraud (R80k per unit).',
      color: 'border-red-500/20 bg-red-50/30'
    },
    {
      id: 'SCENARIO_3',
      title: 'Scenario 3: Friends & Family',
      icon: <Users className="text-purple-500" size={18} />,
      desc: 'Unmask beneficial ownership link between Official & Vendor.',
      color: 'border-purple-500/20 bg-purple-50/30'
    },
    {
      id: 'SCENARIO_4',
      title: 'Scenario 4: Lighthouse Shell',
      icon: <Building className="text-orange-500" size={18} />,
      desc: 'Block R1.6B tender award to company registered 3 days ago.',
      color: 'border-orange-500/20 bg-orange-50/30'
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-[#14532d] text-white px-4 py-2.5 rounded-full shadow-2xl shadow-green-900/40 flex items-center gap-2 hover:scale-105 transition-all border border-green-700/50 group"
      >
        <Play size={16} className="fill-white" />
        <span className="text-[12px] font-bold uppercase tracking-widest">Run Test Scenarios</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] w-[380px] bg-white border border-[#e2e8f0] rounded-lg shadow-2xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-[#0c1e38] flex items-center justify-between border-b border-[#cbd5e1]/20">
        <div className="flex items-center gap-2">
          <Play size={14} className="text-[#0284c7] fill-[#0284c7]" />
          <h3 className="text-white text-[12px] font-bold uppercase tracking-wider">Scenario Simulation Engine</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[#64748b] hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="bg-blue-50 border border-blue-100 rounded p-3 flex gap-3">
          <Info size={16} className="text-[#0284c7] shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-900 leading-relaxed">
            Select a scenario to inject live test data into the SentinelProcure AI environment.
            This will update dashboards, flags, and graph analysis in real-time.
          </p>
        </div>

        <div className="space-y-2">
          {scenarios.map(s => (
            <button
              key={s.id}
              onClick={() => activateScenario(activeScenario === s.id ? 'NONE' : s.id)}
              className={`w-full text-left p-3 rounded-md border transition-all ${
                activeScenario === s.id
                  ? 'border-[#0284c7] bg-blue-50/50 ring-1 ring-[#0284c7]'
                  : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {s.icon}
                  <span className="text-[12px] font-bold text-[#0f172a]">{s.title}</span>
                </div>
                {activeScenario === s.id && (
                  <Badge label="ACTIVE" variant="status" status="CLEARED" dot />
                )}
              </div>
              <p className="text-[10px] text-[#64748b] leading-relaxed pl-6">{s.desc}</p>
            </button>
          ))}
        </div>

        {activeScenario !== 'NONE' && (
          <button
            onClick={() => activateScenario('NONE')}
            className="w-full py-2 text-[11px] font-bold text-[#64748b] border border-[#e2e8f0] rounded hover:bg-slate-50 transition-colors uppercase tracking-widest"
          >
            Clear Active Scenario
          </button>
        )}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-[#e2e8f0] flex items-center justify-between">
        <span className="text-[9px] font-bold text-[#334155] uppercase tracking-widest">System Engine v4.2.1</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-[#16a34a] font-bold">READY</span>
        </div>
      </div>
    </div>
  );
};

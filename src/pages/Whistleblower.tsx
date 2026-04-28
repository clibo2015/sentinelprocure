import { useState } from 'react';
import { Lock, Brain, ChevronDown, ChevronUp, Hash } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockWhistleblowerTips, type WhistleblowerTip } from '../data/mockData';

function TipRow({ tip }: { tip: WhistleblowerTip }) {
  const [expanded, setExpanded] = useState(false);

  const leftBorder: Record<string, string> = {
    CRITICAL: 'border-l-red-500',
    HIGH:     'border-l-orange-500',
    MEDIUM:   'border-l-yellow-500',
    LOW:      'border-l-green-500',
  };

  const confColor = tip.nlpConfidence >= 90 ? 'text-[#dc2626]' : tip.nlpConfidence >= 75 ? 'text-[#ea580c]' : 'text-yellow-500';

  return (
    <>
      <tr className={`cursor-pointer border-l-2 ${leftBorder[tip.severity]}`} onClick={() => setExpanded(!expanded)}>
        <td><span className="font-mono text-[#0284c7] text-[11px]">{tip.id}</span></td>
        <td><Badge label={tip.severity} variant="risk" riskLevel={tip.severity} dot /></td>
        <td><span className="text-[#0f172a] font-medium text-[12px]">{tip.category}</span></td>
        <td>
          <p className="text-[#334155] text-[11px] max-w-xs truncate">{tip.summary}</p>
        </td>
        <td>
          <div className="flex items-center gap-1.5">
            <Brain size={11} className={confColor} />
            <span className={`font-mono font-bold text-[12px] ${confColor}`}>{tip.nlpConfidence}%</span>
          </div>
        </td>
        <td>
          {tip.relatedTender
            ? <span className="font-mono text-[#0284c7] text-[11px]">{tip.relatedTender}</span>
            : <span className="text-[#334155] text-[11px]">—</span>
          }
        </td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{new Date(tip.receivedAt).toLocaleDateString('en-ZA')}</span></td>
        <td><Badge label={tip.status} variant="status" status={tip.status} /></td>
        <td>
          <button className="text-[#334155] hover:text-[#0284c7] transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={9} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4">
              <div className="grid grid-cols-3 gap-6">
                {/* Full summary */}
                <div className="col-span-2">
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Hash size={9} /> Tip Summary — Encrypted & Anonymised
                  </p>
                  <div className="bg-white border border-[#e2e8f0] rounded-sm p-3 mb-3">
                    <p className="text-[#334155] text-[12px] leading-relaxed">{tip.summary}</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] rounded-sm p-3">
                    <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">NLP Analysis</p>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[#64748b] text-[11px]">Category Confidence</span>
                      <span className={`font-mono font-bold text-[12px] ${confColor}`}>{tip.nlpConfidence}%</span>
                    </div>
                    <div className="bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0] mb-2">
                      <div
                        className="h-1.5 rounded-sm"
                        style={{
                          width: `${tip.nlpConfidence}%`,
                          background: tip.nlpConfidence >= 90 ? '#ef4444' : tip.nlpConfidence >= 75 ? '#f97316' : '#eab308'
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-[#334155]">Classified as: </span>
                        <span className="text-[#0f172a] font-semibold">{tip.category}</span>
                      </div>
                      <div>
                        <span className="text-[#334155]">Severity: </span>
                        <span className="text-[#0f172a] font-semibold">{tip.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Routing + actions */}
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Routing Status</p>
                  <div className="space-y-1.5 mb-4">
                    {tip.severity === 'CRITICAL' && (
                      <>
                        <RoutingItem label="Routed to SIU" done />
                        <RoutingItem label="Routed to Auditor-General" done />
                        <RoutingItem label="Risk engine updated" done />
                        <RoutingItem label="Linked to tender record" done={!!tip.relatedTender} />
                      </>
                    )}
                    {tip.severity === 'HIGH' && (
                      <>
                        <RoutingItem label="Routed to SIU" done />
                        <RoutingItem label="Risk engine updated" done />
                        <RoutingItem label="Linked to tender record" done={!!tip.relatedTender} />
                        <RoutingItem label="Escalation pending review" done={false} />
                      </>
                    )}
                    {tip.severity === 'MEDIUM' && (
                      <>
                        <RoutingItem label="Logged for monitoring" done />
                        <RoutingItem label="Risk engine updated" done />
                        <RoutingItem label="Awaiting corroboration" done={false} />
                      </>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <button className="w-full text-left text-[11px] font-semibold text-purple-400 border border-purple-900/60 bg-purple-950/40 px-3 py-1.5 rounded-sm hover:bg-purple-950/60 transition-colors">
                      Escalate to SIU
                    </button>
                    <button className="w-full text-left text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">
                      Request More Information
                    </button>
                    <button className="w-full text-left text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-1.5 rounded-sm hover:border-[#cbd5e1] transition-colors">
                      Close Tip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function RoutingItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-sm border ${done ? 'text-[#16a34a] border-green-900/50 bg-green-950/40' : 'text-[#334155] border-[#e2e8f0] bg-white'}`}>
      <span className="font-mono">{done ? '✓' : '○'}</span>
      {label}
    </div>
  );
}

function SubmitTipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const ref = `TIP-2024-${Math.floor(Math.random() * 9000 + 1000)}`;

  if (submitted) {
    return (
      <div className="bg-white border border-green-900/50 rounded-sm p-5 text-center">
        <div className="w-10 h-10 bg-green-950/60 border border-green-900/50 rounded-sm flex items-center justify-center mx-auto mb-3">
          <Lock size={18} className="text-[#16a34a]" />
        </div>
        <p className="text-[#16a34a] font-bold text-[13px] uppercase tracking-wide">Tip Submitted Securely</p>
        <p className="text-[#64748b] text-[11px] mt-2 leading-relaxed">
          Your tip has been encrypted and anonymised.<br />
          Reference: <span className="font-mono text-[#0f172a]">{ref}</span>
        </p>
        <button
          onClick={() => { setSubmitted(false); setCategory(''); setMessage(''); }}
          className="mt-4 text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-4 py-1.5 rounded-sm hover:border-[#cbd5e1] transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-sm p-4 space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0]">
        <Lock size={12} className="text-[#16a34a]" />
        <span className="text-[#0f172a] text-[12px] font-semibold">Submit Anonymous Tip</span>
        <span className="ml-auto text-[10px] font-bold text-[#16a34a] bg-green-950/40 border border-green-900/50 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">E2E Encrypted</span>
      </div>
      <div>
        <label className="text-[#334155] text-[10px] font-bold uppercase tracking-widest block mb-1">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2.5 py-1.5 text-[12px] text-[#334155] focus:outline-none focus:border-[#cbd5e1] transition-colors"
        >
          <option value="">Select category...</option>
          <option>Specification Rigging</option>
          <option>Ghost Vendor</option>
          <option>Collusive Bidding</option>
          <option>Fronting</option>
          <option>Bribery</option>
          <option>Inflated Pricing</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="text-[#334155] text-[10px] font-bold uppercase tracking-widest block mb-1">Description</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          placeholder="Describe the suspected irregularity. Include dates, amounts, names, or reference numbers if known..."
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2.5 py-1.5 text-[12px] text-[#334155] placeholder-[#2a4a6b] focus:outline-none focus:border-[#cbd5e1] resize-none transition-colors"
        />
      </div>
      <button
        onClick={() => { if (category && message) setSubmitted(true); }}
        disabled={!category || !message}
        className="w-full text-[11px] font-bold uppercase tracking-wide text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] py-2 rounded-sm hover:bg-[#0f2040] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Submit Encrypted Tip
      </button>
      <p className="text-[#334155] text-[10px] text-center leading-relaxed">
        No metadata collected · POPIA compliant<br />
        Protected Disclosures Act 26 of 2000
      </p>
    </div>
  );
}

export function Whistleblower() {
  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Tips Received (30d)', value: mockWhistleblowerTips.length, color: 'text-[#0f172a]' },
          { label: 'Escalated to SIU', value: mockWhistleblowerTips.filter(t => t.status === 'ESCALATED').length, color: 'text-purple-400' },
          { label: 'Under Investigation', value: mockWhistleblowerTips.filter(t => t.status === 'INVESTIGATING').length, color: 'text-yellow-500' },
          { label: 'Avg NLP Confidence', value: `${(mockWhistleblowerTips.reduce((s, t) => s + t.nlpConfidence, 0) / mockWhistleblowerTips.length).toFixed(1)}%`, color: 'text-[#0284c7]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Tips table */}
        <div className="col-span-2">
          <Card>
            <CardHeader title="Active Tips" subtitle="Click any row to expand NLP analysis and routing status" />
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Tip ID</th>
                    <th>Severity</th>
                    <th>Category</th>
                    <th>Summary</th>
                    <th>NLP Confidence</th>
                    <th>Linked Tender</th>
                    <th>Received</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mockWhistleblowerTips.map(tip => <TipRow key={tip.id} tip={tip} />)}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Submit + legal */}
        <div className="space-y-3">
          <SubmitTipForm />
          <div className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Legal Protection</p>
            <p className="text-[#64748b] text-[11px] leading-relaxed">
              Whistleblowers are protected under the{' '}
              <span className="text-[#334155] font-semibold">Protected Disclosures Act 26 of 2000</span>{' '}
              and the{' '}
              <span className="text-[#334155] font-semibold">Public Interest Disclosure Act</span>.
              Retaliation against a whistleblower is a criminal offence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

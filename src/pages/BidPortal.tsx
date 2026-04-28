
import { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { IntegrityScore } from '../components/ui/IntegrityScore';
import { mockBidSubmissions, type BidSubmission } from '../data/extendedData';

const STAGES = ['ADMIN_COMPLIANCE', 'FUNCTIONALITY', 'PRICE_EVALUATION', 'BBBEE', 'AWARD_RECOMMENDATION', 'COMPLETE'];
const STAGE_LABELS: Record<string, string> = {
  ADMIN_COMPLIANCE: 'Admin & Compliance',
  FUNCTIONALITY: 'Functionality',
  PRICE_EVALUATION: 'Price Evaluation',
  BBBEE: 'B-BBEE',
  AWARD_RECOMMENDATION: 'Award Recommendation',
  COMPLETE: 'Complete',
};

function EvaluationPipeline({ stage, status }: { stage: string; status: string }) {
  const currentIdx = STAGES.indexOf(stage);
  return (
    <div className="flex items-center gap-0">
      {STAGES.map((s, i) => {
        const done = i < currentIdx || status === 'PASSED';
        const active = i === currentIdx && status !== 'PASSED' && status !== 'REJECTED';
        const rejected = status === 'REJECTED' && i === currentIdx;
        return (
          <div key={s} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 px-2`}>
              <div className={`w-5 h-5 rounded-sm border flex items-center justify-center text-[9px] font-bold transition-colors ${
                rejected ? 'bg-red-950/60 border-red-900/60 text-[#dc2626]' :
                done ? 'bg-green-950/60 border-green-900/60 text-[#16a34a]' :
                active ? 'bg-[#0c1e38] border-[#d4a843] text-[#d4a843]' :
                'bg-white border-[#e2e8f0] text-[#334155]'
              }`}>
                {rejected ? '✕' : done ? '✓' : i + 1}
              </div>
              <span className={`text-[8px] font-semibold uppercase tracking-wide whitespace-nowrap ${
                rejected ? 'text-[#dc2626]' : done ? 'text-[#16a34a]' : active ? 'text-[#d4a843]' : 'text-[#334155]'
              }`}>{STAGE_LABELS[s]}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-px w-4 ${i < currentIdx ? 'bg-green-900/60' : 'bg-[#e2e8f0]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BidRow({ bid }: { bid: BidSubmission }) {
  const [expanded, setExpanded] = useState(false);
  const flaggedItems = bid.boqItems.filter(i => i.flagged);

  return (
    <>
      <tr className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td><IntegrityScore score={bid.aiValidationScore} size="sm" showLabel={false} /></td>
        <td><span className="font-mono text-[#0284c7] text-[11px]">{bid.tenderRef}</span></td>
        <td>
          <p className="text-[#0f172a] font-medium text-[12px]">{bid.tenderTitle}</p>
          <p className="text-[#334155] text-[10px] mt-0.5">{bid.vendorName}</p>
        </td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{bid.vendorCSD}</span></td>
        <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(bid.totalBidValue / 1_000_000).toFixed(0)}M</span></td>
        <td>
          <div className="overflow-x-auto">
            <EvaluationPipeline stage={bid.evaluationStage} status={bid.status} />
          </div>
        </td>
        <td>
          <Badge
            label={bid.status}
            variant="status"
            status={bid.status === 'REJECTED' ? 'SUSPENDED' : bid.status === 'PASSED' ? 'CLEARED' : bid.status === 'ESCALATED' ? 'ESCALATED' : 'UNDER_REVIEW'}
            dot
          />
        </td>
        <td>
          <button className="text-[#334155] hover:text-[#0284c7] transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={8} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4 space-y-4">
              {/* Validation flags */}
              {bid.validationFlags.length > 0 && (
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">AI Validation Flags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {bid.validationFlags.map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-[#dc2626] bg-red-950/40 border border-red-900/50 px-2.5 py-1 rounded-sm">
                        <AlertTriangle size={10} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BoQ Analysis */}
              <div>
                <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">
                  Bill of Quantities Analysis — {flaggedItems.length} of {bid.boqItems.length} items flagged
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Unit Price</th>
                      <th className="text-right">Benchmark</th>
                      <th className="text-right">Variance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bid.boqItems.map((item, i) => {
                      const variance = item.benchmarkPrice > 0
                        ? Math.round(((item.unitPrice - item.benchmarkPrice) / item.benchmarkPrice) * 100)
                        : 0;
                      return (
                        <tr key={i} className={item.flagged ? 'bg-red-950/10' : ''}>
                          <td>
                            <div className="flex items-center gap-1.5">
                              {item.flagged
                                ? <AlertTriangle size={11} className="text-[#dc2626] shrink-0" />
                                : <CheckCircle size={11} className="text-[#16a34a] shrink-0" />
                              }
                              <span className={`text-[12px] ${item.flagged ? 'text-red-300' : 'text-[#334155]'}`}>{item.description}</span>
                            </div>
                          </td>
                          <td className="text-right"><span className="font-mono text-[#64748b]">{item.qty.toLocaleString()}</span></td>
                          <td className="text-right">
                            <span className={`font-mono font-semibold ${item.flagged ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>
                              R{item.unitPrice.toLocaleString()}
                            </span>
                          </td>
                          <td className="text-right"><span className="font-mono text-[#334155]">R{item.benchmarkPrice.toLocaleString()}</span></td>
                          <td className="text-right">
                            <span className={`font-mono font-bold ${variance > 100 ? 'text-[#dc2626]' : variance > 20 ? 'text-[#ea580c]' : variance > 0 ? 'text-yellow-500' : 'text-[#16a34a]'}`}>
                              {variance > 0 ? '+' : ''}{variance}%
                            </span>
                          </td>
                          <td>
                            {item.flagged
                              ? <Badge label="FLAGGED" variant="risk" riskLevel="HIGH" />
                              : <Badge label="CLEARED" variant="status" status="CLEARED" />
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#e2e8f0]">
                {bid.status === 'ESCALATED' && (
                  <button className="text-[11px] font-semibold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-3 py-1.5 rounded-sm hover:bg-red-950/60 transition-colors">
                    Reject Bid
                  </button>
                )}
                <button className="text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">
                  Full Evaluation Report
                </button>
                <button className="text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-1.5 rounded-sm hover:border-[#cbd5e1] transition-colors">
                  Request Clarification
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function BidPortal() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'submit'>('submissions');

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Submissions', value: mockBidSubmissions.length, color: 'text-[#0f172a]' },
          { label: 'AI Rejected', value: mockBidSubmissions.filter(b => b.status === 'REJECTED').length, color: 'text-[#dc2626]' },
          { label: 'Passed Validation', value: mockBidSubmissions.filter(b => b.status === 'PASSED').length, color: 'text-[#16a34a]' },
          { label: 'Under Review', value: mockBidSubmissions.filter(b => b.status === 'ESCALATED' || b.status === 'AI_REVIEW').length, color: 'text-yellow-500' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e2e8f0]">
        {[['submissions', 'Bid Submissions'], ['submit', 'Submit New Bid']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'submissions' | 'submit')}
            className={`px-4 py-2 text-[12px] font-semibold border-b-2 transition-colors ${activeTab === id ? 'border-[#d4a843] text-[#0f172a]' : 'border-transparent text-[#64748b] hover:text-[#334155]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'submissions' && (
        <Card>
          <CardHeader
            title="Bid Submission Register"
            subtitle="All bids processed through AI validation pipeline — click to expand BoQ analysis"
          />
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>AI Score</th>
                  <th>Tender Ref</th>
                  <th>Tender / Vendor</th>
                  <th>CSD Number</th>
                  <th className="text-right">Bid Value</th>
                  <th>Evaluation Pipeline</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mockBidSubmissions.map(bid => <BidRow key={bid.id} bid={bid} />)}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'submit' && (
        <Card>
          <CardHeader title="Digital Bid Submission Portal" subtitle="All bids are processed through AI validation immediately upon submission — no manual intervention" />
          <div className="p-6 max-w-2xl">
            <div className="space-y-4">
              <div className="bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm p-4 flex items-start gap-3">
                <FileText size={16} className="text-[#0284c7] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#0f172a] text-[12px] font-semibold">Secure Digital Submission</p>
                  <p className="text-[#64748b] text-[11px] mt-1 leading-relaxed">
                    All bids are submitted digitally and immediately processed through SentinelProcure AI's validation engines.
                    This eliminates manual intervention points prone to document tampering. Every submission is timestamped,
                    hashed, and recorded on the immutable audit ledger.
                  </p>
                </div>
              </div>

              {[
                { label: 'Tender Reference Number', placeholder: 'e.g. GT/DPW/2024/001' },
                { label: 'CSD Supplier Number', placeholder: 'e.g. MAAA0123456' },
                { label: 'Company Registration (CIPC)', placeholder: 'e.g. 2018/445231/07' },
                { label: 'Total Bid Value (ZAR)', placeholder: 'e.g. 12500000' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[#334155] text-[10px] font-bold uppercase tracking-widest block mb-1">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-[12px] text-[#334155] placeholder-[#2a4a6b] focus:outline-none focus:border-[#cbd5e1] transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="text-[#334155] text-[10px] font-bold uppercase tracking-widest block mb-1">Upload Bid Documents</label>
                <div className="border border-dashed border-[#cbd5e1] rounded-sm p-6 text-center bg-[#f8fafc] hover:border-[#2a5298] transition-colors cursor-pointer">
                  <Upload size={20} className="text-[#334155] mx-auto mb-2" />
                  <p className="text-[#64748b] text-[11px]">Drag and drop bid documents, or click to browse</p>
                  <p className="text-[#334155] text-[10px] mt-1">PDF, DOCX, XLSX accepted · Max 50MB · All files are virus-scanned and hashed</p>
                </div>
              </div>

              <button className="w-full text-[12px] font-bold uppercase tracking-wide text-[#0f172a] border border-[#cbd5e1] bg-[#0c1e38] py-2.5 rounded-sm hover:bg-[#0f2040] transition-colors">
                Submit Bid for AI Validation
              </button>
              <p className="text-[#334155] text-[10px] text-center">
                Submission triggers immediate AI validation · Results within 60 seconds · Immutable audit record created
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

import { MapPin, CheckCircle, Clock, AlertTriangle, Camera, ChevronDown, ChevronUp, Satellite } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockContracts, type ContractMilestone } from '../data/mockData';
import { mockGPSVerifications } from '../data/securityData2';

function ContractRow({ contract }: { contract: ContractMilestone }) {
  const [expanded, setExpanded] = useState(false);
  const paymentRatio = (contract.paidToDate / contract.totalValue) * 100;
  const discrepancy = paymentRatio - contract.completionPercent;
  const hasDiscrepancy = discrepancy > 15;

  const leftBorder: Record<string, string> = {
    CRITICAL: 'border-l-red-500',
    HIGH:     'border-l-orange-500',
    MEDIUM:   'border-l-yellow-500',
    LOW:      'border-l-green-500',
  };

  return (
    <>
      <tr className={`cursor-pointer border-l-2 ${leftBorder[contract.riskLevel]}`} onClick={() => setExpanded(!expanded)}>
        <td><span className="font-mono text-[#0284c7] text-[11px]">{contract.contractRef}</span></td>
        <td>
          <p className="text-[#0f172a] font-medium text-[12px]">{contract.project}</p>
          <p className="text-[#334155] text-[10px] mt-0.5">{contract.department}</p>
        </td>
        <td className="text-right"><span className="font-mono font-semibold text-[#0f172a]">R{(contract.totalValue / 1_000_000).toFixed(0)}M</span></td>
        <td className="text-right">
          <span className={`font-mono font-semibold ${hasDiscrepancy ? 'text-[#dc2626]' : 'text-[#0f172a]'}`}>
            R{(contract.paidToDate / 1_000_000).toFixed(1)}M
          </span>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0] w-20">
              <div className="h-1.5 rounded-sm bg-[#1e3a5f]" style={{ width: `${contract.completionPercent}%` }} />
            </div>
            <span className="font-mono text-[#334155] text-[11px] w-8">{contract.completionPercent}%</span>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0] w-20">
              <div className="h-1.5 rounded-sm" style={{ width: `${paymentRatio}%`, background: hasDiscrepancy ? '#ef4444' : '#22c55e' }} />
            </div>
            <span className={`font-mono text-[11px] w-8 ${hasDiscrepancy ? 'text-[#dc2626]' : 'text-[#334155]'}`}>{paymentRatio.toFixed(0)}%</span>
          </div>
        </td>
        <td>
          <div className={`flex items-center gap-1 text-[11px] ${contract.gpsVerified ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            <MapPin size={11} />
            {contract.gpsVerified ? 'Verified' : 'Unverified'}
          </div>
        </td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{contract.expectedCompletion}</span></td>
        <td><Badge label={contract.riskLevel} variant="risk" riskLevel={contract.riskLevel} dot /></td>
        <td>
          <button className="text-[#334155] hover:text-[#0284c7] transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={10} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4">
              <div className="grid grid-cols-3 gap-6">
                {/* Discrepancy alert */}
                <div className="col-span-2 space-y-3">
                  {hasDiscrepancy && (
                    <div className="flex items-start gap-2 bg-red-950/40 border border-red-900/50 rounded-sm p-3">
                      <AlertTriangle size={13} className="text-[#dc2626] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[#dc2626] font-semibold text-[12px]">Payment-Progress Discrepancy Detected</p>
                        <p className="text-[#dc2626]/70 text-[11px] mt-0.5">
                          {discrepancy.toFixed(0)}% more paid than physical work completed. Possible over-invoicing or fraudulent claims.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  <div>
                    <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Milestone Tracker</p>
                    <table>
                      <thead>
                        <tr>
                          <th>Milestone</th>
                          <th>Due Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contract.milestones.map(m => (
                          <tr key={m.name}>
                            <td>
                              <div className="flex items-center gap-2">
                                {m.status === 'COMPLETE' && <CheckCircle size={12} className="text-[#16a34a] shrink-0" />}
                                {m.status === 'OVERDUE' && <AlertTriangle size={12} className="text-[#dc2626] shrink-0" />}
                                {m.status === 'PENDING' && <Clock size={12} className="text-[#334155] shrink-0" />}
                                <span className={`text-[12px] ${m.status === 'OVERDUE' ? 'text-[#dc2626]' : m.status === 'COMPLETE' ? 'text-[#334155]' : 'text-[#64748b]'}`}>
                                  {m.name}
                                </span>
                              </div>
                            </td>
                            <td><span className="font-mono text-[#64748b] text-[11px]">{m.due}</span></td>
                            <td>
                              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm border ${
                                m.status === 'COMPLETE' ? 'text-[#16a34a] bg-green-950/40 border-green-900/50' :
                                m.status === 'OVERDUE' ? 'text-[#dc2626] bg-red-950/40 border-red-900/50' :
                                'text-[#334155] bg-white border-[#e2e8f0]'
                              }`}>{m.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Site info + actions */}
                <div className="space-y-3">
                  <div>
                    <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Site Verification</p>
                    <div className="bg-white border border-[#e2e8f0] rounded-sm p-3 space-y-2">
                      <div className="flex items-center gap-2 text-[11px]">
                        <MapPin size={11} className={contract.gpsVerified ? 'text-[#16a34a]' : 'text-[#dc2626]'} />
                        <span className={contract.gpsVerified ? 'text-[#16a34a]' : 'text-[#dc2626]'}>
                          GPS {contract.gpsVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                        <Camera size={11} />
                        Last site visit: <span className="font-mono text-[#334155]">{contract.lastSiteVisit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <button className="w-full text-left text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">
                      Request Site Inspection
                    </button>
                    {hasDiscrepancy && (
                      <button className="w-full text-left text-[11px] font-semibold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-3 py-1.5 rounded-sm hover:bg-red-950/60 transition-colors">
                        Freeze Payments
                      </button>
                    )}
                    <button className="w-full text-left text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-1.5 rounded-sm hover:border-[#cbd5e1] transition-colors">
                      View IoT Sensor Data
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

function GPSVerificationRow({ gps }: { gps: any }) {
  const [expanded, setExpanded] = useState(false);
  const isSpoofed = gps.verificationStatus === 'SPOOFED';
  const rowClass = isSpoofed ? 'bg-[#fee2e2] cursor-pointer' : gps.verificationStatus === 'SUSPICIOUS' ? 'bg-orange-950/10 cursor-pointer' : 'cursor-pointer hover:bg-[#f1f5f9]';

  return (
    <>
      <tr className={rowClass} onClick={() => setExpanded(!expanded)}>
        <td>
          <p className="text-[#0f172a] font-semibold text-[12px]">{gps.project}</p>
          <p className="font-mono text-[#0284c7] text-[10px]">{gps.contractRef}</p>
        </td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{gps.submittedCoords}</span></td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{new Date(gps.submittedTimestamp).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}</span></td>
        <td>
          <div className={`flex items-center gap-1.5 text-[11px] ${gps.satelliteImageMatch ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {gps.satelliteImageMatch ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
            {gps.satelliteImageMatch ? 'Match' : 'NO MATCH'}
          </div>
        </td>
        <td>
          <div className={`flex items-center gap-1.5 text-[11px] ${gps.timestampAuthentic ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {gps.timestampAuthentic ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
            {gps.timestampAuthentic ? 'Authentic' : 'TAMPERED'}
          </div>
        </td>
        <td>
          <div className={`flex items-center gap-1.5 text-[11px] ${gps.locationConsistent ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {gps.locationConsistent ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
            {gps.locationConsistent ? 'Consistent' : 'INCONSISTENT'}
          </div>
        </td>
        <td><Badge label={gps.spoofingRisk} variant="risk" riskLevel={gps.spoofingRisk} dot /></td>
        <td>
          {gps.spoofingFlags.length > 0 ? (
            <div className="space-y-0.5">
              {gps.spoofingFlags.map((f: string, i: number) => <p key={i} className="text-[#dc2626] text-[10px] max-w-xs">⚠ {f}</p>)}
            </div>
          ) : <span className="text-[#16a34a] text-[11px]">✓ No flags</span>}
        </td>
        <td>
          <div className="flex items-center gap-3">
            <Badge
              label={gps.verificationStatus}
              variant="status"
              status={gps.verificationStatus === 'VERIFIED' ? 'CLEARED' : gps.verificationStatus === 'SPOOFED' ? 'SUSPENDED' : 'UNDER_REVIEW'}
              dot
            />
            <button className="text-[#334155] hover:text-[#0284c7] transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={9} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4 shadow-inner">
              <p className="text-[#0f172a] font-bold text-[13px] mb-3 flex items-center gap-2">
                <Camera size={14} className="text-[#0284c7]"/> AI Visual Verification Evidence
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Submitted Site Photo</span>
                    {isSpoofed && <span className="bg-[#fee2e2] text-[#dc2626] px-1.5 py-0.5 rounded font-mono text-[9px]">EXIF: JHB CBD</span>}
                  </p>
                  <img src={isSpoofed ? "/fraud-photo.png" : "/valid-photo.png"} alt="Submitted Site Photo" className="w-full h-56 object-cover rounded-sm border border-[#e2e8f0]" />
                </div>
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Satellite Cross-Reference</span>
                    <span className="bg-[#f1f5f9] text-[#64748b] px-1.5 py-0.5 rounded font-mono text-[9px]">Live Satellite Feed</span>
                  </p>
                  <img src={isSpoofed ? "/fraud-sat.png" : "/valid-sat.png"} alt="Satellite Reference" className="w-full h-56 object-cover rounded-sm border border-[#e2e8f0]" />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function Contracts() {
  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Contracts', value: mockContracts.length, color: 'text-[#0f172a]' },
          { label: 'GPS Verified', value: mockContracts.filter(c => c.gpsVerified).length, color: 'text-[#16a34a]' },
          { label: 'Payment Discrepancies', value: mockContracts.filter(c => ((c.paidToDate / c.totalValue) * 100) - c.completionPercent > 15).length, color: 'text-[#dc2626]' },
          { label: 'Overdue Milestones', value: mockContracts.reduce((s, c) => s + c.milestones.filter(m => m.status === 'OVERDUE').length, 0), color: 'text-[#ea580c]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Post-Award Contract Monitor"
          subtitle="Payment vs physical progress verification — GPS and IoT-backed"
        />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Contract Ref</th>
                <th>Project</th>
                <th className="text-right">Total Value</th>
                <th className="text-right">Paid to Date</th>
                <th>Physical Progress</th>
                <th>Payment Released</th>
                <th>GPS Status</th>
                <th>Expected Completion</th>
                <th>Risk</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockContracts.map(c => <ContractRow key={c.id} contract={c} />)}
            </tbody>
          </table>
        </div>
      </Card>

      {/* LOOPHOLE #12: GPS Anti-Spoofing */}
      <div className="relative overflow-hidden border border-[#fca5a5] rounded-sm bg-[#fef2f2] px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
        <Satellite size={15} className="text-[#dc2626] shrink-0 mt-0.5 pulse-critical" />
        <div>
          <p className="text-[#dc2626] font-bold text-[12px] uppercase tracking-wide">Loophole #12 Closed — GPS Anti-Spoofing & Satellite Cross-Reference</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            GPS coordinates can be spoofed — a contractor can submit a photo from a different site or copy previous visit coordinates.
            Every site visit submission is now cross-referenced against satellite imagery, photo EXIF metadata timestamps are verified,
            and coordinate consistency with previous visits is checked. Spoofed submissions trigger immediate payment freeze.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader title="GPS Verification Anti-Spoofing Register" subtitle="Satellite cross-reference, EXIF timestamp verification, coordinate consistency checks" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Contract</th><th>Submitted Coords</th><th>Timestamp</th>
                <th>Satellite Match</th><th>Timestamp Auth</th><th>Location Consistent</th>
                <th>Spoofing Risk</th><th>Flags</th><th>Verification</th>
              </tr>
            </thead>
            <tbody>


              {mockGPSVerifications.map(gps => <GPSVerificationRow key={gps.contractRef} gps={gps} />)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


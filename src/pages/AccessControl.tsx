
import { useState } from 'react';
import { Lock, UserCheck, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockSystemUsers, mockFlagClearances, type SystemUser } from '../data/securityData2';
import { useAuth } from '../context/AuthContext';

const roleLabels: Record<string, string> = {
  ANALYST: 'Analyst', SCM_OFFICER: 'SCM Officer', ACCOUNTING_OFFICER: 'Accounting Officer',
  AUDITOR: 'Auditor', SIU_LIAISON: 'SIU Liaison', SYSTEM_ADMIN: 'System Admin',
  TREASURY_EXEC: 'Treasury Exec', AG_EXEC: 'AG Exec'
};

const clearanceColors: Record<string, string> = {
  L1: 'text-[#64748b]', L2: 'text-blue-400', L3: 'text-yellow-500',
  L4: 'text-[#ea580c]', L5: 'text-[#d4a843]',
};

function UserRow({ user }: { user: SystemUser }) {
  const [expanded, setExpanded] = useState(false);
  const riskColor = user.riskScore >= 80 ? 'text-[#dc2626]' : user.riskScore >= 50 ? 'text-[#ea580c]' : 'text-[#16a34a]';
  const leftBorder = user.status === 'SUSPENDED' ? 'border-l-red-500' : user.status === 'UNDER_REVIEW' ? 'border-l-orange-500' : 'border-l-green-500';

  return (
    <>
      <tr className={`cursor-pointer border-l-2 ${leftBorder}`} onClick={() => setExpanded(!expanded)}>
        <td>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#0c1e38] border border-[#cbd5e1] flex items-center justify-center">
              <UserCheck size={11} className="text-[#0284c7]" />
            </div>
            <span className="text-[#0f172a] font-semibold text-[12px]">{user.name}</span>
          </div>
        </td>
        <td><span className="text-[#64748b] text-[11px]">{roleLabels[user.role]}</span></td>
        <td><span className="text-[#64748b] text-[11px]">{user.department}</span></td>
        <td><span className={`font-mono font-bold text-[12px] ${clearanceColors[user.clearance]}`}>{user.clearance}</span></td>
        <td>
          <div className={`flex items-center gap-1.5 text-[11px] ${user.mfaEnabled ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {user.mfaEnabled ? <CheckCircle size={11} /> : <XCircle size={11} />}
            {user.mfaEnabled ? 'Enabled' : 'DISABLED'}
          </div>
        </td>
        <td><span className="font-mono text-[#64748b] text-[11px]">{new Date(user.lastLogin).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}</span></td>
        <td><span className="font-mono text-[#0f172a]">{user.actionsToday}</span></td>
        <td>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-[#f1f5f9] rounded-sm h-1.5 border border-[#e2e8f0]">
              <div className="h-1.5 rounded-sm" style={{ width: `${user.riskScore}%`, background: user.riskScore >= 80 ? '#ef4444' : user.riskScore >= 50 ? '#f97316' : '#22c55e' }} />
            </div>
            <span className={`font-mono font-bold text-[12px] ${riskColor}`}>{user.riskScore}</span>
          </div>
        </td>
        <td>
          <Badge
            label={user.status.replace('_', ' ')}
            variant="status"
            status={user.status === 'ACTIVE' ? 'CLEARED' : user.status === 'SUSPENDED' ? 'SUSPENDED' : 'UNDER_REVIEW'}
            dot
          />
        </td>
        <td><button className="text-[#334155] hover:text-[#0284c7] transition-colors">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button></td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={10} className="p-0">
            <div className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] px-6 py-4">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Access Permissions</p>
                  <div className="space-y-1.5">
                    {[
                      { perm: 'View Tenders', allowed: true },
                      { perm: 'Clear Flags (requires dual-auth)', allowed: user.role === 'SCM_OFFICER' || user.role === 'ACCOUNTING_OFFICER' },
                      { perm: 'Approve Flag Clearances', allowed: user.role === 'ACCOUNTING_OFFICER' || user.role === 'AUDITOR' },
                      { perm: 'Access Whistleblower Tips', allowed: user.role === 'AUDITOR' || user.role === 'SIU_LIAISON' },
                      { perm: 'Blacklist Vendors', allowed: user.role === 'ACCOUNTING_OFFICER' },
                      { perm: 'Export Audit Logs', allowed: user.role === 'AUDITOR' || user.role === 'SYSTEM_ADMIN' },
                      { perm: 'Refer to SIU/Hawks', allowed: user.role === 'ACCOUNTING_OFFICER' || user.role === 'SIU_LIAISON' },
                    ].map(p => (
                      <div key={p.perm} className="flex items-center gap-2 text-[11px]">
                        {p.allowed ? <CheckCircle size={11} className="text-[#16a34a] shrink-0" /> : <XCircle size={11} className="text-[#334155] shrink-0" />}
                        <span className={p.allowed ? 'text-[#334155]' : 'text-[#334155]'}>{p.perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Risk Indicators</p>
                  <div className="space-y-1.5">
                    {user.flaggedActions > 0 && <div className="flex items-center gap-2 text-[11px] text-[#dc2626] bg-red-950/40 border border-red-900/50 px-2.5 py-1.5 rounded-sm"><AlertTriangle size={10} />{user.flaggedActions} flagged actions today</div>}
                    {!user.mfaEnabled && <div className="flex items-center gap-2 text-[11px] text-[#dc2626] bg-red-950/40 border border-red-900/50 px-2.5 py-1.5 rounded-sm"><XCircle size={10} />MFA not enabled — HIGH RISK</div>}
                    {user.actionsToday > 50 && <div className="flex items-center gap-2 text-[11px] text-[#ea580c] bg-orange-950/40 border border-orange-900/50 px-2.5 py-1.5 rounded-sm"><AlertTriangle size={10} />Unusually high action volume</div>}
                    {user.riskScore < 30 && <div className="flex items-center gap-2 text-[11px] text-[#16a34a] bg-green-950/40 border border-green-900/50 px-2.5 py-1.5 rounded-sm"><CheckCircle size={10} />Normal behaviour pattern</div>}
                  </div>
                </div>
                <div>
                  <p className="text-[#334155] text-[10px] font-bold uppercase tracking-widest mb-2">Actions</p>
                  <div className="space-y-1.5">
                    {user.status !== 'SUSPENDED' && <button className="w-full text-left text-[11px] font-semibold text-[#dc2626] border border-red-900/60 bg-red-950/40 px-3 py-1.5 rounded-sm hover:bg-red-950/60 transition-colors">Suspend Account</button>}
                    {!user.mfaEnabled && <button className="w-full text-left text-[11px] font-semibold text-[#ea580c] border border-orange-900/60 bg-orange-950/40 px-3 py-1.5 rounded-sm hover:bg-orange-950/60 transition-colors">Force MFA Enrolment</button>}
                    <button className="w-full text-left text-[11px] font-semibold text-[#0284c7] border border-[#cbd5e1] bg-[#0c1e38] px-3 py-1.5 rounded-sm hover:bg-[#0f2040] transition-colors">View Full Activity Log</button>
                    <button className="w-full text-left text-[11px] font-semibold text-purple-400 border border-purple-900/60 bg-purple-950/40 px-3 py-1.5 rounded-sm hover:bg-purple-950/60 transition-colors">Refer to Internal Audit</button>
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

export function AccessControl() {
  const { user, auditLogs } = useAuth();
  const isExecutive = user?.role === 'TREASURY_EXEC' || user?.role === 'AG_EXEC';

  const suspended = mockSystemUsers.filter(u => u.status === 'SUSPENDED').length;
  const noMfa = mockSystemUsers.filter(u => !u.mfaEnabled).length;
  const underReview = mockSystemUsers.filter(u => u.status === 'UNDER_REVIEW').length;

  return (
    <div className="p-5 space-y-4 bg-grid min-h-full">
      <div className="relative overflow-hidden border border-[#cbd5e1] rounded-sm bg-white px-4 py-3 flex items-start gap-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4a843]" />
        <Lock size={15} className="text-[#d4a843] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#d4a843] font-bold text-[12px] uppercase tracking-wide">Role-Based Access Control — Dual Authorisation Enforced</p>
          <p className="text-[#64748b] text-[11px] mt-0.5">
            Every flag clearance requires dual authorisation from two different officials at different clearance levels.
            No single user can clear a flag they raised, or clear a flag on a tender in their own department.
            All actions are immutably logged. MFA is mandatory for all clearance-level actions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total System Users', value: mockSystemUsers.length, color: 'text-[#0f172a]' },
          { label: 'Accounts Suspended', value: suspended, color: 'text-[#dc2626]' },
          { label: 'Under Review', value: underReview, color: 'text-[#ea580c]' },
          { label: 'MFA Not Enabled', value: noMfa, color: 'text-[#dc2626]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-sm p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="System User Registry" subtitle="Role-based access — click to expand permissions and risk indicators" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>User</th><th>Role</th><th>Department</th><th>Clearance</th>
                <th>MFA</th><th>Last Login</th><th>Actions Today</th><th>Risk Score</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>{mockSystemUsers.map(u => <UserRow key={u.id} user={u} />)}</tbody>
          </table>
        </div>
      </Card>

      {isExecutive && (
        <Card>
          <CardHeader title="Executive Audit Log" subtitle="Live login and page access tracking for National Treasury & Attorney General oversight" />
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th><th>User</th><th>Role</th><th>Action</th>
                  <th>Details</th><th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td><span className="font-mono text-[#64748b] text-[11px]">{new Date(log.timestamp).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'medium' })}</span></td>
                    <td><span className="text-[#0f172a] text-[12px] font-semibold">{log.userName}</span></td>
                    <td><span className="text-[#64748b] text-[11px]">{roleLabels[log.userRole]}</span></td>
                    <td>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm border ${
                        log.action === 'LOGIN' ? 'bg-green-50 border-green-200 text-green-700' :
                        log.action === 'LOGOUT' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                        'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td><span className="text-[#334155] text-[11px]">{log.details}</span></td>
                    <td><span className="font-mono text-[#64748b] text-[11px]">{log.ipAddress}</span></td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-[#64748b] py-8 text-sm">
                      No activity recorded in the current session.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader title="Flag Clearance Audit Trail" subtitle="Every flag clearance attempt — dual authorisation required, all attempts logged immutably" />
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Flag ID</th><th>Tender Ref</th><th>Cleared By</th><th>Role</th>
                <th>Approver</th><th>Dual Auth</th><th>Timestamp</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockFlagClearances.map(fc => (
                <tr key={fc.id}>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{fc.flagId}</span></td>
                  <td><span className="font-mono text-[#0284c7] text-[11px]">{fc.tenderRef}</span></td>
                  <td><span className="text-[#0f172a] text-[12px]">{fc.clearedBy}</span></td>
                  <td><span className="text-[#64748b] text-[11px]">{roleLabels[fc.clearedByRole]}</span></td>
                  <td><span className={`text-[11px] ${fc.approvedBy.includes('PENDING') ? 'text-yellow-500' : fc.approvedBy.includes('REJECTED') ? 'text-[#dc2626]' : fc.approvedBy.includes('ESCALATED') ? 'text-purple-400' : 'text-[#16a34a]'}`}>{fc.approvedBy}</span></td>
                  <td>
                    <div className={`flex items-center gap-1.5 text-[11px] ${fc.dualAuthCompleted ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                      {fc.dualAuthCompleted ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {fc.dualAuthCompleted ? 'Complete' : 'Incomplete'}
                    </div>
                  </td>
                  <td><span className="font-mono text-[#64748b] text-[11px]">{new Date(fc.timestamp).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}</span></td>
                  <td><Badge label={fc.status.replace('_', ' ')} variant="status" status={fc.status === 'APPROVED' ? 'CLEARED' : fc.status === 'REJECTED' ? 'SUSPENDED' : fc.status === 'ESCALATED' ? 'ESCALATED' : 'UNDER_REVIEW'} dot /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Dual Authorisation Rules" subtitle="Enforced system-wide — cannot be bypassed by any single user" />
        <div className="p-4 grid grid-cols-2 gap-3">
          {[
            { rule: 'Flag Clearance', req: 'SCM Officer initiates → Accounting Officer approves (different department)', color: 'border-[#cbd5e1]' },
            { rule: 'Tender Award', req: 'SCM Officer recommends → Accounting Officer approves → NT notified', color: 'border-[#cbd5e1]' },
            { rule: 'Vendor Blacklisting', req: 'Analyst flags → Accounting Officer approves → SIU notified', color: 'border-[#cbd5e1]' },
            { rule: 'Emergency Procurement', req: 'Department head initiates → NT approves → AGSA oversight assigned', color: 'border-[#d4a843]/40' },
            { rule: 'Whistleblower Access', req: 'SIU Liaison only — no departmental officials can access tips about their own dept', color: 'border-purple-900/60' },
            { rule: 'Audit Log Export', req: 'Auditor requests → System Admin executes → AGSA notified of export', color: 'border-[#cbd5e1]' },
          ].map(r => (
            <div key={r.rule} className={`bg-white border rounded-sm p-3 ${r.color}`}>
              <p className="text-[#0f172a] text-[12px] font-semibold mb-1">{r.rule}</p>
              <p className="text-[#64748b] text-[11px]">{r.req}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


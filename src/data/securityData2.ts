
// ─── Security & Governance Data (Complete) ───────────────────────────────────
// This file replaces securityData.ts — all types and mock data for loopholes 1-22

export type UserRole = 'ANALYST' | 'SCM_OFFICER' | 'ACCOUNTING_OFFICER' | 'AUDITOR' | 'SIU_LIAISON' | 'SYSTEM_ADMIN' | 'TREASURY_EXEC' | 'AG_EXEC';
export type ClearanceLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

// ─── Existing Types (loopholes 1, 2, 6, 7, 8, 13) ────────────────────────────

export interface SystemUser {
  id: string; name: string; role: UserRole; department: string; clearance: ClearanceLevel;
  mfaEnabled: boolean; lastLogin: string; actionsToday: number; riskScore: number;
  flaggedActions: number; status: 'ACTIVE' | 'SUSPENDED' | 'UNDER_REVIEW';
}

export interface FlagClearanceAudit {
  id: string; flagId: string; tenderRef: string; clearedBy: string; clearedByRole: UserRole;
  approvedBy: string; approvedByRole: UserRole; reason: string; timestamp: string;
  dualAuthCompleted: boolean; overrideJustification: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
}

export interface CommitteeMember {
  id: string; name: string; idNumber: string; department: string; role: string;
  tenderId: string; tenderRef: string; declarationSubmitted: boolean;
  conflictDetected: boolean; conflictType?: string; conflictDetail?: string;
  linkedVendors: string[]; linkedPEPs: string[]; recusalRequired: boolean; recusalComplied: boolean;
}

export interface VariationOrder {
  id: string; contractRef: string; project: string; voNumber: string; description: string;
  originalValue: number; voValue: number; cumulativeVOs: number; cumulativePercent: number;
  approvedBy: string; submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'BLOCKED';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; aiFlag?: string;
}

export interface EmergencyTender {
  id: string; reference: string; title: string; department: string; value: number;
  disasterType: string; declaredAt: string; closingDate: string;
  scrutinyLevel: 'ENHANCED' | 'STANDARD'; fastTrackJustification: string;
  aiValidationScore: number; priceVerified: boolean; ownershipVerified: boolean;
  independentOversightAssigned: boolean; oversightOfficer: string;
  flags: string[]; status: 'ACTIVE' | 'AWARDED' | 'SUSPENDED' | 'UNDER_REVIEW';
}

export interface SubcontractorNode {
  id: string; name: string; cipcNumber: string; tier: number; contractValue: number;
  percentOfPrime: number; riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  flags: string[]; linkedToOfficial: boolean; officialLink?: string;
  registeredDate: string; employeeCount: number;
}

export interface InsiderEvent {
  id: string; userId: string; userName: string; userRole: UserRole; action: string;
  target: string; timestamp: string; ipAddress: string; riskScore: number;
  anomalyType?: string; flagged: boolean; reviewed: boolean;
}

export interface FinancialFlow {
  id: string; contractRef: string; vendor: string; paymentDate: string; amount: number;
  ficAlerted: boolean; kickbackRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; ficCaseRef?: string;
  suspiciousTransfers: { destination: string; amount: number; daysAfterPayment: number; flagged: boolean }[];
}

export interface BenchmarkIntegrity {
  source: string; lastUpdated: string; recordCount: number; integrityScore: number;
  suspectedContamination: boolean; contaminationDetail?: string; externalFeedActive: boolean;
}

// ─── New Types (loopholes 3, 5, 9, 10, 11, 12, 14, 16, 17) ──────────────────

export interface BoQAggregate {
  tenderId: string; tenderRef: string; vendorName: string;
  totalQuoted: number; totalBenchmark: number; aggregateMarkup: number;
  lineItemsAboveThreshold: number; lineItemsBelowThreshold: number;
  spreadPattern: boolean; spreadPatternDetail: string;
  status: 'BLOCKED' | 'FLAGGED' | 'CLEARED';
  items: { description: string; quoted: number; benchmark: number; markup: number; flagged: boolean }[];
}

export interface VendorViability {
  vendorId: string; vendorName: string; registrationDate: string; monthsTrading: number;
  annualRevenue: number; employeeCount: number; bankAccountAgeDays: number;
  contractValue: number; revenueToContractRatio: number; employeesToScopeRatio: number;
  viabilityScore: number; viabilityFlags: string[]; blocked: boolean;
}

export interface RotationPattern {
  id: string; entities: string[]; windowMonths: number; tendersAnalysed: number;
  winsPerEntity: Record<string, number>; patternConfidence: number;
  lastWinDate: string; dormancyMonths: number; reEntryDetected: boolean;
  reEntryDetail?: string; riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface OperationalExclusivityFlag {
  id: string; tenderRef: string;
  flagType: 'ISO_CERT' | 'DELIVERY_TIMELINE' | 'GEOGRAPHIC_RESTRICTION' | 'CAPACITY_THRESHOLD' | 'PROPRIETARY_SYSTEM';
  description: string; marketImpact: string; suppliersExcluded: number; suppliersCapable: number;
  confidence: number; severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface ReferralTracking {
  id: string; caseRef: string; agency: string; referredAt: string;
  acknowledgedAt?: string; lastActivityAt?: string; daysSinceActivity: number;
  status: 'PENDING_ACK' | 'ACKNOWLEDGED' | 'ACTIVE' | 'STALLED' | 'CLOSED';
  stalledFlag: boolean; escalationLevel: number; receivingOfficer: string;
  receivingOfficerRiskScore: number; independentVerification: boolean;
}

export interface GPSVerification {
  contractRef: string; project: string; submittedCoords: string; submittedTimestamp: string;
  photoHash: string; deviceId: string; satelliteImageMatch: boolean;
  timestampAuthentic: boolean; locationConsistent: boolean;
  previousVisitCoords: string; distanceFromPrevious: number;
  spoofingRisk: 'CRITICAL' | 'HIGH' | 'LOW'; spoofingFlags: string[];
  verificationStatus: 'VERIFIED' | 'SUSPICIOUS' | 'SPOOFED';
}

export interface ScoreGamingAlert {
  id: string; tenderRef: string; vendorName: string; detectedPattern: string;
  detail: string; confidence: number; severity: 'HIGH' | 'MEDIUM';
}

export interface BBBEEVerification {
  vendorId: string; vendorName: string; certNumber: string; issuingAgency: string;
  issuedDate: string; expiryDate: string; claimedLevel: number;
  commissionVerifiedLevel: number | null; agencyAccredited: boolean;
  commissionDatabaseMatch: boolean; fraudIndicators: string[];
  verificationStatus: 'VERIFIED' | 'MISMATCH' | 'AGENCY_UNACCREDITED' | 'NOT_FOUND' | 'EXPIRED';
}

export interface JVMember {
  name: string; cipcNumber: string; participationPercent: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; flags: string[];
  ownershipGraphRun: boolean; pepLinked: boolean; officialLinked: boolean; previousFlags: number;
}

export interface JVScreening {
  id: string; tenderRef: string; jvName: string; registeredDate: string; members: JVMember[];
  aggregateRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cleanVehicleDetected: boolean; cleanVehicleDetail?: string;
  status: 'FLAGGED' | 'CLEARED' | 'UNDER_REVIEW';
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockSystemUsers: SystemUser[] = [
  { id: 'U001', name: 'N. Mokoena', role: 'SCM_OFFICER', department: 'Dept. of Public Works – Gauteng', clearance: 'L3', mfaEnabled: true, lastLogin: '2024-11-10T07:45:00Z', actionsToday: 47, riskScore: 78, flaggedActions: 6, status: 'UNDER_REVIEW' },
  { id: 'U002', name: 'T. van Wyk', role: 'ACCOUNTING_OFFICER', department: 'National Treasury', clearance: 'L4', mfaEnabled: true, lastLogin: '2024-11-10T08:12:00Z', actionsToday: 12, riskScore: 14, flaggedActions: 0, status: 'ACTIVE' },
  { id: 'U003', name: 'S. Dlamini', role: 'ANALYST', department: 'Dept. of Health – Western Cape', clearance: 'L2', mfaEnabled: false, lastLogin: '2024-11-09T23:14:00Z', actionsToday: 89, riskScore: 91, flaggedActions: 12, status: 'SUSPENDED' },
  { id: 'U004', name: 'P. Nkosi', role: 'SCM_OFFICER', department: 'SANRAL – Limpopo', clearance: 'L3', mfaEnabled: true, lastLogin: '2024-11-10T06:30:00Z', actionsToday: 34, riskScore: 62, flaggedActions: 4, status: 'UNDER_REVIEW' },
  { id: 'U005', name: 'A. Botha', role: 'AUDITOR', department: 'Auditor-General SA', clearance: 'L5', mfaEnabled: true, lastLogin: '2024-11-10T08:00:00Z', actionsToday: 8, riskScore: 5, flaggedActions: 0, status: 'ACTIVE' },
  { id: 'U006', name: 'R. Sithole', role: 'SYSTEM_ADMIN', department: 'SITA – National', clearance: 'L5', mfaEnabled: true, lastLogin: '2024-11-10T02:17:00Z', actionsToday: 156, riskScore: 84, flaggedActions: 9, status: 'UNDER_REVIEW' },
];

export const mockFlagClearances: FlagClearanceAudit[] = [
  { id: 'FC001', flagId: 'RF001', tenderRef: 'GT/DPW/2024/001', clearedBy: 'N. Mokoena', clearedByRole: 'SCM_OFFICER', approvedBy: '— PENDING —', approvedByRole: 'ACCOUNTING_OFFICER', reason: 'Vendor provided technical justification', timestamp: '2024-11-09T14:22:00Z', dualAuthCompleted: false, overrideJustification: 'Vendor claims proprietary specs are industry standard', status: 'PENDING_APPROVAL' },
  { id: 'FC002', flagId: 'RF003', tenderRef: 'WC/HEALTH/2024/047', clearedBy: 'S. Dlamini', clearedByRole: 'ANALYST', approvedBy: '— REJECTED —', approvedByRole: 'ACCOUNTING_OFFICER', reason: 'Attempted to clear collusion flag without evidence', timestamp: '2024-11-08T11:05:00Z', dualAuthCompleted: false, overrideJustification: 'No valid justification provided', status: 'REJECTED' },
  { id: 'FC003', flagId: 'RF005', tenderRef: 'LP/ROADS/2024/078', clearedBy: 'P. Nkosi', clearedByRole: 'SCM_OFFICER', approvedBy: '— ESCALATED TO SIU —', approvedByRole: 'SIU_LIAISON', reason: 'Attempted to clear PEP/fronting flag', timestamp: '2024-11-07T16:45:00Z', dualAuthCompleted: false, overrideJustification: 'Clearance attempt by official in same department as flagged tender', status: 'ESCALATED' },
];

export const mockCommitteeMembers: CommitteeMember[] = [
  { id: 'CM001', name: 'J. Mahlangu', idNumber: '7801015***084', department: 'Dept. of Public Works – Gauteng', role: 'Chairperson', tenderId: 'T001', tenderRef: 'GT/DPW/2024/001', declarationSubmitted: true, conflictDetected: true, conflictType: 'Beneficial Ownership', conflictDetail: 'Spouse is director of Apex Construction Holdings — the sole bidder', linkedVendors: ['Apex Construction Holdings (Pty) Ltd'], linkedPEPs: ['M. Dlamini'], recusalRequired: true, recusalComplied: false },
  { id: 'CM002', name: 'F. Pretorius', idNumber: '8203125***082', department: 'Dept. of Public Works – Gauteng', role: 'Technical Evaluator', tenderId: 'T001', tenderRef: 'GT/DPW/2024/001', declarationSubmitted: true, conflictDetected: false, linkedVendors: [], linkedPEPs: [], recusalRequired: false, recusalComplied: true },
  { id: 'CM003', name: 'B. Khumalo', idNumber: '9105234***081', department: 'Dept. of Health – Western Cape', role: 'Financial Evaluator', tenderId: 'T002', tenderRef: 'WC/HEALTH/2024/047', declarationSubmitted: false, conflictDetected: true, conflictType: 'Undisclosed Interest', conflictDetail: 'Failed to declare — ownership graph links to MediSupply SA via sibling', linkedVendors: ['MediSupply SA (Pty) Ltd'], linkedPEPs: [], recusalRequired: true, recusalComplied: false },
  { id: 'CM004', name: 'L. Erasmus', idNumber: '7612085***083', department: 'Dept. of Health – Western Cape', role: 'Chairperson', tenderId: 'T002', tenderRef: 'WC/HEALTH/2024/047', declarationSubmitted: true, conflictDetected: false, linkedVendors: [], linkedPEPs: [], recusalRequired: false, recusalComplied: true },
  { id: 'CM005', name: 'T. Molefe', idNumber: '8509175***080', department: 'SANRAL – Limpopo', role: 'Chairperson', tenderId: 'T005', tenderRef: 'LP/ROADS/2024/078', declarationSubmitted: true, conflictDetected: true, conflictType: 'PEP Relationship', conflictDetail: 'Is the DPW official whose spouse (M. Dlamini) is beneficial owner of Apex Construction', linkedVendors: ['Apex Construction Holdings (Pty) Ltd'], linkedPEPs: ['M. Dlamini'], recusalRequired: true, recusalComplied: false },
];

export const mockVariationOrders: VariationOrder[] = [
  { id: 'VO001', contractRef: 'NW/HOUSING/2024/021', project: 'North West RDP Housing – 500 Units', voNumber: 'VO-001', description: 'Additional foundation works due to soil conditions', originalValue: 156_000_000, voValue: 8_400_000, cumulativeVOs: 8_400_000, cumulativePercent: 5.4, approvedBy: 'Dept. SCM Officer', submittedAt: '2024-09-15T00:00:00Z', status: 'APPROVED', riskLevel: 'LOW' },
  { id: 'VO002', contractRef: 'NW/HOUSING/2024/021', project: 'North West RDP Housing – 500 Units', voNumber: 'VO-002', description: 'Upgraded electrical specifications', originalValue: 156_000_000, voValue: 14_200_000, cumulativeVOs: 22_600_000, cumulativePercent: 14.5, approvedBy: 'Dept. SCM Officer', submittedAt: '2024-10-01T00:00:00Z', status: 'APPROVED', riskLevel: 'MEDIUM' },
  { id: 'VO003', contractRef: 'NW/HOUSING/2024/021', project: 'North West RDP Housing – 500 Units', voNumber: 'VO-003', description: 'Revised roofing material — premium specification', originalValue: 156_000_000, voValue: 31_000_000, cumulativeVOs: 53_600_000, cumulativePercent: 34.4, approvedBy: '— BLOCKED —', submittedAt: '2024-10-20T00:00:00Z', status: 'BLOCKED', riskLevel: 'CRITICAL', aiFlag: 'Cumulative VOs exceed 30% threshold. Total contract now R209.6M — 34% above original award. Automatic block triggered. Dual authorisation from Accounting Officer and NT required.' },
  { id: 'VO004', contractRef: 'EC/WATER/2024/033', project: 'Eastern Cape Rural Water Reticulation', voNumber: 'VO-001', description: 'Additional pipeline length — survey correction', originalValue: 312_000_000, voValue: 4_100_000, cumulativeVOs: 4_100_000, cumulativePercent: 1.3, approvedBy: 'Dept. SCM Officer', submittedAt: '2024-10-05T00:00:00Z', status: 'APPROVED', riskLevel: 'LOW' },
  { id: 'VO005', contractRef: 'NC/ENERGY/2024/009', project: 'Northern Cape Solar Farm Grid Connection', voNumber: 'VO-001', description: 'Grid connection point relocation', originalValue: 678_000_000, voValue: 9_800_000, cumulativeVOs: 9_800_000, cumulativePercent: 1.4, approvedBy: 'Dept. SCM Officer', submittedAt: '2024-10-12T00:00:00Z', status: 'FLAGGED', riskLevel: 'MEDIUM', aiFlag: 'VO submitted within 30 days of contract award — early VO pattern detected. Requires enhanced review.' },
];

export const mockEmergencyTenders: EmergencyTender[] = [
  { id: 'ET001', reference: 'KZN/DIS/2024/001', title: 'KZN Flood Relief — Emergency Water Purification Units', department: 'Dept. of Water & Sanitation – KZN', value: 45_000_000, disasterType: 'Flood', declaredAt: '2024-11-01T00:00:00Z', closingDate: '2024-11-05T00:00:00Z', scrutinyLevel: 'ENHANCED', fastTrackJustification: 'Presidential disaster declaration PDMC-2024-KZN-003 — 72-hour procurement window authorised', aiValidationScore: 71, priceVerified: true, ownershipVerified: true, independentOversightAssigned: true, oversightOfficer: 'A. Botha (AGSA)', flags: ['Price 45% above benchmark — justified by emergency logistics'], status: 'AWARDED' },
  { id: 'ET002', reference: 'GP/DIS/2024/002', title: 'Gauteng Informal Settlement Fire — Emergency Shelter Kits', department: 'Dept. of Human Settlements – Gauteng', value: 28_000_000, disasterType: 'Fire', declaredAt: '2024-11-03T00:00:00Z', closingDate: '2024-11-07T00:00:00Z', scrutinyLevel: 'ENHANCED', fastTrackJustification: 'Municipal disaster declaration — 500 families displaced', aiValidationScore: 34, priceVerified: false, ownershipVerified: false, independentOversightAssigned: false, oversightOfficer: '— NOT ASSIGNED —', flags: ['Price 280% above benchmark', 'Vendor registered 8 days ago', 'No independent oversight assigned', 'Ownership graph not completed'], status: 'SUSPENDED' },
];

export const mockSubcontractors: { primeContractor: string; contractRef: string; chain: SubcontractorNode[] }[] = [
  { primeContractor: 'Ubuntu Water Engineering', contractRef: 'EC/WATER/2024/033', chain: [
    { id: 'SC001', name: 'Ubuntu Water Engineering', cipcNumber: '2010/089234/07', tier: 1, contractValue: 312_000_000, percentOfPrime: 100, riskLevel: 'LOW', flags: [], linkedToOfficial: false, registeredDate: '2010-03-15', employeeCount: 145 },
    { id: 'SC002', name: 'Eastern Pipe Specialists CC', cipcNumber: '2015/234567/23', tier: 2, contractValue: 89_000_000, percentOfPrime: 28.5, riskLevel: 'LOW', flags: [], linkedToOfficial: false, registeredDate: '2015-07-22', employeeCount: 34 },
    { id: 'SC003', name: 'Rural Civil Works (Pty) Ltd', cipcNumber: '2018/345678/07', tier: 2, contractValue: 67_000_000, percentOfPrime: 21.5, riskLevel: 'LOW', flags: [], linkedToOfficial: false, registeredDate: '2018-01-10', employeeCount: 28 },
  ]},
  { primeContractor: 'BuildRight NW Consortium', contractRef: 'NW/HOUSING/2024/021', chain: [
    { id: 'SC004', name: 'BuildRight NW Consortium', cipcNumber: '2012/445678/07', tier: 1, contractValue: 156_000_000, percentOfPrime: 100, riskLevel: 'CRITICAL', flags: ['Blacklisted', 'Collusive Bidding'], linkedToOfficial: false, registeredDate: '2012-06-01', employeeCount: 12 },
    { id: 'SC005', name: 'NW Build Solutions CC', cipcNumber: '2023/891234/23', tier: 2, contractValue: 93_600_000, percentOfPrime: 60, riskLevel: 'CRITICAL', flags: ['Registered 2023', 'Director linked to DPW official', 'No employees on record'], linkedToOfficial: true, officialLink: 'Director is son of North West DPW Deputy Director — conflict of interest', registeredDate: '2023-08-14', employeeCount: 0 },
    { id: 'SC006', name: 'Rapid Housing Materials', cipcNumber: '2022/567890/07', tier: 3, contractValue: 56_000_000, percentOfPrime: 36, riskLevel: 'HIGH', flags: ['Registered 2022', 'Shares address with BuildRight'], linkedToOfficial: false, registeredDate: '2022-11-03', employeeCount: 3 },
  ]},
];

export const mockInsiderEvents: InsiderEvent[] = [
  { id: 'IE001', userId: 'U003', userName: 'S. Dlamini', userRole: 'ANALYST', action: 'Attempted flag clearance — RF003 (Collusion)', target: 'WC/HEALTH/2024/047', timestamp: '2024-11-08T11:05:00Z', ipAddress: '196.25.xxx.xxx', riskScore: 94, anomalyType: 'Unauthorised Override Attempt', flagged: true, reviewed: false },
  { id: 'IE002', userId: 'U003', userName: 'S. Dlamini', userRole: 'ANALYST', action: 'Accessed whistleblower tip TIP-2024-0879 (Bribery)', target: 'TIP-2024-0879', timestamp: '2024-11-08T23:14:00Z', ipAddress: '196.25.xxx.xxx', riskScore: 97, anomalyType: 'After-Hours Sensitive Access', flagged: true, reviewed: false },
  { id: 'IE003', userId: 'U001', userName: 'N. Mokoena', userRole: 'SCM_OFFICER', action: 'Attempted flag clearance — RF001 (Spec Rigging)', target: 'GT/DPW/2024/001', timestamp: '2024-11-09T14:22:00Z', ipAddress: '41.13.xxx.xxx', riskScore: 78, anomalyType: 'Conflict of Interest — Same Department', flagged: true, reviewed: false },
  { id: 'IE004', userId: 'U006', userName: 'R. Sithole', userRole: 'SYSTEM_ADMIN', action: 'Bulk audit log export — 3,400 records', target: 'AUDIT_LOG_DB', timestamp: '2024-11-10T02:17:00Z', ipAddress: '10.0.xxx.xxx', riskScore: 84, anomalyType: 'Unusual Hours + Bulk Data Export', flagged: true, reviewed: false },
  { id: 'IE005', userId: 'U004', userName: 'P. Nkosi', userRole: 'SCM_OFFICER', action: 'Attempted flag clearance — RF005 (Fronting/PEP)', target: 'LP/ROADS/2024/078', timestamp: '2024-11-07T16:45:00Z', ipAddress: '41.13.xxx.xxx', riskScore: 91, anomalyType: 'Conflict of Interest — Linked Department', flagged: true, reviewed: false },
  { id: 'IE006', userId: 'U002', userName: 'T. van Wyk', userRole: 'ACCOUNTING_OFFICER', action: 'Approved tender EC/WATER/2024/033', target: 'EC/WATER/2024/033', timestamp: '2024-11-10T08:12:00Z', ipAddress: '196.30.xxx.xxx', riskScore: 8, flagged: false, reviewed: true },
];

export const mockFinancialFlows: FinancialFlow[] = [
  { id: 'FF001', contractRef: 'NW/HOUSING/2024/021', vendor: 'BuildRight NW Consortium', paymentDate: '2024-09-20', amount: 46_800_000, ficAlerted: true, kickbackRisk: 'CRITICAL', ficCaseRef: 'FIC/2024/NW/0445', suspiciousTransfers: [
    { destination: 'NW Build Solutions CC', amount: 28_000_000, daysAfterPayment: 1, flagged: true },
    { destination: 'Personal Account — J. Mahlangu', amount: 4_200_000, daysAfterPayment: 3, flagged: true },
    { destination: 'Offshore Account — Mauritius', amount: 8_500_000, daysAfterPayment: 7, flagged: true },
  ]},
  { id: 'FF002', contractRef: 'GT/DPW/2024/001', vendor: 'Apex Construction Holdings', paymentDate: '2024-11-05', amount: 0, ficAlerted: false, kickbackRisk: 'CRITICAL', suspiciousTransfers: [] },
  { id: 'FF003', contractRef: 'EC/WATER/2024/033', vendor: 'Ubuntu Water Engineering', paymentDate: '2024-10-15', amount: 78_000_000, ficAlerted: false, kickbackRisk: 'LOW', suspiciousTransfers: [] },
];

export const mockBenchmarkIntegrity: BenchmarkIntegrity[] = [
  { source: 'Historical Government Tenders (2021–2024)', lastUpdated: '2024-11-01', recordCount: 47_234, integrityScore: 61, suspectedContamination: true, contaminationDetail: 'Estimated 23% of historical records contain inflated prices from pre-SentinelProcure era — benchmark pool partially corrupted', externalFeedActive: false },
  { source: 'Stats SA Producer Price Index (PPI)', lastUpdated: '2024-11-05', recordCount: 12_400, integrityScore: 94, suspectedContamination: false, externalFeedActive: true },
  { source: 'Retail Price Feed (Builders Warehouse, Makro, Takealot)', lastUpdated: '2024-11-10', recordCount: 8_900, integrityScore: 98, suspectedContamination: false, externalFeedActive: true },
  { source: 'International Procurement Database (World Bank)', lastUpdated: '2024-10-28', recordCount: 31_000, integrityScore: 91, suspectedContamination: false, externalFeedActive: true },
  { source: 'CIDB Cost Norms (Construction)', lastUpdated: '2024-09-15', recordCount: 5_600, integrityScore: 87, suspectedContamination: false, externalFeedActive: false },
];

// ─── New Mock Data (loopholes 3, 5, 9, 10, 11, 12, 14, 16, 17) ───────────────

export const mockBoQAggregates: BoQAggregate[] = [
  { tenderId: 'T001', tenderRef: 'GT/DPW/2024/001', vendorName: 'Apex Construction Holdings', totalQuoted: 487_000_000, totalBenchmark: 156_000_000, aggregateMarkup: 212, lineItemsAboveThreshold: 0, lineItemsBelowThreshold: 4, spreadPattern: true, spreadPatternDetail: 'All 4 line items priced at 180–220% above benchmark — each individually below the 500% auto-block threshold but collectively representing a 212% aggregate overcharge. Classic spread-inflation pattern.', status: 'BLOCKED', items: [
    { description: 'Road rehabilitation per lane/km', quoted: 25_600_000, benchmark: 8_200_000, markup: 212, flagged: true },
    { description: 'Welding knee guards (PPE)', quoted: 80_000, benchmark: 450, markup: 24900, flagged: true },
    { description: 'Site establishment lump sum', quoted: 12_000_000, benchmark: 3_500_000, markup: 243, flagged: true },
    { description: 'Traffic management per month', quoted: 850_000, benchmark: 180_000, markup: 372, flagged: true },
  ]},
  { tenderId: 'T003', tenderRef: 'KZN/EDUC/2024/112', vendorName: 'TechEd Solutions Africa', totalQuoted: 89_200_000, totalBenchmark: 42_000_000, aggregateMarkup: 112, lineItemsAboveThreshold: 0, lineItemsBelowThreshold: 3, spreadPattern: true, spreadPatternDetail: '3 line items each priced at 80–140% above benchmark. No single item triggers auto-block but aggregate overcharge is R47.2M. Pattern consistent with deliberate threshold avoidance.', status: 'FLAGGED', items: [
    { description: 'Student Tablet 10-inch', quoted: 12_800, benchmark: 3_500, markup: 266, flagged: true },
    { description: 'LTE Router per unit', quoted: 4_200, benchmark: 1_800, markup: 133, flagged: true },
    { description: 'Installation & config per school', quoted: 85_000, benchmark: 35_000, markup: 143, flagged: true },
  ]},
  { tenderId: 'T004', tenderRef: 'EC/WATER/2024/033', vendorName: 'Ubuntu Water Engineering', totalQuoted: 312_000_000, totalBenchmark: 298_000_000, aggregateMarkup: 5, lineItemsAboveThreshold: 0, lineItemsBelowThreshold: 0, spreadPattern: false, spreadPatternDetail: '', status: 'CLEARED', items: [
    { description: 'HDPE Pipeline 110mm per metre', quoted: 380, benchmark: 350, markup: 9, flagged: false },
    { description: 'Reservoir construction 500kL', quoted: 4_200_000, benchmark: 4_000_000, markup: 5, flagged: false },
    { description: 'Pump station installation', quoted: 1_800_000, benchmark: 1_750_000, markup: 3, flagged: false },
  ]},
];

export const mockVendorViability: VendorViability[] = [
  { vendorId: 'V003', vendorName: 'TechEd Solutions Africa', registrationDate: '2020-03-14', monthsTrading: 56, annualRevenue: 180_000, employeeCount: 2, bankAccountAgeDays: 18, contractValue: 89_200_000, revenueToContractRatio: 0.002, employeesToScopeRatio: 0.01, viabilityScore: 4, viabilityFlags: ['Annual revenue (R180k) is 0.2% of contract value (R89.2M) — financially incapable', 'Only 2 employees — insufficient capacity for ICT rollout to 400+ schools', 'Bank account opened 18 days before bid submission — ghost vendor indicator', 'No prior government contracts on record'], blocked: true },
  { vendorId: 'V006', vendorName: 'BuildRight NW Consortium', registrationDate: '2012-06-01', monthsTrading: 149, annualRevenue: 2_400_000, employeeCount: 12, bankAccountAgeDays: 4380, contractValue: 156_000_000, revenueToContractRatio: 0.015, employeesToScopeRatio: 0.08, viabilityScore: 11, viabilityFlags: ['Annual revenue (R2.4M) is 1.5% of contract value (R156M) — financially incapable', '12 employees cannot deliver 500 RDP housing units', 'No construction equipment assets on record'], blocked: true },
  { vendorId: 'V001', vendorName: 'Apex Construction Holdings', registrationDate: '2018-09-22', monthsTrading: 74, annualRevenue: 8_500_000, employeeCount: 34, bankAccountAgeDays: 2190, contractValue: 487_000_000, revenueToContractRatio: 0.017, employeesToScopeRatio: 0.07, viabilityScore: 9, viabilityFlags: ['Annual revenue (R8.5M) is 1.7% of contract value (R487M) — financially incapable', '34 employees insufficient for 19km road rehabilitation', 'No heavy plant or equipment assets registered'], blocked: true },
  { vendorId: 'V004', vendorName: 'Ubuntu Water Engineering', registrationDate: '2010-03-15', monthsTrading: 176, annualRevenue: 280_000_000, employeeCount: 145, bankAccountAgeDays: 5110, contractValue: 312_000_000, revenueToContractRatio: 0.90, employeesToScopeRatio: 0.46, viabilityScore: 91, viabilityFlags: [], blocked: false },
  { vendorId: 'V005', vendorName: 'Khanya Renewable Energy', registrationDate: '2016-07-08', monthsTrading: 100, annualRevenue: 520_000_000, employeeCount: 89, bankAccountAgeDays: 3650, contractValue: 678_000_000, revenueToContractRatio: 0.77, employeesToScopeRatio: 0.13, viabilityScore: 84, viabilityFlags: ['Revenue-to-contract ratio slightly below preferred threshold — monitor'], blocked: false },
];

export const mockRotationPatterns: RotationPattern[] = [
  { id: 'RP001', entities: ['BuildRight NW Consortium', 'NW Build Solutions CC', 'Rapid Housing Materials'], windowMonths: 60, tendersAnalysed: 18, winsPerEntity: { 'BuildRight NW Consortium': 7, 'NW Build Solutions CC': 6, 'Rapid Housing Materials': 5 }, patternConfidence: 99.1, lastWinDate: '2024-08-15', dormancyMonths: 0, reEntryDetected: false, riskLevel: 'CRITICAL' },
  { id: 'RP002', entities: ['MediSupply SA (Pty) Ltd', 'HealthPro Distributors', 'ClinicalEdge CC', 'MedEquip Solutions'], windowMonths: 60, tendersAnalysed: 22, winsPerEntity: { 'MediSupply SA (Pty) Ltd': 7, 'HealthPro Distributors': 6, 'ClinicalEdge CC': 5, 'MedEquip Solutions': 4 }, patternConfidence: 94.7, lastWinDate: '2024-10-20', dormancyMonths: 0, reEntryDetected: false, riskLevel: 'CRITICAL' },
  { id: 'RP003', entities: ['Zenith Civils (Pty) Ltd', 'Apex Road Works CC'], windowMonths: 60, tendersAnalysed: 14, winsPerEntity: { 'Zenith Civils (Pty) Ltd': 4, 'Apex Road Works CC': 3 }, patternConfidence: 71.2, lastWinDate: '2022-11-01', dormancyMonths: 24, reEntryDetected: true, reEntryDetail: 'Both entities dormant for 24 months — now re-entering Mpumalanga infrastructure tenders. Classic long-cycle reset strategy to clear pattern detection window.', riskLevel: 'HIGH' },
];

export const mockOperationalExclusivity: OperationalExclusivityFlag[] = [
  { id: 'OE001', tenderRef: 'GT/DPW/2024/001', flagType: 'ISO_CERT', description: 'Spec requires ISO 9001:2015 certification specifically for "road rehabilitation in dolomitic zones" — a sub-category held by only 1 registered SA contractor.', marketImpact: 'Effectively excludes all but 1 supplier. 47 qualified road contractors cannot bid.', suppliersExcluded: 47, suppliersCapable: 1, confidence: 96.2, severity: 'CRITICAL', status: 'OPEN' },
  { id: 'OE002', tenderRef: 'KZN/EDUC/2024/112', flagType: 'DELIVERY_TIMELINE', description: 'Spec requires delivery of 45,000 tablets within 14 days of award. Only a vendor with pre-positioned stock could meet this — effectively pre-selecting the winner.', marketImpact: 'Standard lead time for tablet procurement is 6–8 weeks. 14-day requirement eliminates all but 1 known local distributor.', suppliersExcluded: 23, suppliersCapable: 1, confidence: 88.4, severity: 'HIGH', status: 'INVESTIGATING' },
  { id: 'OE003', tenderRef: 'LP/ROADS/2024/078', flagType: 'PROPRIETARY_SYSTEM', description: 'Spec mandates use of "RoadMaster Pro v4.2 project management software" — a proprietary system sold exclusively by one vendor who is also bidding.', marketImpact: 'Requires purchasing software from a competitor. No open-source or alternative accepted.', suppliersExcluded: 31, suppliersCapable: 1, confidence: 99.8, severity: 'CRITICAL', status: 'OPEN' },
];

export const mockReferralTracking: ReferralTracking[] = [
  { id: 'RT001', caseRef: 'SIU/2024/GT/0891', agency: 'SIU', referredAt: '2024-11-08T00:00:00Z', acknowledgedAt: '2024-11-08T14:30:00Z', lastActivityAt: '2024-11-10T09:00:00Z', daysSinceActivity: 0, status: 'ACTIVE', stalledFlag: false, escalationLevel: 1, receivingOfficer: 'Adv. M. Sithole (SIU)', receivingOfficerRiskScore: 12, independentVerification: true },
  { id: 'RT002', caseRef: 'AGSA/2024/WC/0112', agency: 'AGSA', referredAt: '2024-10-18T00:00:00Z', acknowledgedAt: '2024-10-19T10:00:00Z', lastActivityAt: '2024-10-25T10:00:00Z', daysSinceActivity: 16, status: 'STALLED', stalledFlag: true, escalationLevel: 2, receivingOfficer: 'B. Khumalo (AGSA WC)', receivingOfficerRiskScore: 67, independentVerification: false },
  { id: 'RT003', caseRef: 'HAWKS/2024/LP/0234', agency: 'HAWKS', referredAt: '2024-11-07T00:00:00Z', daysSinceActivity: 3, status: 'PENDING_ACK', stalledFlag: false, escalationLevel: 1, receivingOfficer: 'Unassigned', receivingOfficerRiskScore: 0, independentVerification: false },
  { id: 'RT004', caseRef: 'SIU/2024/NW/0445', agency: 'SIU', referredAt: '2024-08-20T00:00:00Z', acknowledgedAt: '2024-08-21T08:00:00Z', lastActivityAt: '2024-11-01T09:00:00Z', daysSinceActivity: 9, status: 'ACTIVE', stalledFlag: false, escalationLevel: 1, receivingOfficer: 'Adv. T. Nkosi (SIU NW)', receivingOfficerRiskScore: 8, independentVerification: true },
];

export const mockGPSVerifications: GPSVerification[] = [
  { contractRef: 'EC/WATER/2024/033', project: 'Eastern Cape Rural Water Reticulation', submittedCoords: '-32.2968, 26.4194', submittedTimestamp: '2024-11-01T10:14:33Z', photoHash: 'sha256:a1b2c3d4e5f6789abc', deviceId: 'SITE-INSP-EC-007', satelliteImageMatch: true, timestampAuthentic: true, locationConsistent: true, previousVisitCoords: '-32.2971, 26.4190', distanceFromPrevious: 42, spoofingRisk: 'LOW', spoofingFlags: [], verificationStatus: 'VERIFIED' },
  { contractRef: 'NW/HOUSING/2024/021', project: 'North West RDP Housing – 500 Units', submittedCoords: '-26.7145, 25.9812', submittedTimestamp: '2024-09-15T08:00:00Z', photoHash: 'sha256:f9e8d7c6b5a4321fed', deviceId: 'SITE-INSP-NW-003', satelliteImageMatch: false, timestampAuthentic: false, locationConsistent: false, previousVisitCoords: '-26.7145, 25.9812', distanceFromPrevious: 0, spoofingRisk: 'CRITICAL', spoofingFlags: ['Photo timestamp metadata shows image captured 6 days before claimed visit date', 'Satellite imagery from same date shows no construction activity at submitted coordinates', 'GPS coordinates identical to previous visit — device likely stationary or coordinates copied', 'Photo EXIF data shows image taken at different location (Johannesburg CBD)'], verificationStatus: 'SPOOFED' },
];

export const mockScoreGamingAlerts: ScoreGamingAlert[] = [
  { id: 'SG001', tenderRef: 'GT/DPW/2024/001', vendorName: 'Apex Construction Holdings', detectedPattern: 'Threshold Boundary Pricing', detail: 'All 4 BoQ line items priced at exactly 180–220% above benchmark — consistently just below the 500% auto-block threshold. Statistical probability of this occurring naturally: 0.003%. Indicates knowledge of detection thresholds.', confidence: 97.1, severity: 'HIGH' },
  { id: 'SG002', tenderRef: 'WC/HEALTH/2024/047', vendorName: 'MediSupply SA (Pty) Ltd', detectedPattern: 'Bidder Count Manipulation', detail: 'Exactly 4 bids submitted — the minimum to avoid the "single bidder" flag (threshold: <3). Three of the four bids share document metadata. Appears to be 1 real bid and 3 cover bids to meet the minimum competition threshold.', confidence: 91.4, severity: 'HIGH' },
  { id: 'SG003', tenderRef: 'KZN/EDUC/2024/112', vendorName: 'TechEd Solutions Africa', detectedPattern: 'Integrity Score Boundary Targeting', detail: 'Bid structured to score exactly 46/100 on integrity — just above the 45/100 automatic suspension threshold. Multiple parameters appear calibrated to this boundary.', confidence: 78.3, severity: 'MEDIUM' },
];

export const mockBBBEEVerifications: BBBEEVerification[] = [
  { vendorId: 'V001', vendorName: 'Apex Construction Holdings', certNumber: 'BBBEE-2024-LIM-04521', issuingAgency: 'Pinnacle Verification Agency', issuedDate: '2024-01-15', expiryDate: '2025-01-14', claimedLevel: 1, commissionVerifiedLevel: null, agencyAccredited: false, commissionDatabaseMatch: false, fraudIndicators: ['Issuing agency "Pinnacle Verification Agency" not accredited by B-BBEE Commission', 'Certificate number not found in B-BBEE Commission national database', 'Agency registered 3 months before issuing this certificate'], verificationStatus: 'AGENCY_UNACCREDITED' },
  { vendorId: 'V006', vendorName: 'BuildRight NW Consortium', certNumber: 'BBBEE-2023-NW-11234', issuingAgency: 'SA Empowerment Ratings CC', issuedDate: '2023-06-01', expiryDate: '2024-05-31', claimedLevel: 1, commissionVerifiedLevel: 4, agencyAccredited: true, commissionDatabaseMatch: true, fraudIndicators: ['Commission database shows Level 4 — vendor claiming Level 1', 'Certificate appears to have been altered after issuance', 'Certificate expired May 2024 — vendor still using it'], verificationStatus: 'MISMATCH' },
  { vendorId: 'V004', vendorName: 'Ubuntu Water Engineering', certNumber: 'BBBEE-2024-EC-07823', issuingAgency: 'Verified SA Ratings (Pty) Ltd', issuedDate: '2024-03-01', expiryDate: '2025-02-28', claimedLevel: 2, commissionVerifiedLevel: 2, agencyAccredited: true, commissionDatabaseMatch: true, fraudIndicators: [], verificationStatus: 'VERIFIED' },
  { vendorId: 'V005', vendorName: 'Khanya Renewable Energy', certNumber: 'BBBEE-2024-NC-03341', issuingAgency: 'National Empowerment Ratings', issuedDate: '2024-02-15', expiryDate: '2025-02-14', claimedLevel: 1, commissionVerifiedLevel: 1, agencyAccredited: true, commissionDatabaseMatch: true, fraudIndicators: [], verificationStatus: 'VERIFIED' },
];

export const mockJVScreenings: JVScreening[] = [
  { id: 'JV001', tenderRef: 'GT/DPW/2024/001', jvName: 'Apex-Pinnacle Infrastructure JV', registeredDate: '2024-10-01', aggregateRisk: 'CRITICAL', cleanVehicleDetected: true, cleanVehicleDetail: 'JV formed 6 weeks before bid submission. Clean member (Pinnacle Civil Works) has no prior flags but shares a director with Apex Construction Holdings. Classic clean-vehicle strategy: use a flagged entity\'s connections while presenting a new, unflagged JV entity.', status: 'FLAGGED', members: [
    { name: 'Apex Construction Holdings (Pty) Ltd', cipcNumber: '2018/445231/07', participationPercent: 51, riskLevel: 'CRITICAL', flags: ['PEP Link', 'Shell Company', 'Fronting'], ownershipGraphRun: true, pepLinked: true, officialLinked: true, previousFlags: 5 },
    { name: 'Pinnacle Civil Works (Pty) Ltd', cipcNumber: '2024/112345/07', participationPercent: 49, riskLevel: 'HIGH', flags: ['Registered 6 weeks ago', 'Director overlap with Apex'], ownershipGraphRun: true, pepLinked: false, officialLinked: false, previousFlags: 0 },
  ]},
  { id: 'JV002', tenderRef: 'EC/WATER/2024/033', jvName: 'Ubuntu-Eastern Civil JV', registeredDate: '2023-01-15', aggregateRisk: 'LOW', cleanVehicleDetected: false, status: 'CLEARED', members: [
    { name: 'Ubuntu Water Engineering', cipcNumber: '2010/089234/07', participationPercent: 60, riskLevel: 'LOW', flags: [], ownershipGraphRun: true, pepLinked: false, officialLinked: false, previousFlags: 0 },
    { name: 'Eastern Civil Contractors CC', cipcNumber: '2014/234567/23', participationPercent: 40, riskLevel: 'LOW', flags: [], ownershipGraphRun: true, pepLinked: false, officialLinked: false, previousFlags: 0 },
  ]},
];

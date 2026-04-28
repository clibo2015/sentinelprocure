// ─── Types ───────────────────────────────────────────────────────────────────

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TenderStatus = 'FLAGGED' | 'UNDER_REVIEW' | 'CLEARED' | 'SUSPENDED' | 'AWARDED';
export type AgentStatus = 'ACTIVE' | 'IDLE' | 'INTERVENING';

export interface Tender {
  id: string;
  reference: string;
  title: string;
  department: string;
  value: number;
  status: TenderStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  flags: string[];
  submittedDate: string;
  closingDate: string;
  province: string;
  category: string;
  biddersCount: number;
  integrityScore: number;
}

export interface RedFlag {
  id: string;
  tenderId: string;
  tenderRef: string;
  type: string;
  severity: RiskLevel;
  description: string;
  detectedAt: string;
  agentName: string;
  evidence: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';
}

export interface Vendor {
  id: string;
  name: string;
  cipcNumber: string;
  csdNumber: string;
  reputationScore: number;
  riskLevel: RiskLevel;
  activeContracts: number;
  totalContractValue: number;
  flags: string[];
  bbbeeLevel: number;
  province: string;
  sector: string;
  legalStatus: 'COMPLIANT' | 'UNDER_INVESTIGATION' | 'BLACKLISTED' | 'SUSPENDED';
  taxCompliant: boolean;
  pastPerformance: number;
}

export interface AgentActivity {
  id: string;
  agentName: string;
  agentType: 'WATCHDOG' | 'GUARDIAN' | 'COMPLIANCE';
  action: string;
  target: string;
  timestamp: string;
  outcome: string;
  status: AgentStatus;
}

export interface WhistleblowerTip {
  id: string;
  category: string;
  severity: RiskLevel;
  summary: string;
  receivedAt: string;
  nlpConfidence: number;
  status: 'TRIAGED' | 'INVESTIGATING' | 'ESCALATED' | 'CLOSED';
  relatedTender?: string;
}

export interface ContractMilestone {
  id: string;
  contractRef: string;
  project: string;
  department: string;
  totalValue: number;
  paidToDate: number;
  completionPercent: number;
  expectedCompletion: string;
  gpsVerified: boolean;
  lastSiteVisit: string;
  riskLevel: RiskLevel;
  milestones: { name: string; due: string; status: 'COMPLETE' | 'OVERDUE' | 'PENDING' }[];
}

// ─── Mock Tenders ─────────────────────────────────────────────────────────────

export const mockTenders: Tender[] = [
  {
    id: 'T001',
    reference: 'GT/DPW/2024/001',
    title: 'Gauteng Road Infrastructure Rehabilitation Phase 3',
    department: 'Dept. of Public Works – Gauteng',
    value: 487_000_000,
    status: 'FLAGGED',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    flags: ['Spec Rigging', 'Single Bidder', 'Inflated Pricing'],
    submittedDate: '2024-11-01',
    closingDate: '2024-12-15',
    province: 'Gauteng',
    category: 'Infrastructure',
    biddersCount: 1,
    integrityScore: 12,
  },
  {
    id: 'T002',
    reference: 'WC/HEALTH/2024/047',
    title: 'Western Cape Hospital PPE & Medical Supplies',
    department: 'Dept. of Health – Western Cape',
    value: 124_500_000,
    status: 'UNDER_REVIEW',
    riskScore: 74,
    riskLevel: 'HIGH',
    flags: ['Collusive Bidding', 'Rotating Winner Pattern'],
    submittedDate: '2024-10-15',
    closingDate: '2024-11-30',
    province: 'Western Cape',
    category: 'Health Supplies',
    biddersCount: 4,
    integrityScore: 38,
  },
  {
    id: 'T003',
    reference: 'KZN/EDUC/2024/112',
    title: 'KwaZulu-Natal School Tablet & ICT Infrastructure',
    department: 'Dept. of Education – KZN',
    value: 89_200_000,
    status: 'UNDER_REVIEW',
    riskScore: 68,
    riskLevel: 'HIGH',
    flags: ['Ghost Vendor', 'CIPC Mismatch'],
    submittedDate: '2024-10-20',
    closingDate: '2024-12-01',
    province: 'KwaZulu-Natal',
    category: 'ICT',
    biddersCount: 6,
    integrityScore: 45,
  },
  {
    id: 'T004',
    reference: 'EC/WATER/2024/033',
    title: 'Eastern Cape Rural Water Reticulation',
    department: 'Dept. of Water & Sanitation – EC',
    value: 312_000_000,
    status: 'CLEARED',
    riskScore: 22,
    riskLevel: 'LOW',
    flags: [],
    submittedDate: '2024-09-01',
    closingDate: '2024-10-15',
    province: 'Eastern Cape',
    category: 'Water & Sanitation',
    biddersCount: 11,
    integrityScore: 87,
  },
  {
    id: 'T005',
    reference: 'LP/ROADS/2024/078',
    title: 'Limpopo N1 Highway Maintenance Contract',
    department: 'SANRAL – Limpopo Region',
    value: 203_000_000,
    status: 'FLAGGED',
    riskScore: 83,
    riskLevel: 'CRITICAL',
    flags: ['Beneficial Ownership Hidden', 'Fronting Suspected', 'Inflated Pricing'],
    submittedDate: '2024-11-05',
    closingDate: '2024-12-20',
    province: 'Limpopo',
    category: 'Infrastructure',
    biddersCount: 3,
    integrityScore: 19,
  },
  {
    id: 'T006',
    reference: 'NW/HOUSING/2024/021',
    title: 'North West RDP Housing Development – 500 Units',
    department: 'Dept. of Human Settlements – NW',
    value: 156_000_000,
    status: 'SUSPENDED',
    riskScore: 95,
    riskLevel: 'CRITICAL',
    flags: ['Spec Rigging', 'Ghost Vendor', 'Collusive Bidding', 'Inflated Pricing'],
    submittedDate: '2024-08-15',
    closingDate: '2024-09-30',
    province: 'North West',
    category: 'Housing',
    biddersCount: 2,
    integrityScore: 5,
  },
  {
    id: 'T007',
    reference: 'FS/AGRI/2024/055',
    title: 'Free State Agricultural Equipment Supply',
    department: 'Dept. of Agriculture – Free State',
    value: 45_800_000,
    status: 'AWARDED',
    riskScore: 31,
    riskLevel: 'MEDIUM',
    flags: ['Minor Pricing Deviation'],
    submittedDate: '2024-07-01',
    closingDate: '2024-08-15',
    province: 'Free State',
    category: 'Agriculture',
    biddersCount: 8,
    integrityScore: 72,
  },
  {
    id: 'T008',
    reference: 'NC/ENERGY/2024/009',
    title: 'Northern Cape Solar Farm Grid Connection',
    department: 'Dept. of Energy – Northern Cape',
    value: 678_000_000,
    status: 'CLEARED',
    riskScore: 18,
    riskLevel: 'LOW',
    flags: [],
    submittedDate: '2024-06-01',
    closingDate: '2024-07-30',
    province: 'Northern Cape',
    category: 'Energy',
    biddersCount: 14,
    integrityScore: 93,
  },
];

// ─── Mock Red Flags ───────────────────────────────────────────────────────────

export const mockRedFlags: RedFlag[] = [
  {
    id: 'RF001',
    tenderId: 'T001',
    tenderRef: 'GT/DPW/2024/001',
    type: 'Specification Rigging',
    severity: 'CRITICAL',
    description: 'Tender specifications contain 14 clauses that match exactly one known vendor\'s proprietary product catalogue. NLP confidence: 97.3%.',
    detectedAt: '2024-11-02T08:14:22Z',
    agentName: 'NLP-Spec-Auditor-v2',
    evidence: 'Clauses 4.2, 7.1, 9.3–9.8, 11.2, 12.1, 14.5 contain brand-specific technical requirements.',
    status: 'OPEN',
  },
  {
    id: 'RF002',
    tenderId: 'T001',
    tenderRef: 'GT/DPW/2024/001',
    type: 'Inflated Pricing',
    severity: 'CRITICAL',
    description: 'Bid price is 312% above market benchmark for equivalent road rehabilitation work. Comparable projects in 2023 averaged R8.2M/km vs R25.6M/km quoted.',
    detectedAt: '2024-11-02T09:30:11Z',
    agentName: 'Market-Intelligence-Engine',
    evidence: 'Cross-referenced 47 comparable tenders from 2021–2024. Statistical outlier at 3.8σ above mean.',
    status: 'INVESTIGATING',
  },
  {
    id: 'RF003',
    tenderId: 'T002',
    tenderRef: 'WC/HEALTH/2024/047',
    type: 'Collusive Bidding',
    severity: 'HIGH',
    description: 'Four bidding entities share identical bid structures, pricing formulas, and document metadata. Two share a registered address.',
    detectedAt: '2024-10-16T14:22:05Z',
    agentName: 'Collusion-Detection-Agent',
    evidence: 'Document fingerprint analysis shows 89% similarity. Metadata timestamps within 4-minute window.',
    status: 'INVESTIGATING',
  },
  {
    id: 'RF004',
    tenderId: 'T003',
    tenderRef: 'KZN/EDUC/2024/112',
    type: 'Ghost Vendor',
    severity: 'HIGH',
    description: 'Winning bidder CSD registration active but CIPC shows company deregistered in 2022. No tax clearance on record with SARS.',
    detectedAt: '2024-10-21T11:05:44Z',
    agentName: 'Entity-Resolution-Engine',
    evidence: 'CIPC deregistration date: 14 March 2022. CSD record not updated. SARS TCC expired 2021.',
    status: 'OPEN',
  },
  {
    id: 'RF005',
    tenderId: 'T005',
    tenderRef: 'LP/ROADS/2024/078',
    type: 'Fronting',
    severity: 'CRITICAL',
    description: 'Graph analysis reveals that the B-BBEE Level 1 entity is a shell company. Ultimate beneficial owner is a politically exposed person (PEP) with prior SIU referrals.',
    detectedAt: '2024-11-06T07:45:00Z',
    agentName: 'Entity-Resolution-Engine',
    evidence: 'Ownership graph: 3 layers deep. Director cross-references 7 other flagged entities. PEP database match: 94.1%.',
    status: 'OPEN',
  },
  {
    id: 'RF006',
    tenderId: 'T006',
    tenderRef: 'NW/HOUSING/2024/021',
    type: 'Rotating Winner Pattern',
    severity: 'CRITICAL',
    description: 'Same consortium of 2 vendors has won 11 of 14 housing tenders in North West over 36 months, alternating wins to avoid detection thresholds.',
    detectedAt: '2024-08-16T10:00:00Z',
    agentName: 'Collusion-Detection-Agent',
    evidence: 'Pattern analysis across 14 tenders, 3 departments, 36-month window. Win-rate anomaly: p < 0.001.',
    status: 'ESCALATED',
  },
];

// ─── Mock Vendors ─────────────────────────────────────────────────────────────

// ─── ID Alignment Map ─────────────────────────────────────────────────────────
// Vendor IDs, CIPC numbers, and CSD numbers are now aligned with the high-fidelity
// mock data in mockData_cipc.ts, mockData_sars.ts, mockData_csd.ts, mockData_bbbee.ts
// and mockData_etender.ts so that cross-page dossier lookups work end-to-end.
//
// Alignment table:
//  V001 Apex Construction Holdings  → CIPC 2015/123456/07  CSD MAAA0000002  (CorruptCo network)
//  V002 MediSupply SA               → CIPC 2019/112233/07  CSD MAAA0000004  (Meridian Holdings)
//  V003 TechEd Solutions Africa     → CIPC 2018/987654/07  CSD MAAA0000003  (Inflated Goods / ghost)
//  V004 Ubuntu Water Engineering    → CIPC 2020/789012/07  CSD MAAA0000001  (HonestSupplies)
//  V005 Khanya Renewable Energy     → CIPC 2020/789012/07  CSD MAAA0000001  (HonestSupplies — clean)
//  V006 BuildRight NW Consortium    → CIPC 2015/123456/07  CSD MAAA0000002  (CorruptCo network)

export const mockVendors: Vendor[] = [
  {
    id: 'V001',
    name: 'Apex Construction Holdings (Pty) Ltd',
    // Aligned: CorruptCo (Pty) Ltd network — John Doe director
    cipcNumber: '2015/123456/07',
    csdNumber: 'MAAA0000002',
    reputationScore: 14,
    riskLevel: 'CRITICAL',
    activeContracts: 3,
    totalContractValue: 890_000_000,
    flags: ['PEP Link', 'Shell Company', 'Fronting'],
    bbbeeLevel: 1,
    province: 'Limpopo',
    sector: 'Construction',
    legalStatus: 'UNDER_INVESTIGATION',
    taxCompliant: false,
    pastPerformance: 22,
  },
  {
    id: 'V002',
    name: 'MediSupply SA (Pty) Ltd',
    // Aligned: Meridian Procurement Holdings — Jane Doe director, same network
    cipcNumber: '2019/112233/07',
    csdNumber: 'MAAA0000004',
    reputationScore: 38,
    riskLevel: 'HIGH',
    activeContracts: 5,
    totalContractValue: 245_000_000,
    flags: ['Collusive Bidding', 'Rotating Winner'],
    bbbeeLevel: 2,
    province: 'Western Cape',
    sector: 'Health Supplies',
    legalStatus: 'UNDER_INVESTIGATION',
    taxCompliant: true,
    pastPerformance: 61,
  },
  {
    id: 'V003',
    name: 'TechEd Solutions Africa',
    // Aligned: Inflated Goods (Pty) Ltd — ghost vendor, SARS non-compliant
    cipcNumber: '2018/987654/07',
    csdNumber: 'MAAA0000003',
    reputationScore: 22,
    riskLevel: 'HIGH',
    activeContracts: 1,
    totalContractValue: 89_200_000,
    flags: ['Ghost Vendor', 'CIPC Deregistered'],
    bbbeeLevel: 1,
    province: 'KwaZulu-Natal',
    sector: 'ICT',
    legalStatus: 'SUSPENDED',
    taxCompliant: false,
    pastPerformance: 0,
  },
  {
    id: 'V004',
    name: 'Ubuntu Water Engineering',
    // Aligned: HonestSupplies (Pty) Ltd — fully compliant, legitimate
    cipcNumber: '2020/789012/07',
    csdNumber: 'MAAA0000001',
    reputationScore: 87,
    riskLevel: 'LOW',
    activeContracts: 4,
    totalContractValue: 312_000_000,
    flags: [],
    bbbeeLevel: 2,
    province: 'Eastern Cape',
    sector: 'Water & Sanitation',
    legalStatus: 'COMPLIANT',
    taxCompliant: true,
    pastPerformance: 91,
  },
  {
    id: 'V005',
    name: 'Khanya Renewable Energy (Pty) Ltd',
    // Aligned: HonestSupplies network — clean supplier, separate trading entity
    cipcNumber: '2020/789012/07',
    csdNumber: 'MAAA0000001',
    reputationScore: 93,
    riskLevel: 'LOW',
    activeContracts: 2,
    totalContractValue: 678_000_000,
    flags: [],
    bbbeeLevel: 1,
    province: 'Northern Cape',
    sector: 'Energy',
    legalStatus: 'COMPLIANT',
    taxCompliant: true,
    pastPerformance: 96,
  },
  {
    id: 'V006',
    name: 'BuildRight NW Consortium',
    // Aligned: CorruptCo (Pty) Ltd network — same John Doe shell structure
    cipcNumber: '2015/123456/07',
    csdNumber: 'MAAA0000002',
    reputationScore: 8,
    riskLevel: 'CRITICAL',
    activeContracts: 2,
    totalContractValue: 156_000_000,
    flags: ['Spec Rigging', 'Collusive Bidding', 'Rotating Winner', 'Inflated Pricing'],
    bbbeeLevel: 1,
    province: 'North West',
    sector: 'Housing',
    legalStatus: 'BLACKLISTED',
    taxCompliant: false,
    pastPerformance: 18,
  },
];

// ─── Mock Agent Activity ──────────────────────────────────────────────────────

export const mockAgentActivity: AgentActivity[] = [
  {
    id: 'A001',
    agentName: 'NLP-Spec-Auditor-v2',
    agentType: 'WATCHDOG',
    action: 'Specification scan completed',
    target: 'GT/DPW/2024/001',
    timestamp: '2024-11-02T08:14:22Z',
    outcome: 'CRITICAL flag raised – 14 biased clauses detected',
    status: 'ACTIVE',
  },
  {
    id: 'A002',
    agentName: 'Entity-Resolution-Engine',
    agentType: 'WATCHDOG',
    action: 'Beneficial ownership graph traversal',
    target: 'LP/ROADS/2024/078',
    timestamp: '2024-11-06T07:45:00Z',
    outcome: 'PEP link confirmed – 3-layer shell structure exposed',
    status: 'ACTIVE',
  },
  {
    id: 'A003',
    agentName: 'Collusion-Detection-Agent',
    agentType: 'GUARDIAN',
    action: 'Bid document fingerprint analysis',
    target: 'WC/HEALTH/2024/047',
    timestamp: '2024-10-16T14:22:05Z',
    outcome: 'Collusion pattern detected – 4 entities flagged',
    status: 'INTERVENING',
  },
  {
    id: 'A004',
    agentName: 'Market-Intelligence-Engine',
    agentType: 'WATCHDOG',
    action: 'Price benchmark comparison',
    target: 'GT/DPW/2024/001',
    timestamp: '2024-11-02T09:30:11Z',
    outcome: 'Price 312% above benchmark – justification requested',
    status: 'ACTIVE',
  },
  {
    id: 'A005',
    agentName: 'Compliance-as-Code-Engine',
    agentType: 'COMPLIANCE',
    action: 'B-BBEE & PPPFA validation',
    target: 'EC/WATER/2024/033',
    timestamp: '2024-10-16T10:00:00Z',
    outcome: 'All compliance rules satisfied – tender cleared',
    status: 'IDLE',
  },
  {
    id: 'A006',
    agentName: 'Autonomous-Mitigation-Agent',
    agentType: 'GUARDIAN',
    action: 'Deviation justification request issued',
    target: 'GT/DPW/2024/001',
    timestamp: '2024-11-02T10:00:00Z',
    outcome: 'Awaiting response from Dept. of Public Works – Gauteng',
    status: 'INTERVENING',
  },
  {
    id: 'A007',
    agentName: 'Whistleblower-Triage-NLP',
    agentType: 'WATCHDOG',
    action: 'Anonymous tip categorised and routed',
    target: 'TIP-2024-0891',
    timestamp: '2024-11-07T06:30:00Z',
    outcome: 'HIGH severity – routed to SIU and risk engine',
    status: 'ACTIVE',
  },
];

// ─── Mock Whistleblower Tips ──────────────────────────────────────────────────

export const mockWhistleblowerTips: WhistleblowerTip[] = [
  {
    id: 'TIP-2024-0891',
    category: 'Specification Rigging',
    severity: 'HIGH',
    summary: 'Tipster alleges that a senior official in Gauteng DPW personally drafted specifications to match a preferred vendor. Names provided.',
    receivedAt: '2024-11-07T06:28:00Z',
    nlpConfidence: 91.4,
    status: 'INVESTIGATING',
    relatedTender: 'GT/DPW/2024/001',
  },
  {
    id: 'TIP-2024-0887',
    category: 'Ghost Vendor',
    severity: 'CRITICAL',
    summary: 'Company receiving payments has no physical address, no employees, and directors are deceased. Bank account opened 2 weeks before award.',
    receivedAt: '2024-11-05T14:10:00Z',
    nlpConfidence: 96.7,
    status: 'ESCALATED',
    relatedTender: 'KZN/EDUC/2024/112',
  },
  {
    id: 'TIP-2024-0879',
    category: 'Bribery',
    severity: 'CRITICAL',
    summary: 'Cash payments allegedly made to evaluation committee members prior to scoring. Amounts and dates provided by tipster.',
    receivedAt: '2024-11-03T09:45:00Z',
    nlpConfidence: 88.2,
    status: 'ESCALATED',
  },
  {
    id: 'TIP-2024-0865',
    category: 'Fronting',
    severity: 'HIGH',
    summary: 'B-BBEE Level 1 company used as front. White-owned parent company controls all operations and finances.',
    receivedAt: '2024-10-28T11:20:00Z',
    nlpConfidence: 84.5,
    status: 'INVESTIGATING',
    relatedTender: 'LP/ROADS/2024/078',
  },
  {
    id: 'TIP-2024-0841',
    category: 'Inflated Pricing',
    severity: 'MEDIUM',
    summary: 'Supplier invoicing for goods not delivered. Delivery notes forged. Warehouse manager willing to testify.',
    receivedAt: '2024-10-15T08:00:00Z',
    nlpConfidence: 79.3,
    status: 'TRIAGED',
  },
];

// ─── Mock Contract Milestones ─────────────────────────────────────────────────

export const mockContracts: ContractMilestone[] = [
  {
    id: 'C001',
    contractRef: 'EC/WATER/2024/033',
    project: 'Eastern Cape Rural Water Reticulation',
    department: 'Dept. of Water & Sanitation',
    totalValue: 312_000_000,
    paidToDate: 78_000_000,
    completionPercent: 24,
    expectedCompletion: '2025-12-31',
    gpsVerified: true,
    lastSiteVisit: '2024-11-01',
    riskLevel: 'LOW',
    milestones: [
      { name: 'Site Establishment', due: '2024-08-01', status: 'COMPLETE' },
      { name: 'Pipeline Phase 1', due: '2024-11-01', status: 'COMPLETE' },
      { name: 'Pipeline Phase 2', due: '2025-03-01', status: 'PENDING' },
      { name: 'Reservoir Construction', due: '2025-08-01', status: 'PENDING' },
    ],
  },
  {
    id: 'C002',
    contractRef: 'NC/ENERGY/2024/009',
    project: 'Northern Cape Solar Farm Grid Connection',
    department: 'Dept. of Energy',
    totalValue: 678_000_000,
    paidToDate: 135_600_000,
    completionPercent: 20,
    expectedCompletion: '2026-06-30',
    gpsVerified: true,
    lastSiteVisit: '2024-10-28',
    riskLevel: 'LOW',
    milestones: [
      { name: 'Environmental Clearance', due: '2024-07-01', status: 'COMPLETE' },
      { name: 'Foundation Works', due: '2024-10-01', status: 'COMPLETE' },
      { name: 'Panel Installation Phase 1', due: '2025-04-01', status: 'PENDING' },
      { name: 'Grid Connection', due: '2026-01-01', status: 'PENDING' },
    ],
  },
  {
    id: 'C003',
    contractRef: 'NW/HOUSING/2024/021',
    project: 'North West RDP Housing – 500 Units',
    department: 'Dept. of Human Settlements',
    totalValue: 156_000_000,
    paidToDate: 93_600_000,
    completionPercent: 12,
    expectedCompletion: '2025-06-30',
    gpsVerified: false,
    lastSiteVisit: '2024-09-15',
    riskLevel: 'CRITICAL',
    milestones: [
      { name: 'Site Clearing', due: '2024-09-01', status: 'COMPLETE' },
      { name: 'Foundation – 500 Units', due: '2024-10-01', status: 'OVERDUE' },
      { name: 'Superstructure', due: '2025-02-01', status: 'PENDING' },
      { name: 'Completion & Handover', due: '2025-06-30', status: 'PENDING' },
    ],
  },
];

// ─── Chart Data ───────────────────────────────────────────────────────────────

export const riskTrendData = [
  { month: 'Jun', critical: 3, high: 7, medium: 12, low: 28 },
  { month: 'Jul', critical: 4, high: 9, medium: 10, low: 31 },
  { month: 'Aug', critical: 6, high: 11, medium: 14, low: 27 },
  { month: 'Sep', critical: 5, high: 8, medium: 16, low: 33 },
  { month: 'Oct', critical: 8, high: 13, medium: 11, low: 29 },
  { month: 'Nov', critical: 7, high: 12, medium: 15, low: 35 },
];

export const savingsData = [
  { month: 'Jun', prevented: 45, recovered: 12 },
  { month: 'Jul', prevented: 67, recovered: 18 },
  { month: 'Aug', prevented: 123, recovered: 34 },
  { month: 'Sep', prevented: 89, recovered: 22 },
  { month: 'Oct', prevented: 156, recovered: 41 },
  { month: 'Nov', prevented: 203, recovered: 67 },
];

export const categoryBreakdown = [
  { name: 'Infrastructure', value: 38, fill: '#ef4444' },
  { name: 'Health Supplies', value: 22, fill: '#f97316' },
  { name: 'ICT', value: 18, fill: '#eab308' },
  { name: 'Housing', value: 14, fill: '#8b5cf6' },
  { name: 'Energy', value: 5, fill: '#22c55e' },
  { name: 'Other', value: 3, fill: '#64748b' },
];

export const provinceRiskData = [
  { province: 'City of Cape Town', score: 42 },
  { province: 'Cape Winelands', score: 31 },
  { province: 'Garden Route', score: 28 },
  { province: 'West Coast', score: 19 },
  { province: 'Overberg', score: 14 },
  { province: 'Central Karoo', score: 11 },
];

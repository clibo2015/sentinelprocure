// Extended data file

// ─── Price Benchmarking Types ─────────────────────────────────────────────────

export interface PriceAlert {
  id: string;
  tenderId: string;
  tenderRef: string;
  itemDescription: string;
  quotedPrice: number;
  retailPrice: number;
  govBenchmark: number;
  internationalBenchmark: number;
  markupPercent: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'BLOCKED' | 'FLAGGED' | 'UNDER_REVIEW' | 'CLEARED';
  detectedAt: string;
  realWorldExample?: string;
}

export interface OwnershipNode {
  id: string;
  label: string;
  type: 'COMPANY' | 'PERSON' | 'PEP' | 'OFFICIAL' | 'SHELL';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details: string;
  flagged: boolean;
}

export interface OwnershipEdge {
  from: string;
  to: string;
  label: string;
  suspicious: boolean;
}

export interface OwnershipGraph {
  vendorId: string;
  vendorName: string;
  nodes: OwnershipNode[];
  edges: OwnershipEdge[];
  pepLinked: boolean;
  officialLinked: boolean;
  shellLayers: number;
  riskSummary: string;
}

export interface BidSubmission {
  id: string;
  tenderRef: string;
  tenderTitle: string;
  vendorName: string;
  vendorCSD: string;
  submittedAt: string;
  totalBidValue: number;
  aiValidationScore: number;
  validationFlags: string[];
  status: 'SUBMITTED' | 'AI_REVIEW' | 'PASSED' | 'REJECTED' | 'ESCALATED';
  evaluationStage: 'ADMIN_COMPLIANCE' | 'FUNCTIONALITY' | 'PRICE_EVALUATION' | 'BBBEE' | 'AWARD_RECOMMENDATION' | 'COMPLETE';
  boqItems: { description: string; qty: number; unitPrice: number; benchmarkPrice: number; flagged: boolean }[];
}

export interface EnforcementCase {
  id: string;
  caseRef: string;
  title: string;
  agency: 'SIU' | 'HAWKS' | 'NPA' | 'AGSA' | 'NT';
  status: 'REFERRED' | 'ACTIVE' | 'PROSECUTION' | 'CONVICTION' | 'CLOSED';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  estimatedLoss: number;
  referredAt: string;
  lastUpdate: string;
  linkedTenders: string[];
  linkedVendors: string[];
  evidencePackages: number;
  summary: string;
}

export interface EvidencePackage {
  id: string;
  caseRef: string;
  compiledAt: string;
  items: { type: string; description: string; hash: string }[];
  status: 'COMPILING' | 'READY' | 'SUBMITTED';
  legalAdmissible: boolean;
}

export interface ExecutiveMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  detail: string;
}

// ─── Price Alerts (Eskom/PPE-inspired real cases) ────────────────────────────

export const mockPriceAlerts: PriceAlert[] = [
  {
    id: 'PA001',
    tenderId: 'T001',
    tenderRef: 'GT/DPW/2024/001',
    itemDescription: 'Welding Knee Guards (PPE) — per pair',
    quotedPrice: 80_000,
    retailPrice: 320,
    govBenchmark: 450,
    internationalBenchmark: 380,
    markupPercent: 24900,
    severity: 'CRITICAL',
    status: 'BLOCKED',
    detectedAt: '2024-11-02T09:30:00Z',
    realWorldExample: 'Mirrors the Eskom case documented by CEO André de Ruyter: R80,000 charged per pair of knee guards retailing at R320 at Builders Warehouse.',
  },
  {
    id: 'PA002',
    tenderId: 'T002',
    tenderRef: 'WC/HEALTH/2024/047',
    itemDescription: 'Surgical N95 Masks — per box of 50',
    quotedPrice: 8_500,
    retailPrice: 180,
    govBenchmark: 220,
    internationalBenchmark: 195,
    markupPercent: 3764,
    severity: 'CRITICAL',
    status: 'BLOCKED',
    detectedAt: '2024-10-16T14:00:00Z',
    realWorldExample: 'Consistent with PPE procurement fraud patterns from the 2020 COVID-19 state of disaster — R14.3B in contracts investigated by SIU.',
  },
  {
    id: 'PA003',
    tenderId: 'T002',
    tenderRef: 'WC/HEALTH/2024/047',
    itemDescription: 'Industrial Mop & Bucket Set',
    quotedPrice: 238_000,
    retailPrice: 450,
    govBenchmark: 600,
    internationalBenchmark: 520,
    markupPercent: 52711,
    severity: 'CRITICAL',
    status: 'BLOCKED',
    detectedAt: '2024-10-16T14:05:00Z',
    realWorldExample: 'Mirrors the Eskom case: R238,000 charged for a mop, as documented in André de Ruyter\'s book "Truth to Power".',
  },
  {
    id: 'PA004',
    tenderId: 'T001',
    tenderRef: 'GT/DPW/2024/001',
    itemDescription: 'Road Rehabilitation — per lane kilometre',
    quotedPrice: 25_600_000,
    retailPrice: 0,
    govBenchmark: 8_200_000,
    internationalBenchmark: 9_100_000,
    markupPercent: 212,
    severity: 'CRITICAL',
    status: 'FLAGGED',
    detectedAt: '2024-11-02T09:35:00Z',
  },
  {
    id: 'PA005',
    tenderId: 'T003',
    tenderRef: 'KZN/EDUC/2024/112',
    itemDescription: 'Student Tablet (10-inch Android) — per unit',
    quotedPrice: 12_800,
    retailPrice: 2_999,
    govBenchmark: 3_500,
    internationalBenchmark: 3_200,
    markupPercent: 266,
    severity: 'HIGH',
    status: 'FLAGGED',
    detectedAt: '2024-10-21T11:10:00Z',
  },
  {
    id: 'PA006',
    tenderId: 'T005',
    tenderRef: 'LP/ROADS/2024/078',
    itemDescription: 'Bitumen Emulsion — per tonne',
    quotedPrice: 48_000,
    retailPrice: 0,
    govBenchmark: 12_500,
    internationalBenchmark: 11_800,
    markupPercent: 284,
    severity: 'HIGH',
    status: 'UNDER_REVIEW',
    detectedAt: '2024-11-06T08:00:00Z',
  },
  {
    id: 'PA007',
    tenderId: 'T007',
    tenderRef: 'FS/AGRI/2024/055',
    itemDescription: 'Tractor (75kW, 4WD) — per unit',
    quotedPrice: 980_000,
    retailPrice: 0,
    govBenchmark: 820_000,
    internationalBenchmark: 790_000,
    markupPercent: 20,
    severity: 'MEDIUM',
    status: 'UNDER_REVIEW',
    detectedAt: '2024-07-05T10:00:00Z',
  },
];

// ─── Ownership Graphs ─────────────────────────────────────────────────────────

export const mockOwnershipGraphs: OwnershipGraph[] = [
  {
    // Aligned: V001 → CIPC 2015/123456/07 → CSD MAAA0000002 (CorruptCo / Inflated Goods network)
    vendorId: 'V001',
    vendorName: 'Apex Construction Holdings (Pty) Ltd',
    pepLinked: true,
    officialLinked: true,
    shellLayers: 3,
    riskSummary: 'Three-layer shell structure. Ultimate beneficial owner is a Limpopo DPW official\'s spouse. PEP match confirmed at 94.1%. Seven linked entities previously flagged by SIU.',
    nodes: [
      { id: 'n1', label: 'Apex Construction Holdings', type: 'COMPANY', riskLevel: 'CRITICAL', details: 'CIPC: 2015/123456/07 · CSD: MAAA0000002 · Registered 2015 · John Doe director', flagged: true },
      { id: 'n2', label: 'Inflated Goods (Pty) Ltd', type: 'SHELL', riskLevel: 'CRITICAL', details: 'CIPC: 2018/987654/07 · CSD: MAAA0000003 · Same address · No employees · SARS non-compliant', flagged: true },
      { id: 'n3', label: 'Meridian Procurement Holdings CC', type: 'SHELL', riskLevel: 'CRITICAL', details: 'CIPC: 2019/112233/07 · CSD: MAAA0000004 · Third entity in network · Jane Doe director', flagged: true },
      { id: 'n4', label: 'John Doe (Director)', type: 'PERSON', riskLevel: 'CRITICAL', details: 'ID: 8001015000087 · Director of 3 companies · 123 Corrupt Street, Pretoria · Beneficial owner 60%', flagged: true },
      { id: 'n5', label: 'Jane Doe (Director)', type: 'PEP', riskLevel: 'CRITICAL', details: 'ID: 7505055000089 · Spouse of DPW procurement official · Director of CorruptCo & Meridian · PEP match 94.1%', flagged: true },
      { id: 'n6', label: 'DPW Procurement Official', type: 'OFFICIAL', riskLevel: 'CRITICAL', details: 'Procurement committee member · Signed off LP/ROADS/2024/078 · Conflict of interest not declared', flagged: true },
      { id: 'n7', label: 'CorruptCo (Pty) Ltd', type: 'SHELL', riskLevel: 'CRITICAL', details: 'CIPC: 2015/123456/07 · CSD: MAAA0000003 · Suspended · No employees · FIC: 3 SARs filed', flagged: true },
    ],
    edges: [
      { from: 'n4', to: 'n1', label: 'Director & 60% owner', suspicious: true },
      { from: 'n4', to: 'n2', label: 'Director & 100% owner', suspicious: true },
      { from: 'n4', to: 'n7', label: 'Director & 60% owner', suspicious: true },
      { from: 'n5', to: 'n3', label: 'Director & 49% owner', suspicious: true },
      { from: 'n5', to: 'n6', label: 'Spouse of', suspicious: true },
      { from: 'n6', to: 'n1', label: 'Awarded tender to', suspicious: true },
      { from: 'n1', to: 'n2', label: 'Shared address / directors', suspicious: true },
      { from: 'n2', to: 'n7', label: 'Same registered address', suspicious: true },
    ],
  },
  {
    // Aligned: V002 → CIPC 2019/112233/07 → CSD MAAA0000004 (Meridian / collusive ring)
    vendorId: 'V002',
    vendorName: 'MediSupply SA (Pty) Ltd',
    pepLinked: false,
    officialLinked: false,
    shellLayers: 1,
    riskSummary: 'Collusive ring of 4 entities sharing directors and address. Rotating winner pattern across 11 health tenders. No PEP link confirmed.',
    nodes: [
      { id: 'm1', label: 'MediSupply SA (Pty) Ltd', type: 'COMPANY', riskLevel: 'HIGH', details: 'Primary bidder · WC Health tenders', flagged: true },
      { id: 'm2', label: 'HealthPro Distributors', type: 'COMPANY', riskLevel: 'HIGH', details: 'Shares director with MediSupply · Alternate winner', flagged: true },
      { id: 'm3', label: 'ClinicalEdge CC', type: 'COMPANY', riskLevel: 'HIGH', details: 'Same registered address as MediSupply', flagged: true },
      { id: 'm4', label: 'S. van der Berg (Director)', type: 'PERSON', riskLevel: 'HIGH', details: 'Director of MediSupply and HealthPro · Bid coordinator', flagged: true },
      { id: 'm5', label: 'MedEquip Solutions', type: 'COMPANY', riskLevel: 'MEDIUM', details: 'Fourth entity in rotation · Lower win rate', flagged: false },
    ],
    edges: [
      { from: 'm4', to: 'm1', label: 'Director', suspicious: false },
      { from: 'm4', to: 'm2', label: 'Director', suspicious: true },
      { from: 'm1', to: 'm3', label: 'Shared address', suspicious: true },
      { from: 'm2', to: 'm5', label: 'Rotating bids', suspicious: true },
      { from: 'm1', to: 'm2', label: 'Collusive ring', suspicious: true },
    ],
  },
];

// ─── Bid Submissions ──────────────────────────────────────────────────────────

export const mockBidSubmissions: BidSubmission[] = [
  {
    id: 'BS001',
    tenderRef: 'GT/DPW/2024/001',
    tenderTitle: 'Gauteng Road Infrastructure Rehabilitation Phase 3',
    vendorName: 'Apex Construction Holdings (Pty) Ltd',
    // Aligned: MAAA0000002 = Inflated Goods / CorruptCo network
    vendorCSD: 'MAAA0000002',
    submittedAt: '2024-11-10T09:14:00Z',
    totalBidValue: 487_000_000,
    aiValidationScore: 8,
    validationFlags: ['Price 312% above benchmark', 'Beneficial owner is PEP', 'Spec written for this vendor', 'Single bidder'],
    status: 'REJECTED',
    evaluationStage: 'ADMIN_COMPLIANCE',
    boqItems: [
      { description: 'Road rehabilitation per lane/km', qty: 19, unitPrice: 25_600_000, benchmarkPrice: 8_200_000, flagged: true },
      { description: 'Welding knee guards (PPE)', qty: 200, unitPrice: 80_000, benchmarkPrice: 450, flagged: true },
      { description: 'Site establishment lump sum', qty: 1, unitPrice: 12_000_000, benchmarkPrice: 3_500_000, flagged: true },
      { description: 'Traffic management per month', qty: 18, unitPrice: 850_000, benchmarkPrice: 180_000, flagged: true },
    ],
  },
  {
    id: 'BS002',
    tenderRef: 'WC/HEALTH/2024/047',
    tenderTitle: 'Western Cape Hospital PPE & Medical Supplies',
    vendorName: 'MediSupply SA (Pty) Ltd',
    // Aligned: MAAA0000004 = Meridian Procurement Holdings
    vendorCSD: 'MAAA0000004',
    submittedAt: '2024-10-20T11:30:00Z',
    totalBidValue: 124_500_000,
    aiValidationScore: 31,
    validationFlags: ['Collusive bidding pattern', 'Price anomalies on 3 line items'],
    status: 'ESCALATED',
    evaluationStage: 'PRICE_EVALUATION',
    boqItems: [
      { description: 'N95 Surgical Masks (box/50)', qty: 10_000, unitPrice: 8_500, benchmarkPrice: 220, flagged: true },
      { description: 'Industrial Mop & Bucket Set', qty: 400, unitPrice: 238_000, benchmarkPrice: 600, flagged: true },
      { description: 'Nitrile Gloves (box/100)', qty: 50_000, unitPrice: 420, benchmarkPrice: 180, flagged: false },
      { description: 'Surgical Gowns (per unit)', qty: 100_000, unitPrice: 85, benchmarkPrice: 45, flagged: true },
    ],
  },
  {
    id: 'BS003',
    tenderRef: 'EC/WATER/2024/033',
    tenderTitle: 'Eastern Cape Rural Water Reticulation',
    vendorName: 'Ubuntu Water Engineering',
    // Aligned: MAAA0000001 = HonestSupplies — legitimate, compliant
    vendorCSD: 'MAAA0000001',
    submittedAt: '2024-09-10T08:00:00Z',
    totalBidValue: 312_000_000,
    aiValidationScore: 91,
    validationFlags: [],
    status: 'PASSED',
    evaluationStage: 'COMPLETE',
    boqItems: [
      { description: 'HDPE Pipeline 110mm per metre', qty: 45_000, unitPrice: 380, benchmarkPrice: 350, flagged: false },
      { description: 'Reservoir construction 500kL', qty: 8, unitPrice: 4_200_000, benchmarkPrice: 4_000_000, flagged: false },
      { description: 'Pump station installation', qty: 12, unitPrice: 1_800_000, benchmarkPrice: 1_750_000, flagged: false },
    ],
  },
  {
    id: 'BS004',
    tenderRef: 'NC/ENERGY/2024/009',
    tenderTitle: 'Northern Cape Solar Farm Grid Connection',
    vendorName: 'Khanya Renewable Energy (Pty) Ltd',
    // Aligned: MAAA0000001 = HonestSupplies network — clean supplier
    vendorCSD: 'MAAA0000001',
    submittedAt: '2024-06-15T10:00:00Z',
    totalBidValue: 678_000_000,
    aiValidationScore: 94,
    validationFlags: [],
    status: 'PASSED',
    evaluationStage: 'COMPLETE',
    boqItems: [
      { description: 'Solar PV panels 550W per unit', qty: 12_000, unitPrice: 4_200, benchmarkPrice: 4_100, flagged: false },
      { description: 'Grid connection infrastructure', qty: 1, unitPrice: 45_000_000, benchmarkPrice: 43_000_000, flagged: false },
      { description: 'Inverter systems 1MW', qty: 6, unitPrice: 8_500_000, benchmarkPrice: 8_200_000, flagged: false },
    ],
  },
];

// ─── Enforcement Cases ────────────────────────────────────────────────────────

export const mockEnforcementCases: EnforcementCase[] = [
  {
    id: 'EC001',
    caseRef: 'SIU/2024/GT/0891',
    title: 'Gauteng DPW Road Rehabilitation — Spec Rigging & Price Inflation',
    agency: 'SIU',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    estimatedLoss: 487_000_000,
    referredAt: '2024-11-08T00:00:00Z',
    lastUpdate: '2024-11-10T14:00:00Z',
    linkedTenders: ['GT/DPW/2024/001'],
    linkedVendors: ['Apex Construction Holdings (Pty) Ltd'],
    evidencePackages: 3,
    summary: 'Tender specifications written to match a single vendor. Bid price 312% above benchmark. Beneficial owner linked to DPW official. Automatic evidence package compiled and submitted.',
  },
  {
    id: 'EC002',
    caseRef: 'SIU/2024/NW/0445',
    title: 'North West RDP Housing — Rotating Winner Collusion Ring',
    agency: 'SIU',
    status: 'PROSECUTION',
    severity: 'CRITICAL',
    estimatedLoss: 156_000_000,
    referredAt: '2024-08-20T00:00:00Z',
    lastUpdate: '2024-11-01T09:00:00Z',
    linkedTenders: ['NW/HOUSING/2024/021'],
    linkedVendors: ['BuildRight NW Consortium'],
    evidencePackages: 5,
    summary: 'Collusive ring of 2 vendors won 11 of 14 housing tenders over 36 months. Pattern analysis confirmed p < 0.001. Case referred to NPA for prosecution.',
  },
  {
    id: 'EC003',
    caseRef: 'HAWKS/2024/LP/0234',
    title: 'Limpopo SANRAL — Fronting & PEP Beneficial Ownership',
    agency: 'HAWKS',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    estimatedLoss: 203_000_000,
    referredAt: '2024-11-07T00:00:00Z',
    lastUpdate: '2024-11-09T11:00:00Z',
    linkedTenders: ['LP/ROADS/2024/078'],
    linkedVendors: ['Apex Construction Holdings (Pty) Ltd'],
    evidencePackages: 2,
    summary: 'Three-layer shell company structure. Ultimate beneficial owner is spouse of DPW official who approved the tender. Fronting in violation of B-BBEE Act.',
  },
  {
    id: 'EC004',
    caseRef: 'AGSA/2024/WC/0112',
    title: 'Western Cape Health PPE — Collusive Bidding & Price Fraud',
    agency: 'AGSA',
    status: 'REFERRED',
    severity: 'HIGH',
    estimatedLoss: 124_500_000,
    referredAt: '2024-10-18T00:00:00Z',
    lastUpdate: '2024-10-25T10:00:00Z',
    linkedTenders: ['WC/HEALTH/2024/047'],
    linkedVendors: ['MediSupply SA (Pty) Ltd'],
    evidencePackages: 2,
    summary: 'Four entities in collusive ring. N95 masks quoted at R8,500/box vs R220 benchmark. Mop sets at R238,000 vs R600 retail. Mirrors 2020 PPE fraud patterns.',
  },
  {
    id: 'EC005',
    caseRef: 'SIU/2024/KZN/0678',
    title: 'KZN Education ICT — Ghost Vendor & CIPC Fraud',
    agency: 'SIU',
    status: 'ACTIVE',
    severity: 'HIGH',
    estimatedLoss: 89_200_000,
    referredAt: '2024-10-22T00:00:00Z',
    lastUpdate: '2024-11-05T08:00:00Z',
    linkedTenders: ['KZN/EDUC/2024/112'],
    linkedVendors: ['TechEd Solutions Africa'],
    evidencePackages: 1,
    summary: 'Vendor deregistered from CIPC in 2022 but CSD record not updated. No tax clearance. Directors cannot be located. Possible identity fraud.',
  },
];

export const mockEvidencePackages: EvidencePackage[] = [
  {
    id: 'EP001',
    caseRef: 'SIU/2024/GT/0891',
    compiledAt: '2024-11-08T06:00:00Z',
    status: 'SUBMITTED',
    legalAdmissible: true,
    items: [
      { type: 'NLP Analysis', description: 'Specification bias report — 14 flagged clauses with vendor match evidence', hash: 'sha256:a1b2c3d4e5f6' },
      { type: 'Price Benchmark', description: 'Market intelligence report — 47 comparable tenders, statistical analysis', hash: 'sha256:b2c3d4e5f6a1' },
      { type: 'Ownership Graph', description: 'Beneficial ownership traversal — 3-layer shell structure, PEP link', hash: 'sha256:c3d4e5f6a1b2' },
      { type: 'Audit Log', description: 'Immutable blockchain-backed decision trail — all agent actions', hash: 'sha256:d4e5f6a1b2c3' },
      { type: 'Whistleblower', description: 'Corroborating tip TIP-2024-0891 — NLP confidence 91.4%', hash: 'sha256:e5f6a1b2c3d4' },
    ],
  },
  {
    id: 'EP002',
    caseRef: 'SIU/2024/NW/0445',
    compiledAt: '2024-08-20T08:00:00Z',
    status: 'SUBMITTED',
    legalAdmissible: true,
    items: [
      { type: 'Pattern Analysis', description: 'Rotating winner statistical analysis — 14 tenders, 36 months, p < 0.001', hash: 'sha256:f6a1b2c3d4e5' },
      { type: 'Document Fingerprint', description: 'Bid document similarity analysis — 89% match across 4 entities', hash: 'sha256:a1b2c3d4e5f7' },
      { type: 'Financial Trace', description: 'Payment flow analysis — funds traced to common beneficiary accounts', hash: 'sha256:b2c3d4e5f6a2' },
      { type: 'CIPC Records', description: 'Director cross-reference — shared directors across 4 entities', hash: 'sha256:c3d4e5f6a1b3' },
      { type: 'Audit Log', description: 'Complete procurement decision trail — blockchain verified', hash: 'sha256:d4e5f6a1b2c4' },
    ],
  },
];

// ─── Executive Dashboard Metrics ──────────────────────────────────────────────

export const executiveMetrics: ExecutiveMetric[] = [
  { label: 'Total Procurement Value Monitored', value: 'R2.09B', change: '+R312M this month', positive: false, detail: 'Across 247 active tenders in all 9 provinces' },
  { label: 'Estimated Fraud Prevented (YTD)', value: 'R1.24B', change: '+34% vs target', positive: true, detail: 'Based on blocked bids and suspended tenders' },
  { label: 'Cases Referred to SIU/Hawks', value: '23', change: '+5 this month', positive: false, detail: 'With auto-compiled evidence packages' },
  { label: 'Vendors Blacklisted', value: '23', change: '+2 this month', positive: false, detail: 'Cross-departmental blacklist active' },
  { label: 'Bids Auto-Rejected by AI', value: '47', change: 'This quarter', positive: true, detail: 'Price threshold or compliance violations' },
  { label: 'Avg. Tender Integrity Score', value: '61/100', change: '+4 pts vs last quarter', positive: true, detail: 'Improving trend across all provinces' },
];

export const predictiveRiskData = [
  { tender: 'GT/DPW/2024/001', predictedFraud: 94, currentRisk: 91, trend: 'INCREASING' },
  { tender: 'NW/HOUSING/2024/021', predictedFraud: 97, currentRisk: 95, trend: 'STABLE' },
  { tender: 'LP/ROADS/2024/078', predictedFraud: 88, currentRisk: 83, trend: 'INCREASING' },
  { tender: 'WC/HEALTH/2024/047', predictedFraud: 79, currentRisk: 74, trend: 'STABLE' },
  { tender: 'KZN/EDUC/2024/112', predictedFraud: 72, currentRisk: 68, trend: 'DECREASING' },
  { tender: 'FS/AGRI/2024/055', predictedFraud: 28, currentRisk: 31, trend: 'DECREASING' },
];

export const systemicVulnerabilities = [
  { area: 'Emergency Procurement', risk: 94, description: 'Disaster-response fast-track bypasses standard controls — highest fraud vector (PPE 2020 pattern)' },
  { area: 'Single-Source Awards', risk: 88, description: 'Tenders with <3 bidders show 4.2x higher fraud probability' },
  { area: 'Municipal Procurement', risk: 82, description: 'Local government procurement lacks NT oversight — R2.9B TMPD case pattern' },
  { area: 'SOE Procurement', risk: 79, description: 'State-owned entities operate outside PFMA in some cases — Eskom pattern' },
  { area: 'Specification Writing', risk: 71, description: 'Officials with vendor relationships drafting specs — 34% of flagged tenders' },
  { area: 'Post-Award Monitoring', risk: 65, description: 'Payment-progress discrepancy detection gap — NW Housing pattern' },
];

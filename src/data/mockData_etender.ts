// ─── eTender Portal Mock Data ─────────────────────────────────────────────────
// Simulates tender advertisements, bid submissions, and award notices.
// Story: NT001-2026-PPE is a rigged tender (Inflated Goods wins with 17,677%
// markup on knee guards). NT002-2026-OFFICESUPPLIES is a legitimate tender.

export type ETenderStatus = 'Open' | 'Closed' | 'Awarded' | 'Cancelled' | 'Suspended';
export type BidComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Pending';

export interface ETenderContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface ETenderBid {
  supplier_csd_no: string;
  supplier_name: string;
  bid_amount: number;
  technical_score: number;
  submission_date: string;
  compliance_status: BidComplianceStatus;
  // Item-level pricing for benchmarking
  price_line_items: {
    description: string;
    unit: string;
    quantity: number;
    unit_price: number;
    market_benchmark_price: number;
    markup_percent: number;
    flagged: boolean;
  }[];
  ai_flags: string[];
  recommended_action: 'Accept' | 'Review' | 'Reject' | 'Block';
}

export interface ETenderAwardDetails {
  awarded_supplier_csd_no: string;
  awarded_supplier_name: string;
  award_amount: number;
  award_date: string;
  award_justification: string;
}

export interface ETender {
  tender_id: string;
  title: string;
  description: string;
  status: ETenderStatus;
  publish_date: string;
  closing_date: string;
  issuing_department: string;
  contact_person: ETenderContactPerson;
  estimated_value: number;
  specifications: string[];
  required_documents: string[];
  bids: ETenderBid[];
  award_details?: ETenderAwardDetails;
  // AI analysis
  ai_integrity_score: number;
  ai_risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  ai_spec_rigging_detected: boolean;
  ai_spec_rigging_detail?: string;
  ai_flags: string[];
}

// ─── NT001-2026-PPE — Rigged Tender ──────────────────────────────────────────
// Specifications are deliberately written to match Inflated Goods (Pty) Ltd.
// Knee guards quoted at R80,000/pair vs R320 retail — 24,900% markup.
export const etenderPPE: ETender = {
  tender_id: 'NT001-2026-PPE',
  title: 'Supply of Highly Specialized Personal Protective Equipment',
  description:
    'Procurement of advanced protective gear for government facilities, including custom-fit knee guards with proprietary polymer blend, triple-layered anti-microbial gloves with integrated biometric sensors, and ISO-certified safety helmets with embedded GPS tracking.',
  status: 'Open',
  publish_date: '2026-04-01',
  closing_date: '2026-05-30',
  issuing_department: 'Department of Public Works',
  contact_person: {
    name: 'Mr. X. Official',
    email: 'x.official@dpw.gov.za',
    phone: '0120001234',
  },
  estimated_value: 8_000_000,
  specifications: [
    'Knee guards: Custom-molded, proprietary polymer blend (PolyGuard™ Series 7 or equivalent), impact absorption rating ≥ 200J, EN 14404:2004+A1:2010 certified, available only from registered PolyGuard™ distributors.',
    'Gloves: Triple-layered, anti-microbial coating (BioShield™ technology), with integrated biometric sensor array for worker monitoring, Bluetooth 5.0 connectivity, IP67 rated.',
    'Safety helmets: ISO 3873:2023 certified, embedded GPS module (accuracy ≤ 2m), 72-hour battery life, proprietary firmware update capability.',
    'All items must be delivered within 7 days of award — pre-positioned stock required.',
    'Supplier must hold ISO 9001:2015 certification specifically for "PPE manufacturing in high-risk government environments" — sub-category.',
  ],
  required_documents: [
    'Company Profile',
    'Tax Clearance Certificate',
    'B-BBEE Certificate (Level 1 or 2 only)',
    'ISO 9001:2015 Certificate (PPE sub-category)',
    'PolyGuard™ Distributor Registration Certificate',
    'Proof of pre-positioned stock (warehouse inventory report)',
  ],
  bids: [
    {
      supplier_csd_no: 'MAAA0000002',
      supplier_name: 'Inflated Goods (Pty) Ltd',
      bid_amount: 8_000_000,
      technical_score: 95,
      submission_date: '2026-05-28',
      compliance_status: 'Non-Compliant',
      price_line_items: [
        {
          description: 'Welding Knee Guards (PPE) — per pair',
          unit: 'pair',
          quantity: 100,
          unit_price: 80_000,
          market_benchmark_price: 320,
          markup_percent: 24900,
          flagged: true,
        },
        {
          description: 'Triple-layer Anti-microbial Gloves — per pair',
          unit: 'pair',
          quantity: 200,
          unit_price: 12_500,
          market_benchmark_price: 180,
          markup_percent: 6844,
          flagged: true,
        },
        {
          description: 'GPS Safety Helmet — per unit',
          unit: 'unit',
          quantity: 50,
          unit_price: 45_000,
          market_benchmark_price: 850,
          markup_percent: 5194,
          flagged: true,
        },
      ],
      ai_flags: [
        'Price 24,900% above market benchmark on knee guards (R80,000 vs R320 retail)',
        'Price 6,844% above benchmark on gloves',
        'Price 5,194% above benchmark on helmets',
        'Tax non-compliant — SARS TCS expired',
        'B-BBEE certificate issued by unaccredited agency — fronting suspected',
        'Sole bidder meeting all specification requirements — spec rigging indicator',
        'Supplier registered address matches 2 other flagged entities',
      ],
      recommended_action: 'Block',
    },
    {
      supplier_csd_no: 'MAAA0000001',
      supplier_name: 'HonestSupplies (Pty) Ltd',
      bid_amount: 450_000,
      technical_score: 70,
      submission_date: '2026-05-29',
      compliance_status: 'Compliant',
      price_line_items: [
        {
          description: 'Welding Knee Guards (PPE) — per pair',
          unit: 'pair',
          quantity: 100,
          unit_price: 450,
          market_benchmark_price: 320,
          markup_percent: 41,
          flagged: false,
        },
        {
          description: 'Standard Anti-microbial Gloves — per pair',
          unit: 'pair',
          quantity: 200,
          unit_price: 195,
          market_benchmark_price: 180,
          markup_percent: 8,
          flagged: false,
        },
        {
          description: 'Standard Safety Helmet — per unit',
          unit: 'unit',
          quantity: 50,
          unit_price: 920,
          market_benchmark_price: 850,
          markup_percent: 8,
          flagged: false,
        },
      ],
      ai_flags: [
        'Technical score (70) lower than Inflated Goods (95) — specifications appear written to disadvantage compliant bidders',
        'Cannot meet 7-day delivery requirement without pre-positioned stock — spec exclusion tactic',
        'Does not hold PolyGuard™ distributor certificate — proprietary requirement excludes legitimate suppliers',
      ],
      recommended_action: 'Review',
    },
  ],
  ai_integrity_score: 6,
  ai_risk_level: 'CRITICAL',
  ai_spec_rigging_detected: true,
  ai_spec_rigging_detail:
    'NLP analysis detected 5 specification clauses that reference proprietary products (PolyGuard™, BioShield™) available from only 1 registered distributor. The 7-day delivery requirement and ISO sub-category certification effectively exclude all but 1 supplier. Confidence: 97.8%.',
  ai_flags: [
    'Specification rigging — 5 clauses reference proprietary products from single distributor',
    'Sole compliant bidder is tax non-compliant and B-BBEE fraudulent',
    'Legitimate bidder (HonestSupplies) technically excluded by rigged specifications',
    'Price differential between bids: 1,678% — extreme outlier',
    'Issuing official (Mr. X. Official) linked to John Doe via procurement committee records',
    'Tender should be cancelled and re-advertised with neutral specifications',
  ],
};

// ─── NT002-2026-OFFICESUPPLIES — Legitimate Tender ────────────────────────────
export const etenderOfficeSupplies: ETender = {
  tender_id: 'NT002-2026-OFFICESUPPLIES',
  title: 'Supply of General Office Supplies',
  description:
    'Procurement of standard office consumables including pens, paper, folders, and related stationery items for the Department of Basic Education national offices.',
  status: 'Open',
  publish_date: '2026-04-15',
  closing_date: '2026-06-15',
  issuing_department: 'Department of Basic Education',
  contact_person: {
    name: 'Ms. Y. Admin',
    email: 'y.admin@dbe.gov.za',
    phone: '0120005678',
  },
  estimated_value: 155_000,
  specifications: [
    'A4 White Printer Paper: 80gsm, 500 sheets per ream, minimum 80% recycled content, FSC certified.',
    'Ballpoint Pens: Blue ink, medium point, retractable, minimum 1km write-out.',
    'Lever Arch Files: A4, 70mm spine, polypropylene cover, metal mechanism.',
    'Sticky Notes: 76mm x 76mm, 100 sheets per pad, assorted colours.',
  ],
  required_documents: [
    'Company Profile',
    'Tax Clearance Certificate',
    'B-BBEE Certificate',
    'CSD Registration Confirmation',
  ],
  bids: [
    {
      supplier_csd_no: 'MAAA0000001',
      supplier_name: 'HonestSupplies (Pty) Ltd',
      bid_amount: 150_000,
      technical_score: 85,
      submission_date: '2026-06-10',
      compliance_status: 'Compliant',
      price_line_items: [
        {
          description: 'A4 White Printer Paper — per ream',
          unit: 'ream',
          quantity: 1000,
          unit_price: 50,
          market_benchmark_price: 52,
          markup_percent: -4,
          flagged: false,
        },
        {
          description: 'Ballpoint Pens — per box of 50',
          unit: 'box',
          quantity: 200,
          unit_price: 85,
          market_benchmark_price: 90,
          markup_percent: -6,
          flagged: false,
        },
        {
          description: 'Lever Arch Files — per unit',
          unit: 'unit',
          quantity: 500,
          unit_price: 38,
          market_benchmark_price: 40,
          markup_percent: -5,
          flagged: false,
        },
      ],
      ai_flags: [],
      recommended_action: 'Accept',
    },
    {
      supplier_csd_no: 'MAAA0000005',
      supplier_name: 'Office Direct SA (Pty) Ltd',
      bid_amount: 160_000,
      technical_score: 80,
      submission_date: '2026-06-12',
      compliance_status: 'Compliant',
      price_line_items: [
        {
          description: 'A4 White Printer Paper — per ream',
          unit: 'ream',
          quantity: 1000,
          unit_price: 55,
          market_benchmark_price: 52,
          markup_percent: 6,
          flagged: false,
        },
        {
          description: 'Ballpoint Pens — per box of 50',
          unit: 'box',
          quantity: 200,
          unit_price: 92,
          market_benchmark_price: 90,
          markup_percent: 2,
          flagged: false,
        },
        {
          description: 'Lever Arch Files — per unit',
          unit: 'unit',
          quantity: 500,
          unit_price: 42,
          market_benchmark_price: 40,
          markup_percent: 5,
          flagged: false,
        },
      ],
      ai_flags: [],
      recommended_action: 'Accept',
    },
    {
      supplier_csd_no: 'MAAA0000006',
      supplier_name: 'Stationery World CC',
      bid_amount: 148_500,
      technical_score: 78,
      submission_date: '2026-06-14',
      compliance_status: 'Compliant',
      price_line_items: [
        {
          description: 'A4 White Printer Paper — per ream',
          unit: 'ream',
          quantity: 1000,
          unit_price: 48,
          market_benchmark_price: 52,
          markup_percent: -8,
          flagged: false,
        },
        {
          description: 'Ballpoint Pens — per box of 50',
          unit: 'box',
          quantity: 200,
          unit_price: 82,
          market_benchmark_price: 90,
          markup_percent: -9,
          flagged: false,
        },
        {
          description: 'Lever Arch Files — per unit',
          unit: 'unit',
          quantity: 500,
          unit_price: 37,
          market_benchmark_price: 40,
          markup_percent: -8,
          flagged: false,
        },
      ],
      ai_flags: [],
      recommended_action: 'Accept',
    },
  ],
  ai_integrity_score: 91,
  ai_risk_level: 'LOW',
  ai_spec_rigging_detected: false,
  ai_flags: [
    'Healthy competition — 3 compliant bidders',
    'All prices within ±10% of market benchmark',
    'No ownership or compliance concerns detected',
  ],
};

// ─── NT003-2026-CONSTRUCTION — Medium Risk Tender ────────────────────────────
export const etenderConstruction: ETender = {
  tender_id: 'NT003-2026-CONSTRUCTION',
  title: 'Renovation of Government Office Building — Pretoria CBD',
  description:
    'Refurbishment of 3 floors of the Pretoria CBD government office complex, including electrical upgrades, plumbing, painting, and flooring.',
  status: 'Closed',
  publish_date: '2026-02-01',
  closing_date: '2026-03-15',
  issuing_department: 'Department of Public Works',
  contact_person: {
    name: 'Mr. Z. Procurement',
    email: 'z.procurement@dpw.gov.za',
    phone: '0120009012',
  },
  estimated_value: 12_500_000,
  specifications: [
    'Electrical: Full rewiring of 3 floors to SANS 10142-1:2020 standard.',
    'Plumbing: Replacement of all water supply and drainage pipes.',
    'Painting: Interior and exterior, 2 coats, approved colour palette.',
    'Flooring: Commercial-grade vinyl tiles, minimum 3mm thickness.',
  ],
  required_documents: [
    'Company Profile',
    'Tax Clearance Certificate',
    'B-BBEE Certificate',
    'CIDB Grade 5CE or higher',
    'Proof of similar projects completed',
  ],
  bids: [
    {
      supplier_csd_no: 'MAAA0000007',
      supplier_name: 'Reliable Builders (Pty) Ltd',
      bid_amount: 11_800_000,
      technical_score: 88,
      submission_date: '2026-03-10',
      compliance_status: 'Compliant',
      price_line_items: [
        {
          description: 'Electrical rewiring — per floor',
          unit: 'floor',
          quantity: 3,
          unit_price: 1_800_000,
          market_benchmark_price: 1_750_000,
          markup_percent: 3,
          flagged: false,
        },
        {
          description: 'Plumbing replacement — per floor',
          unit: 'floor',
          quantity: 3,
          unit_price: 950_000,
          market_benchmark_price: 900_000,
          markup_percent: 6,
          flagged: false,
        },
      ],
      ai_flags: [],
      recommended_action: 'Accept',
    },
    {
      supplier_csd_no: 'MAAA0000002',
      supplier_name: 'Inflated Goods (Pty) Ltd',
      bid_amount: 24_900_000,
      technical_score: 72,
      submission_date: '2026-03-12',
      compliance_status: 'Non-Compliant',
      price_line_items: [
        {
          description: 'Electrical rewiring — per floor',
          unit: 'floor',
          quantity: 3,
          unit_price: 4_500_000,
          market_benchmark_price: 1_750_000,
          markup_percent: 157,
          flagged: true,
        },
        {
          description: 'Plumbing replacement — per floor',
          unit: 'floor',
          quantity: 3,
          unit_price: 2_800_000,
          market_benchmark_price: 900_000,
          markup_percent: 211,
          flagged: true,
        },
      ],
      ai_flags: [
        'Bid amount 111% above lowest compliant bid',
        'Tax non-compliant — ineligible to bid',
        'Electrical pricing 157% above benchmark',
        'Plumbing pricing 211% above benchmark',
      ],
      recommended_action: 'Reject',
    },
  ],
  ai_integrity_score: 72,
  ai_risk_level: 'MEDIUM',
  ai_spec_rigging_detected: false,
  ai_flags: [
    'Non-compliant bidder (Inflated Goods) submitted despite known ineligibility',
    'Price differential between bids: 111% — warrants review',
    'Recommend awarding to Reliable Builders (Pty) Ltd — lowest compliant bid',
  ],
};

// ─── Blockchain Audit Ledger Entries ─────────────────────────────────────────
// Conceptual immutable log of AI interventions on the rigged tender

export interface BlockchainLedgerEntry {
  transaction_id: string;
  timestamp: string;
  event_type:
    | 'Tender Published'
    | 'Bid Submitted'
    | 'AI Flag Raised'
    | 'Decision Recorded'
    | 'Contract Awarded'
    | 'Tender Suspended'
    | 'Evidence Compiled'
    | 'Referral Issued';
  entity_id: string;
  details: Record<string, string | number>;
  actor: string;
  immutable: boolean;
}

export const blockchainAuditLedger: BlockchainLedgerEntry[] = [
  {
    transaction_id: '0xabcdef1234567890',
    timestamp: '2026-04-01T08:00:00Z',
    event_type: 'Tender Published',
    entity_id: 'NT001-2026-PPE',
    details: {
      published_by: 'Mr. X. Official',
      department: 'Department of Public Works',
      estimated_value: 8000000,
    },
    actor: 'DPW_Procurement_Portal',
    immutable: true,
  },
  {
    transaction_id: '0xbcdef12345678901',
    timestamp: '2026-04-02T09:15:00Z',
    event_type: 'AI Flag Raised',
    entity_id: 'NT001-2026-PPE',
    details: {
      flag_type: 'Specification Rigging',
      confidence: '97.8%',
      clauses_flagged: 5,
      suggested_action: 'Cancel tender and re-advertise with neutral specifications',
    },
    actor: 'SentinelProcure_NLP_Spec_Auditor',
    immutable: true,
  },
  {
    transaction_id: '0xcdef123456789012',
    timestamp: '2026-05-28T14:30:00Z',
    event_type: 'Bid Submitted',
    entity_id: 'NT001-2026-PPE',
    details: {
      supplier: 'Inflated Goods (Pty) Ltd',
      csd_no: 'MAAA0000002',
      bid_amount: 8000000,
    },
    actor: 'eTender_Portal',
    immutable: true,
  },
  {
    transaction_id: '0xdef1234567890123',
    timestamp: '2026-05-28T14:31:00Z',
    event_type: 'AI Flag Raised',
    entity_id: 'NT001-2026-PPE',
    details: {
      flag_type: 'Price Anomaly',
      item: 'Welding Knee Guards',
      quoted_price: 80000,
      benchmark_price: 320,
      markup_percent: 24900,
      threshold_exceeded: '24,900%',
      suggested_action: 'Block bid — MAAA0000002',
    },
    actor: 'SentinelProcure_Market_Intelligence_Engine',
    immutable: true,
  },
  {
    transaction_id: '0xef12345678901234',
    timestamp: '2026-05-28T14:32:00Z',
    event_type: 'Decision Recorded',
    entity_id: 'NT001-2026-PPE',
    details: {
      decision: 'Bid BLOCKED — MAAA0000002',
      reason: 'Price 24,900% above benchmark. Tax non-compliant. B-BBEE fronting confirmed.',
      blocked_by: 'SentinelProcure_AI_Agent',
    },
    actor: 'SentinelProcure_Autonomous_Mitigation_Agent',
    immutable: true,
  },
  {
    transaction_id: '0xf123456789012345',
    timestamp: '2026-05-29T10:00:00Z',
    event_type: 'Bid Submitted',
    entity_id: 'NT001-2026-PPE',
    details: {
      supplier: 'HonestSupplies (Pty) Ltd',
      csd_no: 'MAAA0000001',
      bid_amount: 450000,
    },
    actor: 'eTender_Portal',
    immutable: true,
  },
  {
    transaction_id: '0x0123456789012345',
    timestamp: '2026-05-30T16:00:00Z',
    event_type: 'Evidence Compiled',
    entity_id: 'NT001-2026-PPE',
    details: {
      evidence_package: 'EP-NT001-2026-PPE',
      items_compiled: 6,
      legal_admissible: 'true',
      hash: 'sha256:a1b2c3d4e5f6g7h8',
    },
    actor: 'SentinelProcure_Evidence_Compiler',
    immutable: true,
  },
  {
    transaction_id: '0x123456789012345a',
    timestamp: '2026-05-31T08:00:00Z',
    event_type: 'Referral Issued',
    entity_id: 'NT001-2026-PPE',
    details: {
      referred_to: 'SIU',
      case_ref: 'SIU/2026/NT/0001',
      estimated_loss_prevented: 7550000,
    },
    actor: 'SentinelProcure_AI_Agent',
    immutable: true,
  },
];

// ─── FIC (Financial Intelligence Centre) Simulated Risk Profiles ──────────────
// Future state — simulated for MVP based on internal risk scores

export interface FICProfile {
  entity_id: string;
  entity_name: string;
  fic_risk_rating: 'low' | 'medium' | 'high' | 'sanctioned';
  sar_count: number;
  linked_suspicious_transactions: string[];
  notes: string[];
}

export const ficProfiles: FICProfile[] = [
  {
    entity_id: '2015/123456/07',
    entity_name: 'CorruptCo (Pty) Ltd',
    fic_risk_rating: 'high',
    sar_count: 3,
    linked_suspicious_transactions: [
      'TXN-2024-001: R4.2M transfer to personal account within 3 days of government payment',
      'TXN-2024-002: R8.5M offshore transfer to Mauritius entity',
      'TXN-2025-001: R1.8M cash withdrawal — no business purpose declared',
    ],
    notes: [
      'FIC Suspicious Activity Reports filed by FNB (2024) and Absa (2025)',
      'Linked to money laundering investigation ML/2024/GP/0089',
    ],
  },
  {
    entity_id: '2018/987654/07',
    entity_name: 'Inflated Goods (Pty) Ltd',
    fic_risk_rating: 'high',
    sar_count: 1,
    linked_suspicious_transactions: [
      'TXN-2025-003: R28M transfer to NW Build Solutions CC within 24 hours of government payment',
    ],
    notes: [
      'FIC SAR filed by Absa (2025)',
      'Funds traced through 3 entities before reaching offshore account',
    ],
  },
  {
    entity_id: '2020/789012/07',
    entity_name: 'HonestSupplies (Pty) Ltd',
    fic_risk_rating: 'low',
    sar_count: 0,
    linked_suspicious_transactions: [],
    notes: ['No suspicious activity on record'],
  },
];

// ─── Aggregated export ────────────────────────────────────────────────────────
export const allETenders: ETender[] = [
  etenderPPE,
  etenderOfficeSupplies,
  etenderConstruction,
];

export function getETender(tenderId: string): ETender | undefined {
  return allETenders.find(t => t.tender_id === tenderId);
}

export function getRiggedTenders(): ETender[] {
  return allETenders.filter(t => t.ai_spec_rigging_detected);
}

export function getTendersBySupplier(csdNo: string): ETender[] {
  return allETenders.filter(t =>
    t.bids.some(b => b.supplier_csd_no === csdNo)
  );
}

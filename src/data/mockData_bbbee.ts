// ─── B-BBEE Commission Mock Data ─────────────────────────────────────────────
// Linked to CSD profiles via csd_supplier_no.
// Demonstrates fronting detection: high B-BBEE level but suspicious ownership.

export interface BBBEEScorecard {
  ownership: number;
  management_control: number;
  skills_development: number;
  enterprise_supplier_development: number;
  socio_economic_development: number;
  total_score: number;
}

export interface BBBEEProfile {
  csd_supplier_no: string;
  supplier_name: string;
  b_bbee_status_level: string;
  b_bbee_recognition_level: string;
  verification_date: string;
  expiry_date: string;
  verification_agency: string;
  agency_accredited: boolean;
  // Ownership metrics — key for fronting detection
  ownership_black_percentage: number;
  management_black_percentage: number;
  skills_development_score: number;
  esd_score: number;
  scorecard: BBBEEScorecard;
  // Enriched fields
  fronting_indicators: string[];
  fronting_risk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CONFIRMED';
  commission_database_match: boolean;
  commission_verified_level: string | null;
  notes: string[];
}

// ─── MAAA0000001 — HonestSupplies — Genuine Level 1 ──────────────────────────
export const bbbeeHonestSupplies: BBBEEProfile = {
  csd_supplier_no: 'MAAA0000001',
  supplier_name: 'HonestSupplies (Pty) Ltd',
  b_bbee_status_level: 'Level 1',
  b_bbee_recognition_level: '135%',
  verification_date: '2025-11-01',
  expiry_date: '2026-10-31',
  verification_agency: 'EmpowerLogic',
  agency_accredited: true,
  ownership_black_percentage: 51,
  management_black_percentage: 60,
  skills_development_score: 20,
  esd_score: 25,
  scorecard: {
    ownership: 25,
    management_control: 19,
    skills_development: 20,
    enterprise_supplier_development: 40,
    socio_economic_development: 5,
    total_score: 109,
  },
  fronting_indicators: [],
  fronting_risk: 'NONE',
  commission_database_match: true,
  commission_verified_level: 'Level 1',
  notes: [
    'Certificate verified against B-BBEE Commission national database',
    'EmpowerLogic is an accredited verification agency',
    'Ownership and management percentages consistent with CIPC director data',
  ],
};

// ─── MAAA0000002 — Inflated Goods — Suspicious / Fronting ────────────────────
// Claims Level 2 but management control is only 10% — classic fronting pattern
export const bbbeeInflatedGoods: BBBEEProfile = {
  csd_supplier_no: 'MAAA0000002',
  supplier_name: 'Inflated Goods (Pty) Ltd',
  b_bbee_status_level: 'Level 2',
  b_bbee_recognition_level: '125%',
  verification_date: '2025-12-15',
  expiry_date: '2026-12-14',
  verification_agency: 'BEE-Veri Solutions',
  agency_accredited: false,
  ownership_black_percentage: 51,
  management_black_percentage: 10,
  skills_development_score: 5,
  esd_score: 8,
  scorecard: {
    ownership: 25,
    management_control: 4,
    skills_development: 5,
    enterprise_supplier_development: 8,
    socio_economic_development: 1,
    total_score: 43,
  },
  fronting_indicators: [
    'Management control (10%) is critically inconsistent with claimed ownership (51%) — fronting indicator',
    'Verification agency "BEE-Veri Solutions" is NOT accredited by the B-BBEE Commission',
    'Skills development score (5/20) inconsistent with Level 2 claim',
    'ESD score (8/40) inconsistent with Level 2 claim',
    'CIPC beneficial owner (John Doe) is not black-owned — ownership claim cannot be verified',
    'Certificate not found in B-BBEE Commission national database',
  ],
  fronting_risk: 'CONFIRMED',
  commission_database_match: false,
  commission_verified_level: null,
  notes: [
    'ALERT: Certificate issued by unaccredited agency — legally invalid',
    'ALERT: Commission database lookup returned NO MATCH for this certificate number',
    'ALERT: Ownership claim contradicted by CIPC beneficial ownership data',
    'Referred to B-BBEE Commission for investigation under B-BBEE Act Section 13B',
  ],
};

// ─── MAAA0000003 — CorruptCo — Non-Compliant ─────────────────────────────────
export const bbbeeCorruptCo: BBBEEProfile = {
  csd_supplier_no: 'MAAA0000003',
  supplier_name: 'CorruptCo (Pty) Ltd',
  b_bbee_status_level: 'Non-Compliant',
  b_bbee_recognition_level: '0%',
  verification_date: '2023-06-01',
  expiry_date: '2024-05-31',
  verification_agency: 'N/A',
  agency_accredited: false,
  ownership_black_percentage: 0,
  management_black_percentage: 0,
  skills_development_score: 0,
  esd_score: 0,
  scorecard: {
    ownership: 0,
    management_control: 0,
    skills_development: 0,
    enterprise_supplier_development: 0,
    socio_economic_development: 0,
    total_score: 0,
  },
  fronting_indicators: [
    'B-BBEE certificate expired May 2024 — not renewed',
    'No verification agency on record',
    'Shell company with no employees — cannot score on any B-BBEE element',
  ],
  fronting_risk: 'NONE',
  commission_database_match: false,
  commission_verified_level: null,
  notes: [
    'Certificate expired — company is Non-Compliant',
    'Cannot score preference points in any government procurement',
  ],
};

// ─── MAAA0000004 — Meridian Procurement Holdings — Pending ───────────────────
export const bbbeeMeridian: BBBEEProfile = {
  csd_supplier_no: 'MAAA0000004',
  supplier_name: 'Meridian Procurement Holdings CC',
  b_bbee_status_level: 'Level 2',
  b_bbee_recognition_level: '125%',
  verification_date: '2026-01-10',
  expiry_date: '2027-01-09',
  verification_agency: 'BEE-Veri Solutions',
  agency_accredited: false,
  ownership_black_percentage: 49,
  management_black_percentage: 49,
  skills_development_score: 12,
  esd_score: 15,
  scorecard: {
    ownership: 22,
    management_control: 15,
    skills_development: 12,
    enterprise_supplier_development: 15,
    socio_economic_development: 3,
    total_score: 67,
  },
  fronting_indicators: [
    'Same unaccredited verification agency as Inflated Goods (Pty) Ltd — BEE-Veri Solutions',
    'Certificate pending Commission database verification',
    'Director Jane Doe (49% owner) is also director of CorruptCo — network entity',
  ],
  fronting_risk: 'HIGH',
  commission_database_match: false,
  commission_verified_level: null,
  notes: [
    'Certificate issued by same unaccredited agency as Inflated Goods — pattern of fraudulent certification',
    'Pending B-BBEE Commission investigation',
  ],
};

// ─── Aggregated export ────────────────────────────────────────────────────────
export const allBBBEEProfiles: BBBEEProfile[] = [
  bbbeeHonestSupplies,
  bbbeeInflatedGoods,
  bbbeeCorruptCo,
  bbbeeMeridian,
];

export function getBBBEEProfile(csdSupplierNo: string): BBBEEProfile | undefined {
  return allBBBEEProfiles.find(p => p.csd_supplier_no === csdSupplierNo);
}

export function getFrontingRiskProfiles(): BBBEEProfile[] {
  return allBBBEEProfiles.filter(p =>
    p.fronting_risk === 'HIGH' || p.fronting_risk === 'CONFIRMED'
  );
}

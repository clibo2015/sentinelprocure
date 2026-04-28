// ─── SARS (South African Revenue Service) Mock Data ──────────────────────────
// Linked to CSD profiles via csd_supplier_no.
// Demonstrates tax compliance verification as part of vendor due diligence.

export type TCSStatus = 'compliant' | 'non-compliant';
export type FinancialRiskScore = 'low' | 'medium' | 'high';

export interface SARSProfile {
  csd_supplier_no: string;
  // Linked company name for display convenience
  supplier_name: string;
  tcs_status: TCSStatus;
  tcs_pin: string;
  vat_registered: boolean;
  vat_number: string | null;
  paye_registered: boolean;
  financial_risk_score: FinancialRiskScore;
  last_filing_date: string;
  // Enriched fields
  outstanding_returns: number;
  debt_amount: number | null;
  risk_notes: string[];
}

// ─── HonestSupplies — Fully Compliant ────────────────────────────────────────
export const sarsHonestSupplies: SARSProfile = {
  csd_supplier_no: 'MAAA0000001',
  supplier_name: 'HonestSupplies (Pty) Ltd',
  tcs_status: 'compliant',
  tcs_pin: 'ABC123DEF456',
  vat_registered: true,
  vat_number: '4000123456',
  paye_registered: true,
  financial_risk_score: 'low',
  last_filing_date: '2026-03-31',
  outstanding_returns: 0,
  debt_amount: null,
  risk_notes: [],
};

// ─── Inflated Goods — Non-Compliant / High Risk ───────────────────────────────
export const sarsInflatedGoods: SARSProfile = {
  csd_supplier_no: 'MAAA0000002',
  supplier_name: 'Inflated Goods (Pty) Ltd',
  tcs_status: 'non-compliant',
  tcs_pin: 'GHI789JKL012',
  vat_registered: false,
  vat_number: null,
  paye_registered: false,
  financial_risk_score: 'high',
  last_filing_date: '2025-02-28',
  outstanding_returns: 4,
  debt_amount: 1_240_000,
  risk_notes: [
    'Tax Clearance Certificate expired — not renewed since Feb 2025',
    'VAT deregistered in 2024 — no longer eligible for government contracts',
    'PAYE non-compliant — no employee tax submissions on record',
    '4 outstanding tax returns — SARS enforcement action pending',
    'Outstanding tax debt of R1.24M',
  ],
};

// ─── CorruptCo — Non-Compliant ────────────────────────────────────────────────
export const sarsCorruptCo: SARSProfile = {
  csd_supplier_no: 'MAAA0000003',
  supplier_name: 'CorruptCo (Pty) Ltd',
  tcs_status: 'non-compliant',
  tcs_pin: 'MNO345PQR678',
  vat_registered: true,
  vat_number: '4009876543',
  paye_registered: false,
  financial_risk_score: 'high',
  last_filing_date: '2024-08-31',
  outstanding_returns: 2,
  debt_amount: 680_000,
  risk_notes: [
    'TCS lapsed — last valid certificate expired August 2024',
    'PAYE not registered despite 12 employees listed on CSD',
    '2 outstanding income tax returns',
    'Outstanding tax debt of R680,000',
  ],
};

// ─── Meridian Procurement Holdings — Compliant (suspicious) ──────────────────
// Compliant on paper but recently registered — used to launder bids
export const sarsMeridian: SARSProfile = {
  csd_supplier_no: 'MAAA0000004',
  supplier_name: 'Meridian Procurement Holdings CC',
  tcs_status: 'compliant',
  tcs_pin: 'STU901VWX234',
  vat_registered: true,
  vat_number: '4001122334',
  paye_registered: true,
  financial_risk_score: 'medium',
  last_filing_date: '2026-01-31',
  outstanding_returns: 0,
  debt_amount: null,
  risk_notes: [
    'Compliant on paper — TCS valid',
    'Revenue declared (R180k/yr) is 0.2% of contract value bid — financial viability concern',
    'PAYE registered but only 2 employees declared — inconsistent with bid scope',
  ],
};

// ─── Aggregated export ────────────────────────────────────────────────────────
export const allSARSProfiles: SARSProfile[] = [
  sarsHonestSupplies,
  sarsInflatedGoods,
  sarsCorruptCo,
  sarsMeridian,
];

export function getSARSProfile(csdSupplierNo: string): SARSProfile | undefined {
  return allSARSProfiles.find(p => p.csd_supplier_no === csdSupplierNo);
}

export function getSARSProfileByName(name: string): SARSProfile | undefined {
  return allSARSProfiles.find(p =>
    p.supplier_name.toLowerCase().includes(name.toLowerCase())
  );
}

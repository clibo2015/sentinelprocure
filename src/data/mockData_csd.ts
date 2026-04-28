// ─── CSD (Central Supplier Database) Mock Data ───────────────────────────────
// The CSD profile acts as the central hub, linking to CIPC and SARS data
// through common identifiers (csd_supplier_no, directors_id_numbers).

export type CSDStatus = 'Registered' | 'Verified' | 'Pending' | 'Suspended';
export type VerificationState = 'Verified' | 'Not Verified' | 'Pending';

export interface CSDVerificationStatus {
  bank_details: VerificationState;
  tax_compliance: VerificationState;
  b_bbee: VerificationState;
  cipc_registration: VerificationState;
}

export interface CSDContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface CSDAddress {
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface CSDBankDetails {
  bank_name: string;
  account_number: string;
  account_type: 'Cheque' | 'Savings' | 'Current';
  account_verified: boolean;
  account_age_days: number;
}

export interface CSDProfile {
  csd_supplier_no: string;
  supplier_name: string;
  cipc_reg_no: string;
  registration_date: string;
  status: CSDStatus;
  verification_status: CSDVerificationStatus;
  tax_compliance_status: 'compliant' | 'non-compliant';
  b_bbee_level: string;
  contact_person: CSDContactPerson;
  bank_details: CSDBankDetails;
  physical_address: CSDAddress;
  commodity_codes: string[];
  directors_id_numbers: string[];
  // Enriched / derived fields
  risk_flags: string[];
  overall_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  eligible_to_bid: boolean;
  ineligibility_reasons: string[];
}

// ─── MAAA0000001 — HonestSupplies (Pty) Ltd — Compliant ──────────────────────
export const csdHonestSupplies: CSDProfile = {
  csd_supplier_no: 'MAAA0000001',
  supplier_name: 'HonestSupplies (Pty) Ltd',
  cipc_reg_no: '2020/789012/07',
  registration_date: '2020-01-10',
  status: 'Verified',
  verification_status: {
    bank_details: 'Verified',
    tax_compliance: 'Verified',
    b_bbee: 'Verified',
    cipc_registration: 'Verified',
  },
  tax_compliance_status: 'compliant',
  b_bbee_level: 'Level 1',
  contact_person: {
    name: 'Peter Smith',
    email: 'peter.smith@honestsupplies.co.za',
    phone: '0111234567',
  },
  bank_details: {
    bank_name: 'FNB',
    account_number: '62000000001',
    account_type: 'Cheque',
    account_verified: true,
    account_age_days: 2190,
  },
  physical_address: {
    street: '456 Integrity Avenue',
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '2000',
  },
  commodity_codes: ['01010101', '01010102', '01010103'],
  directors_id_numbers: ['8502025000086'],
  risk_flags: [],
  overall_risk: 'LOW',
  eligible_to_bid: true,
  ineligibility_reasons: [],
};

// ─── MAAA0000002 — Inflated Goods (Pty) Ltd — Non-Compliant / High Risk ───────
export const csdInflatedGoods: CSDProfile = {
  csd_supplier_no: 'MAAA0000002',
  supplier_name: 'Inflated Goods (Pty) Ltd',
  cipc_reg_no: '2018/987654/07',
  registration_date: '2018-03-01',
  status: 'Registered',
  verification_status: {
    bank_details: 'Verified',
    tax_compliance: 'Not Verified',
    b_bbee: 'Pending',
    cipc_registration: 'Verified',
  },
  tax_compliance_status: 'non-compliant',
  b_bbee_level: 'Non-Compliant',
  contact_person: {
    name: 'John Doe',
    email: 'john.doe@inflatedgoods.co.za',
    phone: '0119876543',
  },
  bank_details: {
    bank_name: 'Absa',
    account_number: '63000000002',
    account_type: 'Cheque',
    account_verified: true,
    account_age_days: 2920,
  },
  physical_address: {
    street: '123 Corrupt Street',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
  },
  commodity_codes: ['01010101'],
  directors_id_numbers: ['8001015000087'],
  risk_flags: [
    'Tax compliance not verified — SARS TCS expired',
    'B-BBEE certificate pending — cannot be verified against Commission database',
    'Registered address shared with CorruptCo (Pty) Ltd and Meridian Procurement Holdings',
    'Director (John Doe) is beneficial owner of 3 linked companies',
    'Bid price 17,677% above market benchmark on NT001-2026-PPE',
  ],
  overall_risk: 'CRITICAL',
  eligible_to_bid: false,
  ineligibility_reasons: [
    'Tax Clearance Certificate not valid — SARS non-compliant',
    'B-BBEE status unverified — cannot score preference points',
  ],
};

// ─── MAAA0000003 — CorruptCo (Pty) Ltd — Suspended ───────────────────────────
export const csdCorruptCo: CSDProfile = {
  csd_supplier_no: 'MAAA0000003',
  supplier_name: 'CorruptCo (Pty) Ltd',
  cipc_reg_no: '2015/123456/07',
  registration_date: '2015-06-01',
  status: 'Suspended',
  verification_status: {
    bank_details: 'Verified',
    tax_compliance: 'Not Verified',
    b_bbee: 'Not Verified',
    cipc_registration: 'Verified',
  },
  tax_compliance_status: 'non-compliant',
  b_bbee_level: 'Non-Compliant',
  contact_person: {
    name: 'John Doe',
    email: 'john.doe@corruptco.co.za',
    phone: '0119876543',
  },
  bank_details: {
    bank_name: 'Standard Bank',
    account_number: '27000000003',
    account_type: 'Cheque',
    account_verified: true,
    account_age_days: 3650,
  },
  physical_address: {
    street: '123 Corrupt Street',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
  },
  commodity_codes: ['01010101', '01010104'],
  directors_id_numbers: ['8001015000087', '7505055000089'],
  risk_flags: [
    'CSD status: SUSPENDED — pending SIU investigation',
    'Tax non-compliant — TCS lapsed August 2024',
    'B-BBEE certificate not verified',
    'Shell company — no employees, no physical operations',
    'Director linked to 2 other flagged entities',
    'Beneficial owner is PEP-linked individual',
  ],
  overall_risk: 'CRITICAL',
  eligible_to_bid: false,
  ineligibility_reasons: [
    'CSD status is SUSPENDED — ineligible for any government procurement',
    'Tax Clearance Certificate not valid',
    'B-BBEE status unverified',
  ],
};

// ─── MAAA0000004 — Meridian Procurement Holdings CC ──────────────────────────
export const csdMeridian: CSDProfile = {
  csd_supplier_no: 'MAAA0000004',
  supplier_name: 'Meridian Procurement Holdings CC',
  cipc_reg_no: '2019/112233/07',
  registration_date: '2019-09-15',
  status: 'Registered',
  verification_status: {
    bank_details: 'Verified',
    tax_compliance: 'Verified',
    b_bbee: 'Pending',
    cipc_registration: 'Verified',
  },
  tax_compliance_status: 'compliant',
  b_bbee_level: 'Level 2',
  contact_person: {
    name: 'Jane Doe',
    email: 'jane.doe@meridianholdings.co.za',
    phone: '0121234567',
  },
  bank_details: {
    bank_name: 'Nedbank',
    account_number: '19000000004',
    account_type: 'Current',
    account_verified: true,
    account_age_days: 1825,
  },
  physical_address: {
    street: '123 Corrupt Street',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
  },
  commodity_codes: ['01010101', '01010102'],
  directors_id_numbers: ['8001015000087', '7505055000089'],
  risk_flags: [
    'Shares registered address with CorruptCo and Inflated Goods',
    'Directors are the same individuals as CorruptCo — network entity',
    'B-BBEE certificate pending verification',
    'Revenue declared (R180k/yr) insufficient for contract values bid',
  ],
  overall_risk: 'HIGH',
  eligible_to_bid: false,
  ineligibility_reasons: [
    'B-BBEE status unverified — cannot score preference points',
    'Financial viability check failed — revenue insufficient for contract scope',
  ],
};

// ─── Aggregated export ────────────────────────────────────────────────────────
export const allCSDProfiles: CSDProfile[] = [
  csdHonestSupplies,
  csdInflatedGoods,
  csdCorruptCo,
  csdMeridian,
];

export function getCSDProfile(csdSupplierNo: string): CSDProfile | undefined {
  return allCSDProfiles.find(p => p.csd_supplier_no === csdSupplierNo);
}

export function getCSDProfileByName(name: string): CSDProfile | undefined {
  return allCSDProfiles.find(p =>
    p.supplier_name.toLowerCase().includes(name.toLowerCase())
  );
}

export function getEligibleSuppliers(): CSDProfile[] {
  return allCSDProfiles.filter(p => p.eligible_to_bid);
}

export function getIneligibleSuppliers(): CSDProfile[] {
  return allCSDProfiles.filter(p => !p.eligible_to_bid);
}

// ─── High-Fidelity Mock Data — Central Index ─────────────────────────────────
// Re-exports all mock data sources and provides cross-reference utilities.
// Based on: SentinelProcure AI High-Fidelity Mocking Guide for MVP

export * from './mockData_cipc';
export * from './mockData_sars';
export * from './mockData_csd';
export * from './mockData_bbbee';
export * from './mockData_etender';

import { allCIPCProfiles, getCIPCProfile, getCompaniesByDirector } from './mockData_cipc';
import { allSARSProfiles, getSARSProfile } from './mockData_sars';
import { allCSDProfiles, getCSDProfile } from './mockData_csd';
import { allBBBEEProfiles, getBBBEEProfile } from './mockData_bbbee';
import { allETenders, getTendersBySupplier } from './mockData_etender';

// ─── Cross-Reference: Full Supplier Dossier ───────────────────────────────────
// Assembles a complete picture of a supplier from all data sources

export interface SupplierDossier {
  csd_supplier_no: string;
  supplier_name: string;
  cipc: ReturnType<typeof getCIPCProfile>;
  sars: ReturnType<typeof getSARSProfile>;
  csd: ReturnType<typeof getCSDProfile>;
  bbbee: ReturnType<typeof getBBBEEProfile>;
  tenders: ReturnType<typeof getTendersBySupplier>;
  // Derived composite risk
  composite_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  composite_risk_reasons: string[];
}

export function buildSupplierDossier(csdSupplierNo: string): SupplierDossier | null {
  const csd = getCSDProfile(csdSupplierNo);
  if (!csd) return null;

  const cipc = getCIPCProfile(csd.cipc_reg_no);
  const sars = getSARSProfile(csdSupplierNo);
  const bbbee = getBBBEEProfile(csdSupplierNo);
  const tenders = getTendersBySupplier(csdSupplierNo);

  // Derive composite risk
  const reasons: string[] = [];
  let riskScore = 0;

  if (sars?.tcs_status === 'non-compliant') {
    riskScore += 30;
    reasons.push('SARS non-compliant — tax clearance invalid');
  }
  if (bbbee?.fronting_risk === 'CONFIRMED') {
    riskScore += 40;
    reasons.push('B-BBEE fronting confirmed — certificate fraudulent');
  } else if (bbbee?.fronting_risk === 'HIGH') {
    riskScore += 20;
    reasons.push('B-BBEE fronting risk HIGH — under investigation');
  }
  if (cipc?.shell_indicator) {
    riskScore += 25;
    reasons.push('Shell company indicator — no employees or physical operations');
  }
  if (cipc?.pep_linked) {
    riskScore += 30;
    reasons.push('PEP-linked — beneficial owner connected to politically exposed person');
  }
  if (csd.status === 'Suspended') {
    riskScore += 35;
    reasons.push('CSD status SUSPENDED — ineligible for procurement');
  }
  if (!csd.eligible_to_bid) {
    riskScore += 20;
    reasons.push(...csd.ineligibility_reasons);
  }

  const composite_risk: SupplierDossier['composite_risk'] =
    riskScore >= 60 ? 'CRITICAL' :
    riskScore >= 40 ? 'HIGH' :
    riskScore >= 20 ? 'MEDIUM' : 'LOW';

  return {
    csd_supplier_no: csdSupplierNo,
    supplier_name: csd.supplier_name,
    cipc,
    sars,
    csd,
    bbbee,
    tenders,
    composite_risk,
    composite_risk_reasons: reasons,
  };
}

// ─── Network Analysis: Find all entities linked to a director ─────────────────
export function buildDirectorNetwork(idNumber: string) {
  const companies = getCompaniesByDirector(idNumber);
  const csdProfiles = companies
    .map(c => allCSDProfiles.find(p => p.cipc_reg_no === c.company_reg_no))
    .filter(Boolean);

  return {
    director_id: idNumber,
    director_name: companies[0]?.directors.find(d => d.id_number === idNumber)?.full_name ?? 'Unknown',
    companies,
    csd_profiles: csdProfiles,
    total_companies: companies.length,
    shell_companies: companies.filter(c => c.shell_indicator).length,
    pep_linked: companies.some(c => c.pep_linked),
    risk_level: companies.length >= 3 ? 'CRITICAL' : companies.length >= 2 ? 'HIGH' : 'LOW',
  };
}

// ─── Summary Statistics ───────────────────────────────────────────────────────
export const mockDataSummary = {
  cipc: {
    total: allCIPCProfiles.length,
    shell_companies: allCIPCProfiles.filter(c => c.shell_indicator).length,
    pep_linked: allCIPCProfiles.filter(c => c.pep_linked).length,
  },
  sars: {
    total: allSARSProfiles.length,
    non_compliant: allSARSProfiles.filter(s => s.tcs_status === 'non-compliant').length,
    high_risk: allSARSProfiles.filter(s => s.financial_risk_score === 'high').length,
  },
  csd: {
    total: allCSDProfiles.length,
    verified: allCSDProfiles.filter(c => c.status === 'Verified').length,
    suspended: allCSDProfiles.filter(c => c.status === 'Suspended').length,
    ineligible: allCSDProfiles.filter(c => !c.eligible_to_bid).length,
  },
  bbbee: {
    total: allBBBEEProfiles.length,
    fronting_confirmed: allBBBEEProfiles.filter(b => b.fronting_risk === 'CONFIRMED').length,
    fronting_high: allBBBEEProfiles.filter(b => b.fronting_risk === 'HIGH').length,
    unaccredited_agency: allBBBEEProfiles.filter(b => !b.agency_accredited).length,
  },
  etenders: {
    total: allETenders.length,
    rigged: allETenders.filter(t => t.ai_spec_rigging_detected).length,
    critical: allETenders.filter(t => t.ai_risk_level === 'CRITICAL').length,
    blocked_bids: allETenders.flatMap(t => t.bids).filter(b => b.recommended_action === 'Block').length,
  },
};

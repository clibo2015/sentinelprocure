// ─── CIPC (Companies and Intellectual Property Commission) Mock Data ──────────
// Story: CorruptCo (Pty) Ltd is a front company. John Doe is the corrupt official's
// associate. HonestSupplies (Pty) Ltd is the legitimate competitor.

export interface CIPCDirector {
  id_number: string;
  full_name: string;
  appointment_date: string;
  status: 'Active' | 'Resigned' | 'Disqualified';
  linked_companies: string[];
}

export interface CIPCBeneficialOwner {
  id_number: string;
  full_name: string;
  ownership_percentage: number;
  date_of_ownership: string;
}

export interface CIPCAddress {
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface CIPCCompanyProfile {
  company_reg_no: string;
  company_name: string;
  registration_date: string;
  status: 'Active' | 'Deregistered' | 'In Liquidation';
  physical_address: CIPCAddress;
  postal_address?: CIPCAddress;
  directors: CIPCDirector[];
  beneficial_owners: CIPCBeneficialOwner[];
  // Derived / enriched fields for UI
  risk_flags: string[];
  shell_indicator: boolean;
  pep_linked: boolean;
}

// ─── CorruptCo (Pty) Ltd — Front / Shell Company ─────────────────────────────
export const cipcCorruptCo: CIPCCompanyProfile = {
  company_reg_no: '2015/123456/07',
  company_name: 'CorruptCo (Pty) Ltd',
  registration_date: '2015-06-01',
  status: 'Active',
  physical_address: {
    street: '123 Corrupt Street',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
  },
  postal_address: {
    street: 'P.O. Box 9999',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
  },
  directors: [
    {
      id_number: '8001015000087',
      full_name: 'John Doe',
      appointment_date: '2015-06-01',
      status: 'Active',
      // John Doe is director of 3 companies — classic shell network
      linked_companies: ['2015/123456/07', '2018/987654/07', '2019/112233/07'],
    },
    {
      id_number: '7505055000089',
      full_name: 'Jane Doe',
      appointment_date: '2015-06-01',
      status: 'Active',
      linked_companies: ['2015/123456/07', '2019/112233/07'],
    },
  ],
  beneficial_owners: [
    {
      id_number: '8001015000087',
      full_name: 'John Doe',
      ownership_percentage: 60,
      date_of_ownership: '2015-06-01',
    },
    {
      id_number: '7505055000089',
      full_name: 'Jane Doe',
      ownership_percentage: 40,
      date_of_ownership: '2015-06-01',
    },
  ],
  risk_flags: [
    'Director (John Doe) linked to 2 additional companies',
    'Registered address matches Inflated Goods (Pty) Ltd',
    'No employees on record — shell company indicator',
    'Beneficial owner (John Doe) is spouse of DPW procurement official',
  ],
  shell_indicator: true,
  pep_linked: true,
};

// ─── Inflated Goods (Pty) Ltd — Non-Compliant / High-Risk Supplier ────────────
export const cipcInflatedGoods: CIPCCompanyProfile = {
  company_reg_no: '2018/987654/07',
  company_name: 'Inflated Goods (Pty) Ltd',
  registration_date: '2018-03-01',
  status: 'Active',
  physical_address: {
    street: '123 Corrupt Street',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
  },
  directors: [
    {
      id_number: '8001015000087',
      full_name: 'John Doe',
      appointment_date: '2018-03-01',
      status: 'Active',
      linked_companies: ['2015/123456/07', '2018/987654/07', '2019/112233/07'],
    },
  ],
  beneficial_owners: [
    {
      id_number: '8001015000087',
      full_name: 'John Doe',
      ownership_percentage: 100,
      date_of_ownership: '2018-03-01',
    },
  ],
  risk_flags: [
    'Shares registered address with CorruptCo (Pty) Ltd',
    'Sole director (John Doe) is beneficial owner of CorruptCo',
    'Tax non-compliant — SARS TCS expired',
    'B-BBEE certificate under investigation for fronting',
  ],
  shell_indicator: true,
  pep_linked: true,
};

// ─── Shell Holding Co — Third layer in the network ───────────────────────────
export const cipcShellHolding: CIPCCompanyProfile = {
  company_reg_no: '2019/112233/07',
  company_name: 'Meridian Procurement Holdings CC',
  registration_date: '2019-09-15',
  status: 'Active',
  physical_address: {
    street: '123 Corrupt Street',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
  },
  directors: [
    {
      id_number: '8001015000087',
      full_name: 'John Doe',
      appointment_date: '2019-09-15',
      status: 'Active',
      linked_companies: ['2015/123456/07', '2018/987654/07', '2019/112233/07'],
    },
    {
      id_number: '7505055000089',
      full_name: 'Jane Doe',
      appointment_date: '2019-09-15',
      status: 'Active',
      linked_companies: ['2015/123456/07', '2019/112233/07'],
    },
  ],
  beneficial_owners: [
    {
      id_number: '8001015000087',
      full_name: 'John Doe',
      ownership_percentage: 51,
      date_of_ownership: '2019-09-15',
    },
    {
      id_number: '7505055000089',
      full_name: 'Jane Doe',
      ownership_percentage: 49,
      date_of_ownership: '2019-09-15',
    },
  ],
  risk_flags: [
    'Third company sharing same director and address as CorruptCo and Inflated Goods',
    'Registered 4 years after CorruptCo — network expansion pattern',
    'No trading history or revenue on record',
  ],
  shell_indicator: true,
  pep_linked: true,
};

// ─── HonestSupplies (Pty) Ltd — Legitimate Supplier ──────────────────────────
export const cipcHonestSupplies: CIPCCompanyProfile = {
  company_reg_no: '2020/789012/07',
  company_name: 'HonestSupplies (Pty) Ltd',
  registration_date: '2020-01-10',
  status: 'Active',
  physical_address: {
    street: '456 Integrity Avenue',
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '2000',
  },
  directors: [
    {
      id_number: '8502025000086',
      full_name: 'Peter Smith',
      appointment_date: '2020-01-10',
      status: 'Active',
      linked_companies: [],
    },
  ],
  beneficial_owners: [
    {
      id_number: '8502025000086',
      full_name: 'Peter Smith',
      ownership_percentage: 100,
      date_of_ownership: '2020-01-10',
    },
  ],
  risk_flags: [],
  shell_indicator: false,
  pep_linked: false,
};

// ─── Aggregated export ────────────────────────────────────────────────────────
export const allCIPCProfiles: CIPCCompanyProfile[] = [
  cipcCorruptCo,
  cipcInflatedGoods,
  cipcShellHolding,
  cipcHonestSupplies,
];

/** Resolve a company by registration number */
export function getCIPCProfile(regNo: string): CIPCCompanyProfile | undefined {
  return allCIPCProfiles.find(p => p.company_reg_no === regNo);
}

/** Find all companies where a given ID number appears as director */
export function getCompaniesByDirector(idNumber: string): CIPCCompanyProfile[] {
  return allCIPCProfiles.filter(p =>
    p.directors.some(d => d.id_number === idNumber)
  );
}

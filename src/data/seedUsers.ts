import { type UserRole } from './securityData2';
import { type Page } from '../components/Sidebar';

export interface SeedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  password?: string;
}

export const seedUsers: SeedUser[] = [
  {
    id: 'U_WC_01',
    email: 'executive@westerncape.gov.za',
    name: 'MEC for Finance (WC)',
    role: 'TREASURY_EXEC',
    department: 'WC Provincial Treasury',
    password: 'SecurePass123!'
  },
  {
    id: 'U_AG_01',
    email: 'provincial.executive@agsa.gov.za',
    name: 'AG Regional Executive (WC)',
    role: 'AG_EXEC',
    department: 'Auditor-General SA (Cape Town)',
    password: 'SecurePass123!'
  },
  {
    id: 'U_AN_01',
    email: 'analyst@westerncape.gov.za',
    name: 'Lead Data Analyst',
    role: 'ANALYST',
    department: 'WC Governance Intelligence Unit',
    password: 'SecurePass123!'
  },
  {
    id: 'U_SYS_01',
    email: 'admin@ce-i.gov.za',
    name: 'Ce-I System Admin',
    role: 'SYSTEM_ADMIN',
    department: 'Centre for e-Innovation (WC)',
    password: 'SecurePass123!'
  },
  {
    id: 'U_SIU_01',
    email: 'investigator@siu.org.za',
    name: 'SIU WC Liaison',
    role: 'SIU_LIAISON',
    department: 'Special Investigating Unit (Western Cape)',
    password: 'SecurePass123!'
  }
];

// RBAC Page Mappings
// Determines which pages each role can access. TREASURY_EXEC and AG_EXEC have a wildcard '*' for all pages.
export const rolePageAccess: Record<UserRole, Page[] | '*'> = {
  TREASURY_EXEC: '*',
  AG_EXEC: '*',
  
  ANALYST: [
    'dashboard', 'red-flags', 'tenders', 'vendors', 'price-benchmark', 
    'ownership-graph', 'supplier-intelligence'
  ],
  
  SIU_LIAISON: [
    'dashboard', 'enforcement', 'whistleblower', 'insider-threat', 
    'financial-flow', 'award-enforcement'
  ],
  
  SYSTEM_ADMIN: [
    'dashboard', 'agents', 'access-control'
  ],
  
  SCM_OFFICER: [
    'dashboard', 'tenders', 'contracts', 'variation-orders', 
    'emergency-procurement', 'subcontractor-chain'
  ],

  ACCOUNTING_OFFICER: [
    'dashboard', 'executive', 'conflict-of-interest', 'transparency'
  ],

  AUDITOR: [
    'dashboard', 'transparency', 'conflict-of-interest', 'financial-flow', 
    'subcontractor-chain', 'variation-orders'
  ]
};

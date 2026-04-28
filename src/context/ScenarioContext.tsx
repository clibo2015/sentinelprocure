import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Tender, RedFlag, Vendor } from '../data/mockData';
import type { PriceAlert, OwnershipGraph, BidSubmission } from '../data/extendedData';

export type ScenarioId = 'SCENARIO_1' | 'SCENARIO_2' | 'SCENARIO_3' | 'SCENARIO_4' | 'NONE';

interface ScenarioData {
  tenders: Tender[];
  redFlags: RedFlag[];
  priceAlerts: PriceAlert[];
  ownershipGraphs: OwnershipGraph[];
  bidSubmissions: BidSubmission[];
  vendors: Vendor[];
}

interface ScenarioContextType {
  activeScenario: ScenarioId;
  activateScenario: (id: ScenarioId) => void;
  scenarioData: ScenarioData | null;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('NONE');

  const getScenarioData = (id: ScenarioId): ScenarioData | null => {
    switch (id) {
      case 'SCENARIO_1':
        return {
          tenders: [{
            id: 'T_SCEN_1',
            reference: 'DP/PSA/2026/001',
            title: 'Supply of Standard Office Furniture',
            department: 'WC Provincial Treasury',
            value: 257500,
            status: 'CLEARED',
            riskScore: 12,
            riskLevel: 'LOW',
            flags: [],
            submittedDate: '2026-04-20',
            closingDate: '2026-05-20',
            province: 'Western Cape',
            category: 'Office Supplies',
            biddersCount: 2,
            integrityScore: 94,
          }],
          redFlags: [],
          priceAlerts: [],
          ownershipGraphs: [],
          bidSubmissions: [
            {
              id: 'BS_SCEN_1_1',
              tenderRef: 'DP/PSA/2026/001',
              tenderTitle: 'Supply of Standard Office Furniture',
              vendorName: 'HonestSupplies (Pty) Ltd',
              vendorCSD: 'MAAA0000001',
              submittedAt: '2026-05-18T10:00:00Z',
              totalBidValue: 250000,
              aiValidationScore: 92,
              validationFlags: [],
              status: 'PASSED',
              evaluationStage: 'COMPLETE',
              boqItems: [
                { description: 'Office Desk', qty: 50, unitPrice: 1500, benchmarkPrice: 1550, flagged: false },
                { description: 'Office Chair', qty: 100, unitPrice: 1000, benchmarkPrice: 1050, flagged: false },
                { description: 'Filing Cabinet', qty: 30, unitPrice: 800, benchmarkPrice: 850, flagged: false },
              ]
            },
            {
              id: 'BS_SCEN_1_2',
              tenderRef: 'DP/PSA/2026/001',
              tenderTitle: 'Supply of Standard Office Furniture',
              vendorName: 'Quality Office Solutions (Pty) Ltd',
              vendorCSD: 'MAAA0000003',
              submittedAt: '2026-05-19T14:30:00Z',
              totalBidValue: 265000,
              aiValidationScore: 88,
              validationFlags: [],
              status: 'PASSED',
              evaluationStage: 'COMPLETE',
              boqItems: [
                { description: 'Office Desk', qty: 50, unitPrice: 1600, benchmarkPrice: 1550, flagged: false },
                { description: 'Office Chair', qty: 100, unitPrice: 1100, benchmarkPrice: 1050, flagged: false },
                { description: 'Filing Cabinet', qty: 30, unitPrice: 850, benchmarkPrice: 850, flagged: false },
              ]
            }
          ],
          vendors: [
            {
              id: 'V_SCEN_1_1',
              name: 'Quality Office Solutions (Pty) Ltd',
              cipcNumber: '2021/777888/07',
              csdNumber: 'MAAA0000003',
              reputationScore: 82,
              riskLevel: 'LOW',
              activeContracts: 2,
              totalContractValue: 1200000,
              flags: [],
              bbbeeLevel: 2,
              province: 'Western Cape',
              sector: 'Office Supplies',
              legalStatus: 'COMPLIANT',
              taxCompliant: true,
              pastPerformance: 85
            }
          ]
        };

      case 'SCENARIO_2':
        return {
          tenders: [{
            id: 'T_SCEN_2',
            reference: 'WCG/HEALTH/2026/002',
            title: 'Procurement of Specialized Safety Equipment',
            department: 'WC Dept. of Health & Wellness',
            value: 8450000,
            status: 'FLAGGED',
            riskScore: 98,
            riskLevel: 'CRITICAL',
            flags: ['Price Padding', 'SARS Non-Compliant', 'Single-Source Pattern'],
            submittedDate: '2026-04-10',
            closingDate: '2026-05-10',
            province: 'Western Cape',
            category: 'Safety Equipment',
            biddersCount: 2,
            integrityScore: 8,
          }],
          redFlags: [
            {
              id: 'RF_SCEN_2_1',
              tenderId: 'T_SCEN_2',
              tenderRef: 'ESK/SAFE/2026/002',
              type: 'Inflated Pricing',
              severity: 'CRITICAL',
              description: 'Knee guards quoted at R80,000 per unit. Market benchmark is R450. Markup: 17,677%.',
              detectedAt: '2026-05-08T09:00:00Z',
              agentName: 'Price-Benchmark-Guardian',
              evidence: 'Cross-reference: Builders Warehouse (R320), Seton (R380), Government Benchmark (R450).',
              status: 'OPEN'
            },
            {
              id: 'RF_SCEN_2_2',
              tenderId: 'T_SCEN_2',
              tenderRef: 'ESK/SAFE/2026/002',
              type: 'Tax Non-Compliance',
              severity: 'HIGH',
              description: 'Winning bidder "Inflated Goods (Pty) Ltd" has a revoked tax clearance status with SARS.',
              detectedAt: '2026-05-08T09:05:00Z',
              agentName: 'SARS-Compliance-Agent',
              evidence: 'SARS Real-time API: STATUS_REVOKED. Outstanding debt: R1.2M.',
              status: 'OPEN'
            }
          ],
          priceAlerts: [
            {
              id: 'PA_SCEN_2_1',
              tenderId: 'T_SCEN_2',
              tenderRef: 'ESK/SAFE/2026/002',
              itemDescription: 'Welding Knee Guards (PPE)',
              quotedPrice: 80000,
              retailPrice: 320,
              govBenchmark: 450,
              internationalBenchmark: 380,
              markupPercent: 17677,
              severity: 'CRITICAL',
              status: 'BLOCKED',
              detectedAt: '2026-05-08T09:00:00Z',
              realWorldExample: 'WC Health Knee Guard Audit (Simulation)'
            }
          ],
          ownershipGraphs: [],
          bidSubmissions: [
            {
              id: 'BS_SCEN_2_1',
              tenderRef: 'ESK/SAFE/2026/002',
              tenderTitle: 'Procurement of Specialized Safety Equipment',
              vendorName: 'Inflated Goods (Pty) Ltd',
              vendorCSD: 'MAAA0000002',
              submittedAt: '2026-05-08T10:00:00Z',
              totalBidValue: 8000000,
              aiValidationScore: 4,
              validationFlags: ['Extreme price markup', 'Tax non-compliant', 'CSD address mismatch'],
              status: 'REJECTED',
              evaluationStage: 'ADMIN_COMPLIANCE',
              boqItems: [
                { description: 'Welding Knee Guards', qty: 100, unitPrice: 80000, benchmarkPrice: 450, flagged: true },
                { description: 'Specialized Gloves', qty: 100, unitPrice: 5000, benchmarkPrice: 350, flagged: true },
              ]
            }
          ],
          vendors: [
            {
              id: 'V_SCEN_2_1',
              name: 'Inflated Goods (Pty) Ltd',
              cipcNumber: '2018/987654/07',
              csdNumber: 'MAAA0000002',
              reputationScore: 5,
              riskLevel: 'CRITICAL',
              activeContracts: 0,
              totalContractValue: 0,
              flags: ['Tax Fraud', 'Price Padding'],
              bbbeeLevel: 4,
              province: 'Gauteng',
              sector: 'Safety Equipment',
              legalStatus: 'SUSPENDED',
              taxCompliant: false,
              pastPerformance: 0
            }
          ]
        };

      case 'SCENARIO_3':
        return {
          tenders: [{
            id: 'T_SCEN_3',
            reference: 'WCG/INFRA/2026/003',
            title: 'IT Consulting Services for Digital Transformation',
            department: 'WC Dept. of Infrastructure',
            value: 15000000,
            status: 'FLAGGED',
            riskScore: 95,
            riskLevel: 'CRITICAL',
            flags: ['Beneficial Ownership Link', 'Conflict of Interest', 'Biased Specs'],
            submittedDate: '2026-04-05',
            closingDate: '2026-05-05',
            province: 'Western Cape',
            category: 'IT Services',
            biddersCount: 2,
            integrityScore: 12,
          }],
          redFlags: [
            {
              id: 'RF_SCEN_3_1',
              tenderId: 'T_SCEN_3',
              tenderRef: 'DCDT/IT/2026/003',
              type: 'Beneficial Ownership Link',
              severity: 'CRITICAL',
              description: 'Senior Procurement Manager Mr. S. Dlamini identified as 70% beneficial owner of Swift Solutions.',
              detectedAt: '2026-05-04T11:00:00Z',
              agentName: 'Ownership-Unmasking-AI',
              evidence: 'CIPC Beneficial Ownership Register vs PERSAL/WC-Staff match.',
              status: 'OPEN'
            },
            {
              id: 'RF_SCEN_3_2',
              tenderId: 'T_SCEN_3',
              tenderRef: 'DCDT/IT/2026/003',
              type: 'Specification Rigging',
              severity: 'HIGH',
              description: 'Tender requires "GovSys 3.0" certification, only held by Swift Solutions and two dormant entities.',
              detectedAt: '2026-05-04T11:05:00Z',
              agentName: 'Spec-Auditor-Agent',
              evidence: 'NLP analysis identifies proprietary terminology used exclusively in Swift Solutions sales deck.',
              status: 'OPEN'
            }
          ],
          priceAlerts: [],
          ownershipGraphs: [
            {
              vendorId: 'V_SCEN_3_1',
              vendorName: 'Swift Solutions (Pty) Ltd',
              pepLinked: true,
              officialLinked: true,
              shellLayers: 1,
              riskSummary: 'Direct conflict of interest. Ultimate beneficial owner is the Department\'s Senior Procurement Manager.',
              nodes: [
                { id: 'sc3_n1', label: 'Swift Solutions (Pty) Ltd', type: 'COMPANY', riskLevel: 'CRITICAL', details: 'CIPC: 2023/998877/07 · Bidder for IT Tender', flagged: true },
                { id: 'sc3_n2', label: 'Sipho Dlamini', type: 'OFFICIAL', riskLevel: 'CRITICAL', details: 'Senior Procurement Manager · DCDT · ID: 7007075000088', flagged: true },
                { id: 'sc3_n3', label: 'Nomusa Khumalo', type: 'PERSON', riskLevel: 'MEDIUM', details: 'Co-director · Likely proxy', flagged: false },
              ],
              edges: [
                { from: 'sc3_n2', to: 'sc3_n1', label: '70% Beneficial Owner', suspicious: true },
                { from: 'sc3_n3', to: 'sc3_n1', label: 'Director', suspicious: false },
                { from: 'sc3_n2', to: 'sc3_n1', label: 'Drafted Tender Specs', suspicious: true },
              ]
            }
          ],
          bidSubmissions: [
            {
              id: 'BS_SCEN_3_1',
              tenderRef: 'DCDT/IT/2026/003',
              tenderTitle: 'IT Consulting Services for Digital Transformation',
              vendorName: 'Swift Solutions (Pty) Ltd',
              vendorCSD: 'MAAA0000004',
              submittedAt: '2026-05-03T16:00:00Z',
              totalBidValue: 15000000,
              aiValidationScore: 11,
              validationFlags: ['Hidden beneficial owner is Dept Official', 'Biased technical certification'],
              status: 'ESCALATED',
              evaluationStage: 'ADMIN_COMPLIANCE',
              boqItems: []
            }
          ],
          vendors: [
            {
              id: 'V_SCEN_3_1',
              name: 'Swift Solutions (Pty) Ltd',
              cipcNumber: '2023/998877/07',
              csdNumber: 'MAAA0000004',
              reputationScore: 15,
              riskLevel: 'CRITICAL',
              activeContracts: 1,
              totalContractValue: 5000000,
              flags: ['Conflict of Interest', 'Fronting'],
              bbbeeLevel: 1,
              province: 'Western Cape',
              sector: 'IT Services',
              legalStatus: 'UNDER_INVESTIGATION',
              taxCompliant: false,
              pastPerformance: 40
            }
          ]
        };
      
      case 'SCENARIO_4':
        return {
          tenders: [{
            id: 'T_SCEN_4',
            reference: 'DBE/EDU/2026/004',
            title: 'Procurement of Foundation Phase Textbooks (National)',
            department: 'Dept. of Basic Education',
            value: 1600000000,
            status: 'FLAGGED',
            riskScore: 99,
            riskLevel: 'CRITICAL',
            flags: ['Impossible Track Record', 'Shell Company Suspected'],
            submittedDate: '2026-04-20',
            closingDate: '2026-05-15',
            province: 'National',
            category: 'Educational Materials',
            biddersCount: 1,
            integrityScore: 2,
          }],
          redFlags: [
            {
              id: 'RF_SCEN_4_1',
              tenderId: 'T_SCEN_4',
              tenderRef: 'DBE/EDU/2026/004',
              type: 'Impossible Track Record',
              severity: 'CRITICAL',
              description: 'Company "Lighthouse Publishers" bidding on R1.6 Billion tender was registered 3 days before tender advertisement.',
              detectedAt: '2026-05-14T08:00:00Z',
              agentName: 'CIPC-Registry-Monitor',
              evidence: 'CIPC Incorporation Date: 2026-04-17 vs Tender Published: 2026-04-20.',
              status: 'OPEN'
            },
            {
              id: 'RF_SCEN_4_2',
              tenderId: 'T_SCEN_4',
              tenderRef: 'DBE/EDU/2026/004',
              type: 'Shell Company Pattern',
              severity: 'CRITICAL',
              description: 'Zero registered employees on UIF database. Zero tax returns filed with SARS.',
              detectedAt: '2026-05-14T08:05:00Z',
              agentName: 'SARS-Compliance-Agent',
              evidence: 'Real-time UIF/SARS API cross-check: No physical footprint.',
              status: 'OPEN'
            }
          ],
          priceAlerts: [],
          ownershipGraphs: [],
          bidSubmissions: [
            {
              id: 'BS_SCEN_4_1',
              tenderRef: 'DBE/EDU/2026/004',
              tenderTitle: 'Procurement of Foundation Phase Textbooks',
              vendorName: 'Lighthouse Publishers (Pty) Ltd',
              vendorCSD: 'MAAA0000099',
              submittedAt: '2026-05-14T09:00:00Z',
              totalBidValue: 1600000000,
              aiValidationScore: 1,
              validationFlags: ['CIPC age too young for tender value', 'No UIF employees', 'Probable fronting shell'],
              status: 'REJECTED',
              evaluationStage: 'ADMIN_COMPLIANCE',
              boqItems: []
            }
          ],
          vendors: [
            {
              id: 'V_SCEN_4_1',
              name: 'Lighthouse Publishers (Pty) Ltd',
              cipcNumber: '2026/112233/07',
              csdNumber: 'MAAA0000099',
              reputationScore: 0,
              riskLevel: 'CRITICAL',
              activeContracts: 0,
              totalContractValue: 0,
              flags: ['Shell Company', 'Fronting'],
              bbbeeLevel: 1,
              province: 'National',
              sector: 'Educational Materials',
              legalStatus: 'SUSPENDED',
              taxCompliant: false,
              pastPerformance: 0
            }
          ]
        };
      default:
        return null;
    }
  };

  const activateScenario = useCallback((id: ScenarioId) => {
    setActiveScenario(id);
  }, []);

  const scenarioData = getScenarioData(activeScenario);

  return (
    <ScenarioContext.Provider value={{ activeScenario, activateScenario, scenarioData }}>
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
};

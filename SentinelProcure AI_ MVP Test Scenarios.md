# SentinelProcure AI: MVP Test Scenarios

This document outlines three distinct tender scenarios, each with associated mock data, designed to test the SentinelProcure AI system's ability to detect various forms of fraud and non-compliance. These scenarios leverage the mocking strategy detailed in the `mocking_guide.md` document.

## Scenario 1: Clean Tender (Legitimate)

**Objective:** To verify that SentinelProcure AI correctly identifies a legitimate tender and compliant bidders, allowing the process to proceed without unnecessary flags.

**Description:** A standard tender for office furniture issued by the Department of Public Service and Administration. Two legitimate companies submit bids, both are compliant with CIPC, SARS, and B-BBEE requirements, and their pricing is within reasonable market benchmarks.

**Key Files:**
*   **Tender Data:** `/home/ubuntu/mock_data/tenders/tender_scenario_1_clean.json`
*   **Supplier 1 (HonestSupplies (Pty) Ltd):**
    *   CIPC: `/home/ubuntu/mock_data/cipc/honest_supplies_profile.json` (already created in previous steps)
    *   CSD: `/home/ubuntu/mock_data/csd/MAAA0000001.json` (already created in previous steps)
    *   SARS: `/home/ubuntu/mock_data/sars/MAAA0000001.json` (already created in previous steps)
    *   B-BBEE: `/home/ubuntu/mock_data/b_bbee/MAAA0000001.json` (already created in previous steps)
*   **Supplier 2 (Quality Office Solutions (Pty) Ltd):**
    *   CIPC: `/home/ubuntu/mock_data/cipc/quality_office_solutions_profile.json` (newly created)
    *   CSD: `/home/ubuntu/mock_data/csd/MAAA0000003.json`
    *   SARS: `/home/ubuntu/mock_data/sars/MAAA0000003.json`
    *   B-BBEE: `/home/ubuntu/mock_data/b_bbee/MAAA0000003.json` (newly created)

## Scenario 2: Inflated Price Fraud Tender (Eskom Knee Guard Example)

**Objective:** To demonstrate SentinelProcure AI's **Dynamic Price Benchmarking** and **NLP Auditor** capabilities in detecting grossly inflated pricing and potentially rigged specifications.

**Description:** A tender for 
specialized safety equipment, reminiscent of the Eskom knee guard scandal. One bid is from a legitimate supplier with market-related prices, while another is from a potentially corrupt supplier with significantly inflated prices and a non-compliant tax status.

**Key Files:**
*   **Tender Data:** `/home/ubuntu/mock_data/tenders/tender_scenario_2_inflated_price.json`
*   **Supplier 1 (HonestSupplies (Pty) Ltd):** (Same as Scenario 1)
    *   CIPC: `/home/ubuntu/mock_data/cipc/honest_supplies_profile.json`
    *   CSD: `/home/ubuntu/mock_data/csd/MAAA0000001.json`
    *   SARS: `/home/ubuntu/mock_data/sars/MAAA0000001.json`
    *   B-BBEE: `/home/ubuntu/mock_data/b_bbee/MAAA0000001.json`
*   **Supplier 2 (Inflated Goods (Pty) Ltd):**
    *   CIPC: `/home/ubuntu/mock_data/cipc/corrupt_co_profile.json` (already created in previous steps)
    *   CSD: `/home/ubuntu/mock_data/csd/MAAA0000002.json` (already created in previous steps)
    *   SARS: `/home/ubuntu/mock_data/sars/MAAA0000002.json` (already created in previous steps)
    *   B-BBEE: `/home/ubuntu/mock_data/b_bbee/MAAA0000002.json` (already created in previous steps)

## Scenario 3: Friends and Family Fraud Tender (Beneficial Ownership Unmasking)

**Objective:** To test SentinelProcure AI's **Entity Resolution Engine** and **Beneficial Ownership Unmasking** capabilities in identifying hidden connections between a government official and a bidding company.

**Description:** A tender for IT consulting services. A government official (Mr. S. Dlamini) in the issuing department has a hidden beneficial ownership in one of the bidding companies, "Swift Solutions (Pty) Ltd." The tender specifications are subtly biased towards this company. The front company also has a non-compliant tax status.

**Key Files:**
*   **Tender Data:** `/home/ubuntu/mock_data/tenders/tender_scenario_3_friends_family_fraud.json`
*   **Corrupt Official Profile:** `/home/ubuntu/mock_data/cipc/corrupt_official_profile.json`
*   **Front Company (Swift Solutions (Pty) Ltd):**
    *   CIPC: `/home/ubuntu/mock_data/cipc/front_company_profile.json`
    *   CSD: `/home/ubuntu/mock_data/csd/MAAA0000004.json`
    *   SARS: `/home/ubuntu/mock_data/sars/MAAA0000004.json`
    *   B-BBEE: `/home/ubuntu/mock_data/b_bbee/MAAA0000004.json` (newly created)
*   **Legitimate Bidder (HonestSupplies (Pty) Ltd):** (Same as Scenario 1)
    *   CIPC: `/home/ubuntu/mock_data/cipc/honest_supplies_profile.json`
    *   CSD: `/home/ubuntu/mock_data/csd/MAAA0000001.json`
    *   SARS: `/home/ubuntu/mock_data/sars/MAAA0000001.json`
    *   B-BBEE: `/home/ubuntu/mock_data/b_bbee/MAAA0000001.json`


import React, { useState, useEffect } from 'react';
import { Sidebar, type Page } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { RedFlags } from './pages/RedFlags';
import { Tenders } from './pages/Tenders';
import { Vendors } from './pages/Vendors';
import { Agents } from './pages/Agents';
import { Whistleblower } from './pages/Whistleblower';
import { Contracts } from './pages/Contracts';
import { Transparency } from './pages/Transparency';
import { PriceBenchmark } from './pages/PriceBenchmark';
import { OwnershipGraph } from './pages/OwnershipGraph';
import { BidPortal } from './pages/BidPortal';
import { Enforcement } from './pages/Enforcement';
import { ExecutiveOversight } from './pages/ExecutiveOversight';
import { AccessControl } from './pages/AccessControl';
import { ConflictOfInterest } from './pages/ConflictOfInterest';
import { VariationOrders } from './pages/VariationOrders';
import { EmergencyProcurement } from './pages/EmergencyProcurement';
import { SubcontractorChain } from './pages/SubcontractorChain';
import { InsiderThreat } from './pages/InsiderThreat';
import { FinancialFlow } from './pages/FinancialFlow';
import { AwardEnforcement } from './pages/AwardEnforcement';
import { SupplierIntelligence } from './pages/SupplierIntelligence';
import { NavigationProvider } from './context/NavigationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScenarioProvider } from './context/ScenarioContext';
import { ScenarioSimulationPanel } from './components/ScenarioSimulationPanel';
import { rolePageAccess } from './data/seedUsers';
import { Login } from './pages/Login';
import { ShieldAlert } from 'lucide-react';

function ProtectedRoute({ page, children }: { page: Page, children: React.ReactNode }) {
  const { user, logPageAccess } = useAuth();
  
  useEffect(() => {
    if (user) {
      logPageAccess(page);
    }
  }, [page, user, logPageAccess]);

  if (!user) return <Login />;

  const allowedPages = rolePageAccess[user.role];
  const hasAccess = allowedPages === '*' || allowedPages.includes(page);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-grid">
        <ShieldAlert size={64} className="text-red-500 mb-4 opacity-80" />
        <h2 className="text-xl font-bold text-[#0f172a] mb-2">Access Restricted</h2>
        <p className="text-[#64748b] max-w-md">
          Your current clearance level ({user.role}) does not permit access to this module. 
          Please contact National Treasury systems administration if you require access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

function PageContent({ page }: { page: Page }) {
  switch (page) {
    case 'dashboard':              return <Dashboard />;
    case 'red-flags':              return <RedFlags />;
    case 'tenders':                return <Tenders />;
    case 'vendors':                return <Vendors />;
    case 'price-benchmark':        return <PriceBenchmark />;
    case 'ownership-graph':        return <OwnershipGraph />;
    case 'bid-portal':             return <BidPortal />;
    case 'agents':                 return <Agents />;
    case 'whistleblower':          return <Whistleblower />;
    case 'contracts':              return <Contracts />;
    case 'enforcement':            return <Enforcement />;
    case 'executive':              return <ExecutiveOversight />;
    case 'transparency':           return <Transparency />;
    case 'access-control':         return <AccessControl />;
    case 'conflict-of-interest':   return <ConflictOfInterest />;
    case 'variation-orders':       return <VariationOrders />;
    case 'emergency-procurement':  return <EmergencyProcurement />;
    case 'subcontractor-chain':    return <SubcontractorChain />;
    case 'insider-threat':         return <InsiderThreat />;
    case 'financial-flow':         return <FinancialFlow />;
    case 'award-enforcement':      return <AwardEnforcement />;
    case 'supplier-intelligence':  return <SupplierIntelligence />;
    default:                       return <Dashboard />;
  }
}

function AppContent() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <NavigationProvider onNavigate={setActivePage}>
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header activePage={activePage} />
          <main className="flex-1 overflow-y-auto scrollbar-gov">
            <ProtectedRoute page={activePage}>
              <PageContent page={activePage} />
            </ProtectedRoute>
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScenarioProvider>
        <AppContent />
        <ScenarioSimulationPanel />
      </ScenarioProvider>
    </AuthProvider>
  );
}

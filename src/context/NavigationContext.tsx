// ─── Navigation Context ───────────────────────────────────────────────────────
// Provides cross-page navigation so any page can deep-link into another.
// Used for Level 2 integration: Vendors → SupplierIntelligence, Tenders → BidPortal, etc.

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Page } from '../components/Sidebar';

interface NavigationState {
  /** Navigate to a page, optionally pre-selecting an entity by ID */
  navigateTo: (page: Page, entityId?: string) => void;
  /** The entity ID that was passed when navigating (consumed by the target page) */
  pendingEntityId: string | null;
  /** Clear the pending entity after it has been consumed */
  clearPendingEntity: () => void;
}

const NavigationContext = createContext<NavigationState>({
  navigateTo: () => {},
  pendingEntityId: null,
  clearPendingEntity: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}

interface NavigationProviderProps {
  children: ReactNode;
  onNavigate: (page: Page) => void;
}

export function NavigationProvider({ children, onNavigate }: NavigationProviderProps) {
  const [pendingEntityId, setPendingEntityId] = useState<string | null>(null);

  const navigateTo = useCallback((page: Page, entityId?: string) => {
    if (entityId) setPendingEntityId(entityId);
    onNavigate(page);
  }, [onNavigate]);

  const clearPendingEntity = useCallback(() => setPendingEntityId(null), []);

  return (
    <NavigationContext.Provider value={{ navigateTo, pendingEntityId, clearPendingEntity }}>
      {children}
    </NavigationContext.Provider>
  );
}

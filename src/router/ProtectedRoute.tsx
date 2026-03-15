import { useEffect, useState, type ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  // Start in initializing state — don't redirect until restoreSession completes
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    restoreSession().finally(() => setInitializing(false));
  // restoreSession is stable (created once by zustand), safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return (
      <div className="main-content">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that only renders its children on the client, not during SSR.
 * This prevents hydration mismatches and errors from browser-only code.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  // Use null as initial state to match SSR behavior
  const [isClient, setIsClient] = useState(false);

  // Effect runs only on client after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
}

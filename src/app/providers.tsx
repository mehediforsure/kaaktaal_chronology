'use client';

import { EngagementProvider } from '../context/EngagementProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <EngagementProvider>{children}</EngagementProvider>;
}

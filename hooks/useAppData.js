// hooks/useAppData.js
// ─── Live localStorage hook ───────────────────────────────────────────────────
// Reads from storage.get() and re-renders whenever any storage write fires
// the 'inklusijobs_storage_updated' event.
//
// Usage (in any component):
//   const { scoring, challenges, tracker, profile, job } = useAppData();

'use client';

import { useState, useEffect } from 'react';
import { storage, EMPTY_STATE } from '@/lib/storage';

export function useAppData() {
  const [data, setData] = useState(() => {
    // Safe SSR: return empty state on server, real state on client
    if (typeof window === 'undefined') return EMPTY_STATE;
    return storage.get();
  });

  useEffect(() => {
    // Sync on mount (handles SSR hydration)
    setData(storage.get());

    // Re-render whenever storage changes
    const handler = () => setData(storage.get());
    window.addEventListener('inklusijobs_storage_updated', handler);
    return () => window.removeEventListener('inklusijobs_storage_updated', handler);
  }, []);

  return data;
}
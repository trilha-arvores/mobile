import React, { createContext, useContext, useState } from 'react';

const SuspendedTrailContext = createContext(null);

export function SuspendedTrailProvider({ children }) {
  const [suspended, setSuspended] = useState(null);

  const suspendTrail = (trailState) => setSuspended(trailState);
  const clearSuspendedTrail = () => setSuspended(null);

  return (
    <SuspendedTrailContext.Provider value={{ suspended, suspendTrail, clearSuspendedTrail }}>
      {children}
    </SuspendedTrailContext.Provider>
  );
}

export const useSuspendedTrail = () => {
  const ctx = useContext(SuspendedTrailContext);
  if (!ctx) throw new Error('useSuspendedTrail must be used inside SuspendedTrailProvider');
  return ctx;
};
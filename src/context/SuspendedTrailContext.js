import React, { createContext, useContext, useState } from 'react';

const SuspendedTrailContext = createContext(null);

export function SuspendedTrailProvider({ children }) {
  const [suspended, setSuspended] = useState(null);

  // Salva o estado da trilha
  const suspendTrail = (trailState) => {
    console.log("Trilha suspensa salva:", trailState.trailId);
    setSuspended(trailState);
  };

  // Limpa o estado (usado ao finalizar ou reiniciar)
  const clearSuspendedTrail = () => {
    console.log("Trilha suspensa limpa");
    setSuspended(null);
  };

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
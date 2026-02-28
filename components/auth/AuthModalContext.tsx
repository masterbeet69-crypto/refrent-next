'use client';
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

type ModalMode = 'login' | 'register';

interface AuthModalContextValue {
  open: boolean;
  mode: ModalMode;
  openAuthModal: (mode?: ModalMode) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('login');

  const openAuthModal = useCallback((m: ModalMode = 'login') => {
    setMode(m);
    setOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setOpen(false);
    setMode('login'); // reset to default
  }, []);

  const value = useMemo(
    () => ({ open, mode, openAuthModal, closeAuthModal }),
    [open, mode, openAuthModal, closeAuthModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);

  if (ctx === null) {
    if (process.env.NODE_ENV === 'development') {
      // In dev, warn but don't throw (not-found.tsx uses Nav which uses this hook)
      console.warn('useAuthModal: no AuthModalProvider found, returning no-op fallback');
    }
    return {
      open: false,
      mode: 'login' as ModalMode,
      openAuthModal: () => {},
      closeAuthModal: () => {},
    };
  }

  return ctx;
}

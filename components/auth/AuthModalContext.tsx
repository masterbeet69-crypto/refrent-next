'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

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

  function openAuthModal(m: ModalMode = 'login') {
    setMode(m);
    setOpen(true);
  }

  function closeAuthModal() {
    setOpen(false);
  }

  return (
    <AuthModalContext.Provider value={{ open, mode, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

// Safe fallback when used outside provider (e.g., app/not-found.tsx)
export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  return ctx ?? {
    open: false,
    mode: 'login' as ModalMode,
    openAuthModal: () => {},
    closeAuthModal: () => {},
  };
}

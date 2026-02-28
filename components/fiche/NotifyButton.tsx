'use client';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { motion } from 'motion/react';

interface Props {
  propertyRef: string;
  status: string;
  isLoggedIn: boolean;
}

export function NotifyButton({ propertyRef, status, isLoggedIn }: Props) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openAuthModal } = useAuthModal();

  const isAvailable = status === 'available' || status === 'disponible' || status === 'Disponible';
  if (isAvailable) return null;

  async function handleClick() {
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/v1/alerts', {
        method: subscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref_code: propertyRef }),
      });
      setSubscribed(v => !v);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        backgroundColor: subscribed ? '#EAF2EC' : '#F7F5F2',
        color: subscribed ? '#2A5C45' : isLoggedIn ? '#5A5550' : '#8A5A00',
        border: `1px solid ${subscribed ? '#C6E1CC' : isLoggedIn ? '#E8E4DF' : '#FDE68A'}`,
      }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : subscribed ? (
        <BellOff className="w-4 h-4" />
      ) : (
        <Bell className="w-4 h-4" />
      )}
      <span>
        {subscribed
          ? 'Notification activée'
          : isLoggedIn
          ? 'Être notifié quand disponible'
          : 'Se connecter pour être notifié'}
      </span>
    </motion.button>
  );
}

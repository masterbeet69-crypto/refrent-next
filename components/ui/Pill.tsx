'use client';
import { motion } from 'motion/react';

type Status = 'disponible' | 'reserve' | 'occupe' | 'indisponible' | string;

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  disponible:    { bg: '#EAF2EC', text: '#2A5C45', dot: '#2A5C45', label: 'Disponible' },
  reserve:       { bg: '#FEF3CD', text: '#8A5A00', dot: '#8A5A00', label: 'Réservé' },
  occupe:        { bg: '#FDEDED', text: '#9B1C1C', dot: '#9B1C1C', label: 'Occupé' },
  indisponible:  { bg: '#F0EFEE', text: '#6B6560', dot: '#6B6560', label: 'Indisponible' },
  // French label keys
  'Disponible':   { bg: '#EAF2EC', text: '#2A5C45', dot: '#2A5C45', label: 'Disponible' },
  'Réservé':      { bg: '#FEF3CD', text: '#8A5A00', dot: '#8A5A00', label: 'Réservé' },
  'Occupé':       { bg: '#FDEDED', text: '#9B1C1C', dot: '#9B1C1C', label: 'Occupé' },
  'Indisponible': { bg: '#F0EFEE', text: '#6B6560', dot: '#6B6560', label: 'Indisponible' },
};

interface StatusPillProps {
  status: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function StatusPill({ status, showDot = true, size = 'md' }: StatusPillProps) {
  const cfg = statusConfig[status] ?? { bg: '#F0EFEE', text: '#6B6560', dot: '#6B6560', label: status };
  const isAvailable = status === 'disponible' || status === 'Disponible';

  return (
    <div
      className="inline-flex items-center gap-2 font-medium rounded-full"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        padding: size === 'sm' ? '2px 10px' : '6px 14px',
        fontSize: size === 'sm' ? '12px' : '14px',
      }}
    >
      {showDot && (
        isAvailable ? (
          <motion.span
            className="rounded-full inline-block"
            style={{ width: 8, height: 8, backgroundColor: cfg.dot }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : (
          <span
            className="rounded-full inline-block"
            style={{ width: 8, height: 8, backgroundColor: cfg.dot }}
          />
        )
      )}
      {cfg.label}
    </div>
  );
}

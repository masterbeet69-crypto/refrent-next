'use client';
import { motion } from 'motion/react';

type Status = 'disponible' | 'reserve' | 'occupe' | 'indisponible' | string;

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  disponible:    { bg: '#EAF2EC', text: '#2A5C45', dot: '#2A5C45', label: 'Disponible' },
  reserve:       { bg: '#FEF3CD', text: '#8A5A00', dot: '#8A5A00', label: 'Réservé' },
  occupe:        { bg: '#FDEDED', text: '#9B1C1C', dot: '#9B1C1C', label: 'Occupé' },
  indisponible:  { bg: '#F0EFEE', text: '#6B6560', dot: '#6B6560', label: 'Indisponible' },
  visiting:      { bg: '#EEF2FF', text: '#3730A3', dot: '#3730A3', label: 'En visite' },
  reserved:      { bg: '#FEF3CD', text: '#8A5A00', dot: '#8A5A00', label: 'Réservé' },
  occupied:      { bg: '#FDEDED', text: '#9B1C1C', dot: '#9B1C1C', label: 'Occupé' },
  available:     { bg: '#EAF2EC', text: '#2A5C45', dot: '#2A5C45', label: 'Disponible' },
  // French label keys
  'Disponible':   { bg: '#EAF2EC', text: '#2A5C45', dot: '#2A5C45', label: 'Disponible' },
  'Réservé':      { bg: '#FEF3CD', text: '#8A5A00', dot: '#8A5A00', label: 'Réservé' },
  'Occupé':       { bg: '#FDEDED', text: '#9B1C1C', dot: '#9B1C1C', label: 'Occupé' },
  'Indisponible': { bg: '#F0EFEE', text: '#6B6560', dot: '#6B6560', label: 'Indisponible' },
  'En visite':    { bg: '#EEF2FF', text: '#3730A3', dot: '#3730A3', label: 'En visite' },
};

interface StatusPillProps {
  status: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

const STATUS_PULSE_DURATION: Record<string, number> = {
  disponible:   1.5,
  available:    1.5,
  Disponible:   1.5,
  reserve:      2.5,
  reserved:     2.5,
  'Réservé':    2.5,
  occupied:     3,
  occupe:       3,
  'Occupé':     3,
  visiting:     2,
  'En visite':  2,
};

export function StatusPill({ status, showDot = true, size = 'md' }: StatusPillProps) {
  const cfg = statusConfig[status] ?? { bg: '#F0EFEE', text: '#6B6560', dot: '#6B6560', label: status };
  const duration = STATUS_PULSE_DURATION[status] ?? 2.5;

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
        <motion.span
          className="rounded-full inline-block"
          style={{ width: 8, height: 8, backgroundColor: cfg.dot }}
          animate={{ scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }}
          transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {cfg.label}
    </div>
  );
}

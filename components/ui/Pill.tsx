import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants/statuses';

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-rf text-xs font-medium
      ${STATUS_COLORS[status] ?? 'text-ink3 bg-bg2 border border-brd'}
    `.trim()}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

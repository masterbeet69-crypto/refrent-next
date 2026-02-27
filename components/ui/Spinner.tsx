import { Loader2 } from 'lucide-react';

export function Spinner({ size = 24 }: { size?: number }) {
  return <Loader2 width={size} height={size} className="animate-spin text-acc" />;
}

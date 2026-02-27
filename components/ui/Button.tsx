'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:   'bg-acc text-surf hover:bg-accd',
  secondary: 'bg-bg2 text-ink2 hover:bg-brd',
  ghost:     'bg-transparent text-ink3 hover:bg-bg2',
  danger:    'bg-err text-surf hover:bg-[#7a1b2a]',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', loading, children, disabled, className = '', ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2
        rounded-r2 font-sans text-sm font-medium transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-acc
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]} ${className}
      `.trim()}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

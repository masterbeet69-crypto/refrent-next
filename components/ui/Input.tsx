'use client';
import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-ink2">{label}</label>}
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-r2 border text-ink text-sm
          bg-surf border-brd placeholder:text-ink4
          focus:outline-none focus:border-acc focus:ring-1 focus:ring-acc
          transition-colors
          ${error ? 'border-err' : ''}
          ${className}
        `.trim()}
        {...props}
      />
      {error && <span className="text-xs text-err">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';

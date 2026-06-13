import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark border border-primary hover:border-primary-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(86,196,196,0.45)]',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 border border-secondary hover:-translate-y-0.5',
      outline: 'border border-primary text-primary hover:bg-primary hover:text-white bg-transparent hover:-translate-y-0.5',
      ghost: 'text-secondary hover:text-primary bg-transparent underline-offset-4 hover:underline',
      danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px]',
      md: 'px-6 py-2.5 text-[10px]',
      lg: 'px-9 py-3.5 text-[11px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

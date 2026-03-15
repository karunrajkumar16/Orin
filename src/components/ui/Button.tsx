import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-primary text-white hover:bg-[#5A3FE0] shadow-md hover:shadow-lg": variant === 'primary',
                        "border-2 border-primary text-primary hover:bg-lavender-light": variant === 'outline',
                        "hover:bg-gray-100 text-gray-700 hover:text-primary": variant === 'ghost',
                        "h-9 px-4 text-sm": size === 'sm',
                        "h-11 px-6 text-base": size === 'md',
                        "h-14 px-8 text-lg": size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };

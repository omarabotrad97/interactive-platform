import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'glass' | 'brutal';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800',
            elevated: 'bg-white shadow-xl shadow-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:border dark:border-gray-800',
            glass: 'bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl dark:bg-gray-900/80 dark:border-white/10',
            brutal: 'border-brutal rounded-3xl shadow-brutal-lg transition-all duration-200',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl p-6 transition-colors duration-200',
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('mb-4', className)} {...props} />
    )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn('text-xl font-semibold text-gray-900 dark:text-gray-100', className)} {...props} />
    )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)} {...props} />
    )
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props} />
    )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('mt-4 flex items-center', className)} {...props} />
    )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

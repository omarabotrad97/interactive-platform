import { cn } from '../../lib/utils';

interface BadgeProps {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
    className?: string;
    children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
    const variants = {
        default: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        outline: 'border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300',
        destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}

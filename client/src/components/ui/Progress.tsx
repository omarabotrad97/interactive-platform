import { cn } from '../../lib/utils';

interface ProgressProps {
    value: number;
    max?: number;
    className?: string;
    indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn("w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden", className)}>
            <div
                className={cn("bg-indigo-600 h-2.5 rounded-full transition-all duration-500", indicatorClassName)}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

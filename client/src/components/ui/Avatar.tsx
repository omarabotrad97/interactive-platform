import { cn } from '../../lib/utils';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    return (
        <div className={cn("relative inline-block", className)}>
            <div className={cn(
                "rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-950",
                sizeClasses[size]
            )}>
                {src ? (
                    <img
                        src={src}
                        alt={alt || fallback}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span>{fallback}</span>
                )}
            </div>
            {/* Online status indicator dot could go here */}
        </div>
    );
}

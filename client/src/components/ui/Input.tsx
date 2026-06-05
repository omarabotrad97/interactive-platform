import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, type, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
        const { lang } = useStore();
        const [showPassword, setShowPassword] = useState(false);

        const isPasswordType = type === 'password';
        const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        className={cn(
                            'w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20',
                            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-950',
                            isPasswordType && (lang === 'ar' ? 'pl-10' : 'pr-10'),
                            className
                        )}
                        {...props}
                    />
                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={cn(
                                "absolute inset-y-0 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors",
                                lang === 'ar' ? "left-3" : "right-3"
                            )}
                        >
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                    )}
                </div>
                {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
                {helperText && !error && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };

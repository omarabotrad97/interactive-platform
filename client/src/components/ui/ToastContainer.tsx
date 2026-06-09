import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export function ToastContainer() {
    const { toasts, removeToast, lang } = useStore();

    if (toasts.length === 0) return null;

    return (
        <div
            className={cn(
                "fixed bottom-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0 transition-all duration-300",
                lang === 'ar' 
                    ? "left-6 sm:left-6 animate-slide-in-left" 
                    : "right-6 sm:right-6 animate-slide-in-right"
            )}
            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
        >
            {toasts.map((toast) => {
                const isError = toast.type === 'error';
                const isSuccess = toast.type === 'success';
                const isInfo = toast.type === 'info';

                return (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform scale-100 hover:scale-[1.02]",
                            "bg-white/90 dark:bg-gray-950/90 text-gray-900 dark:text-gray-100",
                            isError && "border-red-500/30 dark:border-red-500/20 shadow-red-500/5",
                            isSuccess && "border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5",
                            isInfo && "border-amber-500/30 dark:border-amber-500/20 shadow-amber-500/5"
                        )}
                    >
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                            {isError && <AlertCircle className="w-5 h-5 text-red-500" />}
                            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            {isInfo && <Info className="w-5 h-5 text-amber-500" />}
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 text-sm font-medium leading-5">
                            {toast.message}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg p-0.5 hover:bg-gray-100 dark:hover:bg-gray-900"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Bottom animated indicator line */}
                        <div
                            className={cn(
                                "absolute bottom-0 inset-x-0 h-1 rounded-b-xl animate-shrink-width origin-left",
                                isError && "bg-red-500",
                                isSuccess && "bg-emerald-500",
                                isInfo && "bg-amber-500"
                            )}
                            style={{ animationDuration: '4000ms' }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

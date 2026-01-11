import { twMerge } from 'tailwind-merge';

interface BadgeProps {
    variant?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'LOW' | 'MEDIUM' | 'HIGH' | string;
    className?: string;
    children: React.ReactNode;
}

export function Badge({ variant, className, children }: BadgeProps) {
    const styles: Record<string, string> = {
        // Statuses
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50',
        RUNNING: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50',
        COMPLETED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
        FAILED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50',

        // Priorities
        LOW: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/30',
        MEDIUM: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-800/30',
        HIGH: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800/30',
    };

    const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    // Use upper case for key lookup to be safe
    const style = (variant && styles[variant.toUpperCase()]) || defaultStyle;

    return (
        <span className={twMerge('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', style, className)}>
            {children}
        </span>
    );
}

// Keep for backward compatibility if needed, but we should prefer Badge
export function StatusBadge({ status, className }: { status: string, className?: string }) {
    return <Badge variant={status} className={className}>{status}</Badge>;
}

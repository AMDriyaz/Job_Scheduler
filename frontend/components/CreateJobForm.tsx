import { useState } from 'react';

interface CreateJobFormProps {
    onSubmit: (taskName: string, priority: string, payload: Record<string, unknown>) => Promise<void>;
}

export function CreateJobForm({ onSubmit }: CreateJobFormProps) {
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [userId, setUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [jobOverview, setJobOverview] = useState('');
    const [timeline, setTimeline] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                userId,
                userEmail,
                overview: jobOverview,
                timeline
            };

            await onSubmit(taskName, priority, payload);
            // Reset form
            setTaskName('');
            setPriority('MEDIUM');
            setUserId('');
            setUserEmail('');
            setJobOverview('');
            setTimeline('');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create job';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-1">
            {/* Note: Shadow/Border handled by Modal container now, but keeping clean structure */}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">User ID</label>
                        <input
                            type="text"
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="block w-full rounded-lg border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 p-2.5 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all text-sm"
                            placeholder="e.g. U-12345"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">User Email</label>
                        <input
                            type="email"
                            required
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="block w-full rounded-lg border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 p-2.5 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all text-sm"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Task Name</label>
                    <input
                        type="text"
                        required
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="block w-full rounded-lg border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 p-2.5 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all text-sm"
                        placeholder="e.g. Process Order #123"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                    <div className="relative">
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="block w-full rounded-lg border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 p-2.5 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all text-sm appearance-none"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Job Overview</label>
                    <textarea
                        required
                        rows={3}
                        value={jobOverview}
                        onChange={(e) => setJobOverview(e.target.value)}
                        className="block w-full rounded-lg border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 p-2.5 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all text-sm"
                        placeholder="Describe the job task..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Timeline</label>
                    <input
                        type="text"
                        required
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="block w-full rounded-lg border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 p-2.5 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all text-sm"
                        placeholder="e.g. 24 hours, By Monday 5PM"
                    />
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-800/30 animate-fade-in">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                        </>
                    ) : (
                        'Create Job'
                    )}
                </button>
            </form>
        </div>
    );
}

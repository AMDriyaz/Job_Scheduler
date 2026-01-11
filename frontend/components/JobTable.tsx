import { useState } from 'react';
import { Job } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/Modal';

interface JobTableProps {
    jobs: Job[];
    onRun: (id: number) => void;
    isRunning: (id: number) => boolean;
}

export function JobTable({ jobs, onRun, isRunning }: JobTableProps) {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    return (
        <div className="overflow-x-auto h-full overflow-y-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payload</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {jobs.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                No jobs found
                            </td>
                        </tr>
                    ) : (
                        jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">#{job.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{job.taskName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Badge variant={job.priority}>{job.priority}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Badge variant={job.status}>{job.status}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate font-mono bg-gray-50/50 dark:bg-slate-900/50 rounded px-2 py-1 mx-6">
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 underline decoration-indigo-200 dark:decoration-indigo-700 underline-offset-2"
                                    >
                                        View Payload
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {job.status === 'PENDING' && (
                                        <button
                                            onClick={() => onRun(job.id)}
                                            disabled={isRunning(job.id)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 disabled:opacity-50 disabled:cursor-wait font-medium transition-colors"
                                        >
                                            {isRunning(job.id) ? (
                                                <span className="flex items-center gap-1">
                                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Running...
                                                </span>
                                            ) : 'Run Job'}
                                        </button>
                                    )}
                                    {job.status === 'COMPLETED' && <span className="text-green-600 dark:text-green-400">Done</span>}
                                    {job.status === 'FAILED' && <span className="text-red-500 dark:text-red-400">Failed</span>}
                                    {job.status === 'RUNNING' && <span className="text-indigo-500 dark:text-indigo-400 animate-pulse">Running...</span>}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Detail View Modal */}
            <Modal
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                title={`Job #${selectedJob?.id} Details`}
            >
                {selectedJob && (
                    <div className="space-y-4 text-gray-800 dark:text-gray-200">
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Task Name</h4>
                            <p className="text-lg">{selectedJob.taskName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Priority</h4>
                                <Badge variant={selectedJob.priority}>{selectedJob.priority}</Badge>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</h4>
                                <Badge variant={selectedJob.status}>{selectedJob.status}</Badge>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Payload Data</h4>
                            <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 border border-gray-100 dark:border-slate-700 overflow-x-auto max-h-60 custom-scrollbar">
                                <pre className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                    {JSON.stringify(selectedJob.payload, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Timestamps</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mt-1">
                                <li>Created: {new Date(selectedJob.createdAt).toLocaleString()}</li>
                                {selectedJob.completedAt && <li>Completed: {new Date(selectedJob.completedAt).toLocaleString()}</li>}
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

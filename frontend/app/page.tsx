'use client';

import { useEffect, useState, useCallback } from 'react';
import { jobService, Job } from '@/lib/api';
import { JobTable } from '@/components/JobTable';
import { CreateJobForm } from '@/components/CreateJobForm';
import { useTheme } from '@/components/ThemeProvider';
import { Modal } from '@/components/Modal';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [runningJobs, setRunningJobs] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [systemHealth, setSystemHealth] = useState<{ status: string; uptime: number } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const fetchJobs = useCallback(async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      setError(null);
      const filters: Record<string, string> = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const data = await jobService.getJobs(filters);
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      setError('Failed to refresh jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  const fetchHealth = useCallback(async () => {
    try {
      const health = await jobService.getHealth();
      setSystemHealth(health);
    } catch {
      setSystemHealth({ status: 'OFFLINE', uptime: 0 });
    }
  }, []);

  // Initial fetch only (and when filters change)
  useEffect(() => {
    fetchJobs();
    fetchHealth();
    // Poll health every 30s
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchJobs, fetchHealth, statusFilter, priorityFilter]);

  const handleCreateJob = async (taskName: string, priority: string, payload: Record<string, unknown>) => {
    try {
      await jobService.createJob(taskName, priority, payload);
      fetchJobs(true);
    } catch {
      alert('Failed to create job');
    }
  };

  const handleRunJob = async (id: number) => {
    try {
      setRunningJobs(prev => new Set(prev).add(id));
      await jobService.runJob(id);
      fetchJobs(false);
    } catch (error) {
      console.error('Failed to run job', error);
      alert('Failed to start job');
    } finally {
      setRunningJobs(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleManualRefresh = async () => {
    await fetchJobs(true);
    if (!error) {
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 font-sans bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="animate-fade-in text-center relative">
          <button
            onClick={toggleTheme}
            className="absolute right-0 top-0 p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-3">
            Job Scheduler <span className="text-indigo-600 dark:text-indigo-400">& Automation</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-slate-400">
            Orchestrate your background tasks with ease. Create jobs, track execution in real-time, and integrate via webhooks.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800/30 flex justify-between items-center animate-fade-in max-w-3xl mx-auto">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        {/* Action Bar & Stats */}
        <div className="flex flex-col items-center gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative inline-flex items-center justify-center p-4 px-8 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-indigo-600 rounded-full shadow-md group hover:bg-indigo-600 hover:text-white dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-600 group-hover:translate-x-0 ease">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-indigo-600 transition-all duration-300 transform group-hover:translate-x-full ease dark:text-indigo-400 dark:group-hover:text-white">Create New Job</span>
            <span className="relative invisible">Create New Job</span>
          </button>

          {/* System Status Bar */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm bg-white dark:bg-slate-800/50 backdrop-blur rounded-full px-8 py-3 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-slate-400 uppercase tracking-wide text-xs font-semibold">Server</span>
              <div className={`w-2 h-2 rounded-full ${systemHealth?.status === 'OK' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="font-medium text-gray-900 dark:text-white">{systemHealth?.status === 'OK' ? 'Online' : 'Offline'}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 self-center hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-slate-400 uppercase tracking-wide text-xs font-semibold">Uptime</span>
              <span className="font-medium text-gray-900 dark:text-white font-mono">{systemHealth ? new Date(systemHealth.uptime * 1000).toISOString().substr(11, 8) : '--:--:--'}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 self-center hidden sm:block"></div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}
            >
              <span className="text-gray-500 dark:text-slate-400 uppercase tracking-wide text-xs font-semibold">Total</span>
              <span className="font-bold text-gray-900 dark:text-white">{jobs.length}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 self-center hidden sm:block"></div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => setStatusFilter('RUNNING')}
            >
              <span className="text-gray-500 dark:text-slate-400 uppercase tracking-wide text-xs font-semibold">Active</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{runningJobs.size > 0 ? runningJobs.size : jobs.filter(j => j.status === 'RUNNING').length}</span>
            </div>
          </div>
        </div>

        {/* Main Content / Job List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px] animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30 dark:bg-slate-800">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Job History</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Real-time execution log</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-start sm:items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg border transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'}`}
                  title="Toggle Filters"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>

                {showFilters && (
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in">
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium w-full sm:w-40 cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="RUNNING">Running</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="appearance-none bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium w-full sm:w-40 cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {refreshSuccess && <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">Refreshed!</span>}
                <button
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="group flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className={`w-4 h-4 transition-transform ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-800">
            {/* Table Container */}
            {loading && jobs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p>Loading jobs...</p>
                </div>
              </div>
            ) : (
              <JobTable
                jobs={jobs}
                onRun={handleRunJob}
                isRunning={(id) => runningJobs.has(id)}
              />
            )}
          </div>
        </div>

        {/* Modal for Create Job */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Job"
        >
          <CreateJobForm onSubmit={async (taskName, priority, payload) => {
            await handleCreateJob(taskName, priority, payload);
            setIsCreateModalOpen(false);
          }} />
        </Modal>

      </div>
    </div>
  );
}

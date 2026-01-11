import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Job {
    id: number;
    taskName: string;
    payload: Record<string, unknown>;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}

export const jobService = {
    createJob: async (taskName: string, priority: string, payload: Record<string, unknown>) => {
        const response = await api.post<Job>('/jobs', { taskName, priority, payload });
        return response.data;
    },

    getJobs: async (filters?: { status?: string; priority?: string }) => {
        const response = await api.get<Job[]>('/jobs', { params: filters });
        return response.data;
    },

    runJob: async (id: number) => {
        const response = await api.post<{ message: string; jobId: number; status: string }>(`/run-job/${id}`);
        return response.data;
    },

    getHealth: async () => {
        const response = await api.get<{ status: string; uptime: number }>('/health');
        return response.data;
    }
};

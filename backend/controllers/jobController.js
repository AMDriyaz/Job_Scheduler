const { Job } = require('../models');
const JobStateMachine = require('../services/jobStateMachine');
const WebhookService = require('../services/webhookService');
const EmailService = require('../services/emailService');

exports.createJob = async (req, res) => {
    try {
        const { taskName, priority, payload } = req.body;
        if (!taskName) {
            return res.status(400).json({ error: 'taskName is required' });
        }

        const job = await Job.create({
            taskName,
            priority: priority || 'MEDIUM',
            payload: payload || {},
            status: 'PENDING'
        });

        res.status(201).json(job);
    } catch (error) {
        console.error('Create Job Error:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.priority) filters.priority = req.query.priority;

        const jobs = await Job.findAll({
            where: filters,
            order: [['createdAt', 'DESC']]
        });
        res.json(jobs);
    } catch (error) {
        console.error('Get Jobs Error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error) {
        console.error('Get Job by ID Error:', error);
        res.status(500).json({ error: 'Failed to fetch job' });
    }
};

exports.runJob = async (req, res) => {
    const jobId = req.params.id;
    try {
        let job = await Job.findByPk(jobId);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        // 1. Enforce State: PENDING -> RUNNING
        // If invalid transition, this throws error
        job = await JobStateMachine.transition(job, 'RUNNING');

        // 2. Respond immediately (Simulating Async)
        res.status(202).json({ message: 'Job execution started', jobId: job.id, status: job.status });

        // 3. BACKGROUND EXECUTION SIMULATION
        simulateJobExecution(job);

    } catch (error) {
        console.error('Run Job Error:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Simulated Execution Logic
async function simulateJobExecution(job) {
    const SIMULATION_DELAY_MS = 5000; // 5 seconds

    console.log(`[JobRunner] Starting simulation for Job ${job.id}...`);

    setTimeout(async () => {
        try {
            // Reload job to ensure latest state (though here we hold ref)
            console.log(`[JobRunner] Finishing simulation for Job ${job.id}.`);

            // Transition to COMPLETED
            await JobStateMachine.transition(job, 'COMPLETED');

            // Trigger Webhook
            await WebhookService.triggerWebhook(job);

            // Trigger Email Notification (if applicable)
            if (job.payload && job.payload.userEmail) {
                const { userEmail, userId, overview, timeline } = job.payload;
                const subject = `Job Completed: ${job.taskName}`;
                const body = `Hello User ${userId || 'Unknown'},\n\nYour job is complete.\n\nOverview: ${overview || 'N/A'}\nTimeline: ${timeline || 'N/A'}`;
                await EmailService.sendEmail(userEmail, subject, body);
            }

            console.log(`[JobRunner] Job ${job.id} cycle finished.`);
        } catch (err) {
            console.error(`[JobRunner] Error during execution for Job ${job.id}:`, err);
            try {
                await JobStateMachine.transition(job, 'FAILED');
            } catch (e) {
                console.error('Double fail:', e);
            }
        }
    }, SIMULATION_DELAY_MS);
}

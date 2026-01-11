const axios = require('axios');

// In a real app, this comes from DB or Config. 
// For this test, we use a webhook.site or user provided URL.
const WEBHOOK_TARGET = process.env.WEBHOOK_URL || 'https://webhook.site/test-target-placeholder';

class WebhookService {
    static async triggerWebhook(job) {
        // Basic retry logic simulated
        try {
            console.log(`[Webhook] Triggering for Job ${job.id} to ${WEBHOOK_TARGET}`);

            const payload = {
                jobId: job.id,
                taskName: job.taskName,
                priority: job.priority,
                payload: job.payload,
                completedAt: job.completedAt,
                status: job.status
            };

            // Fire and forget or await? Usually job runners await to log success/fail.
            // We will await with a short timeout.
            await axios.post(WEBHOOK_TARGET, payload, { timeout: 5000 });

            console.log(`[Webhook] Success for Job ${job.id}`);
            return true;
        } catch (error) {
            console.error(`[Webhook] Failed for Job ${job.id}:`, error.message);
            // In production, we would schedule a retry job here.
            return false;
        }
    }
}

module.exports = WebhookService;

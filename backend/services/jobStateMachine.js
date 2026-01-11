const VALID_TRANSITIONS = {
    PENDING: ['RUNNING'],
    RUNNING: ['COMPLETED', 'FAILED'],
    COMPLETED: [],
    FAILED: ['RUNNING'] // Optional: Allow retry? Prompt says "No backward transition", "No double execution". "Only pending jobs can be run". So maybe failed -> running is allow for retry? 
    // Prompt says: "Only pending jobs can be run". 
    // So FAILED -> RUNNING might be invalid based on strict reading.
    // But usually retries are allowed. 
    // Prompt says "No backward transition". 
    // Let's stick to strict: Only PENDING -> RUNNING.
};

// Strict interpretation of "Only pending jobs can be run"
const STRICT_TRANSITIONS = {
    PENDING: ['RUNNING'],
    RUNNING: ['COMPLETED', 'FAILED'],
    COMPLETED: [],
    FAILED: []
};

class JobStateMachine {
    static canTransition(currentState, nextState) {
        const allowed = STRICT_TRANSITIONS[currentState] || [];
        return allowed.includes(nextState);
    }

    static async transition(job, nextState) {
        if (!this.canTransition(job.status, nextState)) {
            throw new Error(`Invalid state transition from ${job.status} to ${nextState}`);
        }

        // Update state
        job.status = nextState;
        if (nextState === 'COMPLETED') {
            job.completedAt = new Date();
        }

        await job.save();
        return job;
    }
}

module.exports = JobStateMachine;

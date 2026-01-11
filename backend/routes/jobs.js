const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// /jobs routes
router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getJobs);
router.get('/jobs/:id', jobController.getJobById);

// /run-job route
router.post('/run-job/:id', jobController.runJob);

module.exports = router;

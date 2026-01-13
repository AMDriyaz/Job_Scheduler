const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
// Force Vercel to include mysql2
require('mysql2');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(require('./middleware/requestLogger'));

// Vercel Database Sync Middleware
let isSynced = false;
app.use(async (req, res, next) => {
    if (!isSynced) {
        try {
            await sequelize.sync(); // Sync models
            isSynced = true;
            console.log('Database synced (Vercel).');
        } catch (error) {
            console.error('Database sync failed:', error);
        }
    }
    next();
});

// Routes
// Routes
app.use('/api', require('./routes/jobs'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

// Start Server
// Start Server for Local Development
if (require.main === module) {
    async function startServer() {
        try {
            await sequelize.authenticate();
            console.log('Database connected successfully.');
            await sequelize.sync(); // Sync models
            console.log('Database synced.');

            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error('Unable to start server:', error);
        }
    }
    startServer();
}

// Export for Vercel
module.exports = app;

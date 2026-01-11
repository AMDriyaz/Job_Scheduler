const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable && process.env[dbConfig.use_env_variable]) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
    sequelize = new Sequelize({
        dialect: dbConfig.dialect,
        storage: dbConfig.storage,
        logging: dbConfig.logging
    });
}

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models explicitly
db.Job = require('./Job')(sequelize);

module.exports = db;

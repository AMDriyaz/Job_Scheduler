const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'mysql', // Encourage MySQL in production
        dialectModule: require('mysql2'),
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    }
};

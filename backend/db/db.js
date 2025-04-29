
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,   // Database name
    process.env.DB_USER,   // MySQL Username
    process.env.DB_PASSWORD,  // MySQL Password
    {
        host: process.env.DB_HOST || '127.0.0.1', // Use local MySQL if not set
        dialect: 'mysql',
        // port: process.env.DB_PORT || 3309,  // Default to 3309
    }
);
module.exports = sequelize;

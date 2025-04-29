
// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//     process.env.DB_NAME,   // Database name
//     process.env.DB_USER,   // MySQL Username
//     process.env.DB_PASSWORD,  // MySQL Password
//     {
//         host: process.env.DB_HOST || '127.0.0.1', // Use local MySQL if not set
//         dialect: 'mysql',
//         // port: process.env.DB_PORT || 3309,  // Default to 3309
//     }
// );
// module.exports = sequelize;



const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    dialectOptions: {
        socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // For Cloud SQL
        connectTimeout: 10000,
    },
    host: process.env.DB_HOST || '127.0.0.1', // Cloud SQL Instance IP if not using socket
    port: process.env.DB_PORT || 3309, // Cloud SQL instance port.
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = sequelize;

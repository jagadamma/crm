
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



// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize({
//     dialect: 'mysql',
//     dialectOptions: {
//         socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // For Cloud SQL
//         connectTimeout: 10000,
//     },
//     host: process.env.DB_HOST || '127.0.0.1', // Cloud SQL Instance IP if not using socket
//     port: process.env.DB_PORT || 3309, // Cloud SQL instance port.
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// module.exports = sequelize;


const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize({
//     dialect: 'mysql',
//     host: process.env.DB_HOST || '127.0.0.1',  // Use local MySQL if not set
//     port: process.env.DB_PORT || 3306,  // Default to 3306 (or the port you specified in .env)
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     dialectOptions: process.env.INSTANCE_CONNECTION_NAME ? {
//         socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,  // For Cloud SQL if you're using it
//         connectTimeout: 10000,
//     } : {},
// });
let sequelize;

if (process.env.INSTANCE_CONNECTION_NAME) {

    console.log(`----- INSTANCE_CONNECTION_NAME ---${process.env.INSTANCE_CONNECTION_NAME}-----`)
    console.log(`----- INSTANCE_CONNECTION_NAME ---${process.env.INSTANCE_CONNECTION_NAME.trim()}-----`)
    // On GCP, use socketPath (Cloud SQL)
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        dialect: 'mysql',
        dialectOptions: {
            socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME.trim()}`,
            connectTimeout: 10000,
        },
    });
} else {
    // Local development
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
    });
}

module.exports = sequelize;


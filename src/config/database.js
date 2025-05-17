const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'host.docker.internal',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'taekwondo_bogor',
    username: process.env.DB_USER || 'casaos',
    password: process.env.DB_PASS || 'casaos',
    ssl: process.env.DB_SSL === 'true',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
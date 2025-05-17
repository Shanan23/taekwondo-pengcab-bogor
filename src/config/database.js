require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'casaos',
    password: process.env.DB_PASSWORD || 'casaos',
    database: process.env.DB_NAME || 'taekwondo_bogor',
    host: process.env.DB_HOST || 'host.docker.internal',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USERNAME || 'casaos',
    password: process.env.DB_PASSWORD || 'casaos',
    database: process.env.DB_NAME || 'taekwondo_bogor',
    host: process.env.DB_HOST || 'host.docker.internal',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME || 'casaos',
    password: process.env.DB_PASSWORD || 'casaos',
    database: process.env.DB_NAME || 'taekwondo_bogor',
    host: process.env.DB_HOST || 'host.docker.internal',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
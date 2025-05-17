const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false
  }
);

async function initializeDatabase() {
  try {
    // Connect to PostgreSQL (default database)
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL server.');

    // Check if database exists
    const dbName = process.env.DB_NAME || 'taekwondo_bogor';
    const [results] = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    
    if (results.length === 0) {
      // Database doesn't exist, create it
      console.log(`Database ${dbName} not found. Creating...`);
      await sequelize.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }

    console.log('');
    console.log('Database setup complete!');
    console.log('');
    console.log('To run migrations:');
    console.log('npx sequelize-cli db:migrate');
    console.log('');
    console.log('To run seeders:');
    console.log('npx sequelize-cli db:seed:all');
    console.log('');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

initializeDatabase();
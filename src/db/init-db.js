const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function waitForPostgres() {
  console.log('Waiting for PostgreSQL to start...');
  let retries = 5;
  
  while (retries > 0) {
    try {
      await execAsync('pg_isready -h host.docker.internal -p 5432');
      console.log('PostgreSQL is up - continuing...');
      return true;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Could not connect to PostgreSQL');
        return false;
      }
      console.log(`PostgreSQL is not ready yet. Retrying in 5 seconds... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    await execAsync('npx sequelize-cli db:migrate');
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}

async function runSeeders() {
  try {
    console.log('Running database seeders...');
    await execAsync('npx sequelize-cli db:seed:all');
    console.log('Seeders completed successfully');
    return true;
  } catch (error) {
    console.error('Error running seeders:', error);
    return false;
  }
}

async function init() {
  const isPostgresReady = await waitForPostgres();
  if (!isPostgresReady) {
    process.exit(1);
  }

  const migrationsSuccess = await runMigrations();
  if (!migrationsSuccess) {
    process.exit(1);
  }

  const seedersSuccess = await runSeeders();
  if (!seedersSuccess) {
    process.exit(1);
  }

  console.log('Database initialization completed successfully');
}

init().catch(error => {
  console.error('Error during initialization:', error);
  process.exit(1);
}); 
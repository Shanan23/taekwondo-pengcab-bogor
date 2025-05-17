#!/bin/sh
set -e

# Display version information
echo "Starting Taekwondo Pengcab Bogor application version: $APP_VERSION"
echo "Environment: $NODE_ENV"

# Wait for the database to be ready
echo "Waiting for PostgreSQL to start..."
for i in {1..30}; do
  if pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    echo "PostgreSQL is up - continuing..."
    break
  fi
  echo "Waiting for PostgreSQL to start (attempt $i)..."
  sleep 1
done

# Initialize database and run migrations
echo "Running database migrations..."
DB_SSL=${DB_SSL:-true} npm run db:migrate

# Start the application
echo "Starting the application..."
exec "$@" 
#!/bin/sh
set -e

# Wait for the database to be ready
echo "Waiting for PostgreSQL to start..."
for i in {1..30}; do
  if pg_isready -h postgres -p 5432 -U postgres; then
    echo "PostgreSQL is up - continuing..."
    break
  fi
  echo "Waiting for PostgreSQL to start (attempt $i)..."
  sleep 1
done

# Initialize database and run migrations
echo "Running database migrations..."
npm run db:migrate

# Start the application
echo "Starting the application..."
exec "$@" 
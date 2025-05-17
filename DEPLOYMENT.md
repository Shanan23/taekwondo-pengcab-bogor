# Deployment Guide for Taekwondo Pengcab Bogor Website

This guide explains how to deploy the Taekwondo Pengcab Bogor Website using Docker and Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git to clone the repository

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/taekwondo-pengcab-bogor.git
cd taekwondo-pengcab-bogor
```

### 2. Configure Environment Variables

Create a `.env` file in the project root for configuration:

```
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=taekwondo_db
DB_USER=postgres
DB_PASS=postgres_password
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

Note: The environment variables defined in the `.env` file will override those in the `docker-compose.yml` file.

### 3. Build and Start the Containers

```bash
# Build the Docker images
npm run docker:build

# Start the containers in detached mode
npm run docker:up
```

This will start two containers:
- **taekwondo-app**: The Node.js application
- **taekwondo-postgres**: PostgreSQL database

### 4. Initialize the Database (First Run Only)

On the first run, the application will automatically run migrations to set up the database schema through the `docker-entrypoint.sh` script. However, you might need to seed the database with initial data:

```bash
# Connect to the running container
docker exec -it taekwondo-app /bin/sh

# Run database seeding
npm run db:seed

# Exit the container
exit
```

### 5. Create Admin Account 

For development environments, you can create an initial admin account by visiting:

```
http://your-server-ip:3000/admin/create-admin
```

This will create an admin account with:
- Email: admin@taekwondobogor.org
- Password: admin123

For production, this route is disabled. You should create admin accounts through the database directly.

### 6. Accessing the Application

- **Website Frontend**: http://your-server-ip:3000
- **Admin Panel**: http://your-server-ip:3000/admin

### 7. Monitoring and Management

```bash
# View logs
npm run docker:logs

# Stop the containers
npm run docker:down

# Restart the containers
npm run docker:restart
```

## Directories and Data Persistence

The following directories are persisted outside the containers:

- **Database data**: Stored in a Docker volume `postgres_data`
- **Uploads**: Mounted from the host's `./uploads` directory to `/app/uploads` in the container

## Backup and Restore

### Database Backup

```bash
docker exec taekwondo-postgres pg_dump -U postgres taekwondo_db > backup.sql
```

### Database Restore

```bash
cat backup.sql | docker exec -i taekwondo-postgres psql -U postgres taekwondo_db
```

## Troubleshooting

### Database Connection Issues

If the application can't connect to the database:

1. Check if the PostgreSQL container is running:
   ```bash
   docker ps
   ```

2. Check database logs:
   ```bash
   docker logs taekwondo-postgres
   ```

3. Ensure the database credentials in `.env` match those in `docker-compose.yml`

### Application Issues

Check the application logs:
```bash
docker logs taekwondo-app
``` 
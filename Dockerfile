FROM node:18-alpine

# Build arguments
ARG NODE_ENV=production
ARG APP_VERSION=1.0.1

# Add metadata
LABEL version=$APP_VERSION
LABEL description="Taekwondo Pengcab Bogor Application"

# Install PostgreSQL client for pg_isready
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the entry point script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy source code
COPY . .

# Create uploads directories for file uploads
RUN mkdir -p uploads/members uploads/units

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV APP_VERSION=$APP_VERSION

# Expose port
EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "app.js"] 
FROM node:18-alpine

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

# Expose port
EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "app.js"] 
FROM node:18-alpine

# Install PostgreSQL client for health checks
RUN apk add --no-cache postgresql-client

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Create necessary directories
RUN mkdir -p src/db/migrations src/db/seeders

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && \
    chown -R node:node /app && \
    chmod -R 755 /app

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/app.js"] 
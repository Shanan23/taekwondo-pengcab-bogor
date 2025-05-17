const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined')); // HTTP request logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Service configuration
const serviceConfig = {
  authService: {
    url: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    routes: ['/api/auth', '/api/admin', '/api/profile']
  },
  contentService: {
    url: process.env.CONTENT_SERVICE_URL || 'http://content-service:3002',
    routes: ['/api/content', '/api/organization']
  },
  eventService: {
    url: process.env.EVENT_SERVICE_URL || 'http://event-service:3003',
    routes: ['/api/events']
  },
  memberService: {
    url: process.env.MEMBER_SERVICE_URL || 'http://member-service:3004',
    routes: ['/api/units', '/api/members', '/api/contact']
  }
};

// Set up proxy middleware for each service
Object.values(serviceConfig).forEach(service => {
  service.routes.forEach(route => {
    app.use(route, createProxyMiddleware({
      target: service.url,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(route, ''),
      onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying ${req.method} request to ${service.url}${req.url}`);
      },
      onError: (err, req, res) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({ 
          error: 'Service unavailable', 
          message: `The service for ${req.url} is currently unavailable` 
        });
      }
    }));
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
}); 
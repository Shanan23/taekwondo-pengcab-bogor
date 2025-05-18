const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const viewLocals = require('./middlewares/viewLocals');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

// Load environment variables
dotenv.config();

// Database connection
const db = require('./models');

// Import routes
const landingRoutes = require('./routes/landing');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
app.use(session({
  store: new pgSession({
    pool: db.sequelize.connectionManager.pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'taekwondo-pengcab-bogor-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// Flash messages
app.use(flash());

// Set up view locals (including current path)
app.use(viewLocals);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('/app/uploads'));

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = '/app/uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define routes
app.use('/', landingRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('partials/error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    statusCode: 404,
    active: ''
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('partials/error', {
    title: 'Server Error',
    message: 'Something went wrong on our end.',
    statusCode: 500,
    active: ''
  });
});

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Run migrations
    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, 'db/migrations/*.js'),
        resolve: ({ name, path, context }) => {
          const migration = require(path);
          return {
            name,
            up: async () => migration.up(context.queryInterface, context.sequelize),
            down: async () => migration.down(context.queryInterface, context.sequelize)
          };
        }
      },
      context: {
        queryInterface: db.sequelize.getQueryInterface(),
        sequelize: db.sequelize
      },
      storage: new SequelizeStorage({ sequelize: db.sequelize }),
      logger: console
    });

    await umzug.up();
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Export the app and database initialization function
module.exports = {
  app,
  initializeDatabase
}; 
const { app, initializeDatabase } = require('./src/app');

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Try to initialize database
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      console.log('Starting server without database connection...');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 
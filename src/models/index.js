const sequelize = require('../config/database');

// Import models
const Admin = require('./Admin');
const Content = require('./Content');
const Organization = require('./Organization');
const Event = require('./Event');
const Unit = require('./Unit');
const Member = require('./Member');
const Contact = require('./Contact');

// Initialize models
const models = {
  Admin,
  Content,
  Organization,
  Event,
  Unit,
  Member,
  Contact
};

// Define model associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models
module.exports = {
  sequelize,
  ...models
}; 
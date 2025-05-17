const sequelize = require('../config/database');

// Import models
const Admin = require('./Admin');
const Content = require('./Content');
const Organization = require('./Organization');
const Event = require('./Event');
const Unit = require('./Unit');
const Member = require('./Member');
const Contact = require('./Contact');

// Define model associations
Admin.hasMany(Contact, {
  foreignKey: 'responseBy',
  as: 'responses'
});
Contact.belongsTo(Admin, {
  foreignKey: 'responseBy',
  as: 'respondedBy'
});

Unit.hasMany(Member, {
  foreignKey: 'unitId',
  as: 'members'
});
Member.belongsTo(Unit, {
  foreignKey: 'unitId',
  as: 'unit'
});

// Export models
module.exports = {
  sequelize,
  Admin,
  Content,
  Organization,
  Event,
  Unit,
  Member,
  Contact
}; 
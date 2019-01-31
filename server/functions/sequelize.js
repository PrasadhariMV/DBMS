var Sequelize = require('sequelize');
var config = require('config');

var sequelize = new Sequelize(
  config.database.MYSQLDBName,
  config.database.MYSQLDBUsername,
  config.database.MYSQLDBPassword,
  {
    host: config.database.MYSQLDBHostname,
    dialect: 'mysql',
    dialectOptions: {
    },
    pool: {
    },
    define: {
      timestamps: false
    },
    timezone: '+00:00' 
  });

module.exports = sequelize;



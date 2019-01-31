var mysql = require('mysql');
var config = require('config');
var sequelize = require('./sequelize');

var connection = mysql.createConnection({
  host: config.database.MYSQLDBHostname,
  user: config.database.MYSQLDBUsername,
  password: config.database.MYSQLDBPassword,
  database: config.database.MYSQLDBName
})

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  connection: connection
};

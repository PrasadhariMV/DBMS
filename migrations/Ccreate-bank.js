'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('banks', {
      accountNumber: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    phoneNumber: {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'phoneNumber'
      },
      allowNull: false
    },
    balance:{
      type:Sequelize.INTEGER,
       allowNull:false
    },
    bankName:{
      type:Sequelize.STRING,
       allowNull:false
    }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('banks');
  }
};
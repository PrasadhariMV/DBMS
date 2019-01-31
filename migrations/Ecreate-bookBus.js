'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('bookBuses', {
      bookingId: {
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    phoneNumber: {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'phoneNumber'
      },
      allowNull: false
    },
    amount:{
      type:Sequelize.INTEGER,
       allowNull:false
    },
    busId:{
      type:Sequelize.STRING,
       allowNull:false
    }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('bookBuses');
  }
};
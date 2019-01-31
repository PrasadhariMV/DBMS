'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('recharges', {
      rechargeId: {
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
    operator:{
      type:Sequelize.STRING,
       allowNull:false
    },
    rechargedNumber:{
      type:Sequelize.STRING,
      allowNull:false
    },
    plan:{
      type:Sequelize.STRING,
      allowNull:false
    }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('recharges');
  }
};
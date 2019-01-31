'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('bookMovies', {
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
    movieId:{
      type:Sequelize.STRING,
       allowNull:false
    },
    movieName:{
      type:Sequelize.STRING,
       allowNull:false
    }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('bookMovies');
  }
};
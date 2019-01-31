'use strict';
module.exports =  (sequelize, Sequelize) => {
  var bookMovieSchema = sequelize.define('bookMovie', {
    bookingId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    phoneNumber: {
      type: Sequelize.UUID,
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
  }, {});
  bookMovieSchema.associate= function (models) {
    bookMovieSchema.belongsTo(models.user, { foreignKey: 'phoneNumber', targetKey: 'phoneNumber'});
  };
  return bookMovieSchema;
};

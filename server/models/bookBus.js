'use strict';
module.exports =  (sequelize, Sequelize) => {
  var bookBusSchema = sequelize.define('bookBus', {
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
    busId:{
      type:Sequelize.STRING,
       allowNull:false
    }
  }, {});
  bookBusSchema.associate= function (models) {
    bookBusSchema.belongsTo(models.user, { foreignKey: 'phoneNumber', targetKey: 'phoneNumber'});
  };
  return bookBusSchema;
};

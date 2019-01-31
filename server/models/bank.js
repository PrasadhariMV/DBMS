'use strict';
module.exports =  (sequelize, Sequelize) => {
  var bankSchema = sequelize.define('bank', {
   accountNumber: {
      type: Sequelize.STRING,
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
    balance:{
      type:Sequelize.INTEGER,
       allowNull:false
    },
    bankName:{
      type:Sequelize.STRING,
       allowNull:false
    }
  }, {});
  bankSchema.associate= function (models) {
    bankSchema.belongsTo(models.user, { foreignKey: 'phoneNumber', targetKey: 'phoneNumber'});
  };
  return bankSchema;
};

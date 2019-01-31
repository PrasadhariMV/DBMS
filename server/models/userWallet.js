'use strict';
module.exports =  (sequelize, Sequelize) => {
  var walletSchema = sequelize.define('userWallet', {
   transId: {
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
    type:{
      type:Sequelize.STRING,
       allowNull:false
    }
  }, {});
  walletSchema.associate= function (models) {
    walletSchema.belongsTo(models.user, { foreignKey: 'phoneNumber', targetKey: 'phoneNumber'});
  };
  return walletSchema;
};

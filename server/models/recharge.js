'use strict';
module.exports =  (sequelize, Sequelize) => {
  var rechargeSchema = sequelize.define('recharge', {
   rechargeId: {
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
  }, {});
  rechargeSchema.associate= function (models) {
    rechargeSchema.belongsTo(models.user, { foreignKey: 'phoneNumber', targetKey: 'phoneNumber'});
  };
  return rechargeSchema;
};

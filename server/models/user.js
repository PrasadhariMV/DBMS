'use strict';
module.exports =  (sequelize, Sequelize) => {
  var userSchema = sequelize.define('user', {
    phoneNumber: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    wallet:{
      type:Sequelize.INTEGER,
      allowNull:false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
      }
  }, {});
  userSchema.associate= function (models) {
     userSchema.hasOne(models.userWallet);
     userSchema.hasOne(models.bank);
     userSchema.hasMany(models.recharge);
     userSchema.hasMany(models.bookBus);
  };
  return userSchema;
};

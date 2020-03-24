'use strict';
module.exports = function(sequelize, DataTypes) {
  var UGroup = sequelize.define('UGroup', {
    name:{
      type:DataTypes.STRING(50),
      primaryKey: true
    } 
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.UGroup.belongsToMany(models.User, {as:'group', through:'UserofGroup', foreignKey:'group'})
      }
    }
  });
  return UGroup;
};
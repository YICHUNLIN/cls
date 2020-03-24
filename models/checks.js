/*
發起一個勘驗活動，例如自主檢查、品管、檢驗停留點

*/

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Checks = sequelize.define('Checks', {
    title: DataTypes.STRING,
    datetime: DataTypes.DATE,
    description: DataTypes.TEXT,
    belongproject: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // 一個check 會有很多個 check item
        models.Checks.hasMany(models.CheckItems);
        // 一個check 會屬於一個 project
        models.Checks.belongsTo(models.Project);
      }
    }
  });
  return Checks;
};
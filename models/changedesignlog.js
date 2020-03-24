/*
變更設計紀錄

*/


'use strict';
module.exports = function(sequelize, DataTypes) {
  var ChangeDesignLog = sequelize.define('ChangeDesignLog', {
    belongproject: DataTypes.STRING,
    description: DataTypes.TEXT,
    adddur: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.ChangeDesignLog.belongsTo(models.Project);
      }
    }
  });
  return ChangeDesignLog;
};
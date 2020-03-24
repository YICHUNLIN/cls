/*
有點像FB留言版
是一個可以下評論的地方

*/
'use strict';
module.exports = function(sequelize, DataTypes) {
  var CheckitemCommands = sequelize.define('CheckitemCommands', {
    belongcheckitem: DataTypes.INTEGER,
    belongmember: DataTypes.STRING,
    command: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // 一個 checkitem command 會屬於一個 check item
        models.CheckitemCommands.belongsTo(models.CheckItems);
        models.CheckitemCommands.belongsTo(models.User);
      }
    }
  });
  return CheckitemCommands;
};
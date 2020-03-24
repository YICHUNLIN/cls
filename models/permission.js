/*
使用者對於專案的權限

*/
'use strict';
//var ProjectMember = require('./projectmember')
module.exports = function(sequelize, DataTypes) {
  var Permission = sequelize.define('Permission', {
    permlevel:{
        type:  DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      desctrption:{
        type: DataTypes.STRING,
        allowNull: false
      },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // 一個權限 會有很多 Project Member
        models.Permission.hasMany(models.ProjectMember);
        
      }
    }
  });
  return Permission;
};
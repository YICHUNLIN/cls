/*
元件類別

版梁柱牆...

*/

'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectitemCategory = sequelize.define('ProjectitemCategory', {
    name: {
        type: DataTypes.STRING, 
        primaryKey: true,
        allowNull: false
    },
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // 一個類別 會有很多元件
        models.ProjectitemCategory.hasMany(models.ProjectItem);
      }
    }
  });
  return ProjectitemCategory;
};
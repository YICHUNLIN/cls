/*
一個元件可以同時屬於很多群組，用於filter

*/
'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectItemGroupRelation = sequelize.define('ProjectItemGroupRelation', {
    projectitem: DataTypes.INTEGER,
    group: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // 一個群組與元件關係 屬於 一個群組
        models.ProjectItemGroupRelation.belongsTo(models.ProjectItemGroup);
        // 一個群組與元件關係 屬於 一個元件
        models.ProjectItemGroupRelation.belongsTo(models.ProjectItem);
      }
    }
  });
  return ProjectItemGroupRelation;
};
/*
元件群組

*/
'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectItemGroup = sequelize.define('ProjectItemGroup', {
    name: DataTypes.STRING,
    level:DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // 一個專案元件群組有很多元件
        models.ProjectItemGroup.belongsToMany(models.ProjectItem, {as:'group', through: 'ProjectItemGroupRelation'});
        // 一個專案元件(項目)群組會屬於一個專案
        models.ProjectItemGroup.belongsTo(models.Project);
        //wbs
        models.ProjectItemGroup.hasMany(models.ProjectItem);
      }
    }
  });
  return ProjectItemGroup;
};
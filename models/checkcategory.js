/*
鋼筋 模板 混凝土...

*/
'use strict';
module.exports = function(sequelize, DataTypes) {
  var CheckCategory = sequelize.define('CheckCategory', {
    name: {
        type: DataTypes.STRING, 
        primaryKey: true
    },
    category: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.CheckCategory.hasMany(models.CheckCategoryTypes);
        //models.CheckCategory.hasMany(models.CheckItems);
      }
    }
  });
  return CheckCategory;
};
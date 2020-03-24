/*
鋼筋 - 拉力
     - 外觀
     - 搭接
     - 號數 ...

*/
'use strict';
module.exports = function(sequelize, DataTypes) {
  var CheckCategoryTypes = sequelize.define('CheckCategoryTypes', {
    belongcheckcategory: DataTypes.STRING,
    name: {
        type: DataTypes.STRING, 
        primaryKey: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.CheckCategoryTypes.belongsTo(models.CheckCategory);
        //models.CheckCategoryTypes.hasMany(models.CheckItems);
      }
    }
  });
  return CheckCategoryTypes;
};
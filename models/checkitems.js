/*
每個施工勘驗記錄(拍照)
*/

'use strict';
module.exports = function(sequelize, DataTypes) {
  var CheckItems = sequelize.define('CheckItems', {
    ciid:{
        primaryKey: true,
        type:DataTypes.STRING(100)
    },
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    description: DataTypes.TEXT,
    photourl: DataTypes.STRING,
    //missing:DataTypes.BOOLEAN,
    resulttype:DataTypes.STRING,
    categoryType:DataTypes.STRING,
    checkcategory:DataTypes.STRING,
    bymember:DataTypes.STRING,
    belongcheck:DataTypes.INTEGER,
    projectitem:DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // 一個 check item 屬於一個 check
        models.CheckItems.belongsTo(models.Checks);

        models.CheckItems.belongsTo(models.User);
        // 一個 check item 會有很多 check commands
        models.CheckItems.hasMany(models.CheckitemCommands);
        // 一個 check item 會有一個 check category (檢查項目 如 鋼筋、模板、混凝土)
        //models.CheckItems.belongsTo(models.CheckCategory);
        // 一個 check item 會有一個 check category type(檢查項目的子項目 如 混凝土的抗壓、混凝土的氯離子)
        //models.CheckItems.belongsTo(models.CheckCategoryTypes);
        //一個checkitem 同時屬於多個 projectitem n:m
        //models.CheckItems.belongsToMany(models.ProjectItem, {as: 'checkitem', through:'ProjectItemAndCheckItem'});
        //一個checkitem 有一個主要的 project item n:1
        models.CheckItems.belongsTo(models.ProjectItem);
        //一個checkitem 有很多 pictures
        models.CheckItems.hasMany(models.CheckItemPictures);
      
      }
    }
  });
  return CheckItems;
};
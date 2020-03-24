/*

專案的元件(項目)

Foreign key 也要寫在定義裡，除了建立連結之外
*/

'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectItem = sequelize.define('ProjectItem', {
    belongproject: DataTypes.STRING,
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    parentlevel:DataTypes.INTEGER,
    bimid:{
      type: DataTypes.STRING(10),
      allowNull:true
    },
    unit:{
      type: DataTypes.STRING(10),
      allowNull: true
    },
    unitPrice:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numsofcontract:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    describe:{
      type: DataTypes.STRING,
      allowNull: true
    },
    CenterX:{
      type:DataTypes.DOUBLE,
      allowNull: true
    },
    CenterY:{
      type:DataTypes.DOUBLE,
      allowNull: true
    },
    R:{
      type:DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        models.ProjectItem.belongsTo(models.ProjectItem);
        // associations can be defined here
        //models.ProjectItem.belongsToMany(models.ProjectItemGroup);
        // 一個元件會同時屬於很多群組
        models.ProjectItem.belongsToMany(models.ProjectItemGroup, {as:'projectitem',through: 'ProjectItemGroupRelation'});
        // 一個元件會有一個類別 版樑柱牆
        models.ProjectItem.belongsTo(models.ProjectitemCategory);
        // 一個元件屬於一個專案
        models.ProjectItem.belongsTo(models.Project);
        // 一個project item 屬於很多個 checkitem. n:m
        //models.ProjectItem.belongsToMany(models.CheckItems, {as:'projectitem', through:'ProjectItemAndCheckItem'});
        // 一個project item 會有多個 checkitem
        models.ProjectItem.hasMany(models.CheckItems);
        //wbs
        models.ProjectItem.belongsTo(models.ProjectItemGroup, {foreignKey: 'wbs'});

      }
    }
  });
  return ProjectItem;
};
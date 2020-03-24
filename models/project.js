/*
一個案子 專案

*/
'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    identify:{
        type: DataTypes.STRING(30), 
        primaryKey: true,
        allowNull: false
    },
    // 名稱
    name: DataTypes.STRING,
    // 工期
    duration: DataTypes.INTEGER,
    // 開工日
    startdate: DataTypes.DATE,
    // 預估完工
    estimateEndDate: DataTypes.DATE,
    // 實際完工
    actualEndDate: DataTypes.DATE,
    // 變更設計後的預計完工
    afterchangeDesignDate: DataTypes.DATE,
    // 增加工期
    increaseDuration: DataTypes.INTEGER,
    // 工程敘述
    description: DataTypes.TEXT,
    datetype:DataTypes.STRING,
    //urn
    urn:DataTypes.STRING,
    //ori latitude, longitude
    latitude:DataTypes.DOUBLE,
    longitude:DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // 一個專案會被很多人參與，每個人對於專案都有一個權限
        models.Project.belongsToMany(models.User, { as: 'project', through: 'ProjectMember',foreignKey: 'project'});
        //models.Project.belongsTo(models.ProjectMember,{foreignKey: 'project'});
        // 一個專案會有很多變更設計
        models.Project.hasMany(models.ChangeDesignLog);
        // 一個專案會有很多群組(元件群組)
        models.Project.hasMany(models.ProjectItemGroup);
        // 一個專案會有很多元件
        models.Project.hasMany(models.ProjectItem);
        // 一個專案會有很多 check 檢驗
        models.Project.hasMany(models.Checks);
        // 一個專案會有很多經緯度的點
        models.Project.hasMany(models.ProjectLocations);
      }
    }
  });
  return Project;
};
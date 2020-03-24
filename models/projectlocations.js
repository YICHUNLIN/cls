/*
一個project 會由很多個location 點 定位匡起來

*/

'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectLocations = sequelize.define('ProjectLocations', {
    belongproject: DataTypes.STRING(100),
    sequence: DataTypes.INTEGER,
    latatude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // 一組經緯資料屬於一個project
        models.ProjectLocations.belongsTo(models.Project);
      }
    }
  });
  return ProjectLocations;
};
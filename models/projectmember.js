/*
專案參與者

*/

'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectMember = sequelize.define('ProjectMember', {
    // permission
    //pytpe: DataTypes.STRING(30),
    // project
    //project: DataTypes.STRING(30),
    // member
    //member: DataTypes.STRING(100),
    isPin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        
        models.ProjectMember.belongsTo(models.Project);
        models.ProjectMember.belongsTo(models.User);

        //models.ProjectMember.hasMany(models.Project);
        //models.ProjectMember.hasMany(models.User);
        models.ProjectMember.belongsTo(models.Permission,{foreignKey: 'ptype'});
        
      }
    }
  });
  return ProjectMember;
};
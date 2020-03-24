'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserofGroup = sequelize.define('UserofGroup', {
    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.UserofGroup.belongsTo(models.User,{foreignKey: 'user'});
        models.UserofGroup.belongsTo(models.UGroup,{foreignKey: 'group'});
      }
    }
  });
  return UserofGroup;
};
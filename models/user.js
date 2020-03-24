/*

使用者

*/

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    account: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    mobile: DataTypes.STRING,
    tel: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      isEmail:true
    },
    role: DataTypes.STRING,
    company_name: DataTypes.STRING,
    company_address: DataTypes.STRING,
    company_tel: DataTypes.STRING,
    loginip: {
      type: DataTypes.STRING,
      isIP: true
    },
    token:{
      type: DataTypes.STRING
    },
    photourl:{
      type: DataTypes.STRING,
      allowNull:true
    },
    lastlogintime:{
      type: DataTypes.DATE,
      allowNull: true
    },
    status:{
      type:DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // 一個使用者，會參與很多專案，因此每個專案都會有個權限
        models.User.belongsToMany(models.Project, { as: 'member', through: 'ProjectMember',foreignKey: 'member'});
        //models.User.belongsTo(models.ProjectMember,{foreignKey: 'member'});
        // 一個使用者會有很多給予評論
        models.User.hasMany(models.CheckitemCommands);
        //userGroup
        models.User.belongsToMany(models.UGroup, {as: 'user', through: 'UserofGroup', foreignKey:'user'});
      }
    }
  });
  return User;
};


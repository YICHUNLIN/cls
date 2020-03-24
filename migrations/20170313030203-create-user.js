/*
使用者
*/


'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      // 帳號當做primary key
      account:
      {
        type: Sequelize.STRING(30), 
        primaryKey: true,
        allowNull: false,
      },
      // 密碼
      password:
      {
        type: Sequelize.STRING,
        allowNull:false
      },
      salt:{
        type: Sequelize.STRING,
        allowNull:false
      },
      // 姓
      firstname: 
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      // 名 
      lastname: 
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      // 手機
      mobile: 
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      // 市內電話
      tel:
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      // email
      email:
      {
        type: Sequelize.STRING,
        allowNull: false,
        validate: 
        {
          isEmail: true
        }
      },
      //角色 ：工程師、工程助理、監造、業主...
      role:
      {
        type: Sequelize.STRING,
        allowNull:true
      },
      // 公司名
      company_name:
      {
        type: Sequelize.STRING,
        allowNull:true
      },
      // 公司地址
      company_address:
      {
        type: Sequelize.STRING,
        allowNull:true
      },
      // 公司電話
      company_tel:
      {
        type: Sequelize.STRING,
        allowNull:true
      },
      // 登入ip
      loginip:
      {
        type: Sequelize.STRING,
        allowNull:true
      },
      token:{
        type: Sequelize.STRING,
        allowNull:true
      },
      photourl:{
        type:Sequelize.STRING,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    //return queryInterface.dropTable('Users');
  }
};
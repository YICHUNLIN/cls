/*
檢查項目的類別。

例如 梁- 鋼筋模板混凝土...

自主檢查表
*/


'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('CheckCategories', {
      //id: {
      //  allowNull: false,
      //  autoIncrement: true,
      //  primaryKey: true,
      //  type: Sequelize.INTEGER
      //},
      name: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(30)
      },
      category: {
        type: Sequelize.TEXT
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
    //return queryInterface.dropTable('CheckCategories');
  }
};
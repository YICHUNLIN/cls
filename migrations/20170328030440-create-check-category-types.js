/*
檢查類別需要被檢查的項目

例如

鋼筋需要被檢查。間距 號數  拉力...
自主檢查表的項目

*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('CheckCategoryTypes', {
      //id: {
      //  allowNull: false,
      //  autoIncrement: true,
      //  primaryKey: true,
      //  type: Sequelize.INTEGER
      //},
      belongcheckcategory: {
        type: Sequelize.STRING(30),
        references: {
            model: 'CheckCategories',
            key: 'name'
        },
        allowNull: false
      },
      name: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(30)
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
    //return queryInterface.dropTable('CheckCategoryTypes');
  }
};
/*
  變更設計的紀錄
*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ChangeDesignLogs', {
      // 編號
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 屬於專案
      belongproject: {
        type: Sequelize.STRING(100),
        references: {
            model: 'Projects',
            key: 'identify'
        },
        allowNull: false
      },
      // 敘述
      description: {
        type: Sequelize.TEXT
      },
      // 增加工期
      adddur: {
        type: Sequelize.INTEGER
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
    //return queryInterface.dropTable('ChangeDesignLogs');
  }
};
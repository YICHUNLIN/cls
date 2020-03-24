/*
查驗活動

2017/03/28-自主檢查

*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Checks', {
      //編號
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 活動日期
      datetime: {
        type: Sequelize.DATE
      },
      // 活動標題 / 目的
      title: {
        type: Sequelize.STRING
      },
      //屬於專案
      belongproject: {
        type: Sequelize.STRING(100),
        references: {
            model: 'Projects',
            key: 'identify'
        },
        allowNull: false
      },
      //敘述
      description: {
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
    //queryInterface.dropTable('CheckItems');
    //return queryInterface.dropTable('Checks');
  }
};
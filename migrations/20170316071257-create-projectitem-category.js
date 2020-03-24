/*
專案項目的類別

柱梁板牆...
*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProjectitemCategories', {
      // 編號
      //名稱 是否改成 primary key?
      name: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(30)
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
    //return queryInterface.dropTable('ProjectitemCategories');
  }
};
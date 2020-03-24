/*
  專案項目的群組(階層)
*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProjectItemGroups', {
      // 編號
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      //名稱
      name: {
        type: Sequelize.STRING
      },
      // 複合式群組 階層
      belonggroup:{
        // 可以是空的，如果是空的就是第一階
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
            model: 'ProjectItemGroups',
            key: 'id'
        }
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
    //return queryInterface.dropTable('ProjectItemGroups');
  }
};
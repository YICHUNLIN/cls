/*
檢查項目的評論
*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('CheckitemCommands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      belongmember: {
        type: Sequelize.STRING(30),
        references: {
            model: 'Users',
            key: 'account'
        },
        allowNull: false
      },
      belongcheckitem: {
        type: Sequelize.STRING(100),
        references: {
            model: 'CheckItems',
            key: 'ciid'
        },
        allowNull: false
      },
      command:{
        type:Sequelize.TEXT
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
    //return queryInterface.dropTable('CheckitemCommands');
  }
};
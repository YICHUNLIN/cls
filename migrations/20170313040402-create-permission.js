/*
參加專案的權限
*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Permissions', {
      permlevel: {
        type: Sequelize.STRING(30),
        allowNull: false,
        primaryKey: true
      },
      desctrption:{
        type: Sequelize.STRING,
        allowNull: false
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
   //return queryInterface.dropTable('Permissions');
  }
};
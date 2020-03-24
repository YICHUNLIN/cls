/*
專案參與的會員

*/

'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProjectMembers', {
      /*id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },*/
      // 預設 false 是否釘在上面
      isPin:
      {
        type: Sequelize.BOOLEAN,
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
    //return queryInterface.dropTable('ProjectMembers');
  }
};
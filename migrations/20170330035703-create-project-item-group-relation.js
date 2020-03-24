'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProjectItemGroupRelations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectitem: {
        type: Sequelize.INTEGER,
        references: {
            model: 'ProjectItems',
            key: 'id'
        },
        allowNull: false
      },
      group: {
        type: Sequelize.INTEGER,
        references: {
            model: 'ProjectItemGroups',
            key: 'id'
        },
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
    //return queryInterface.dropTable('ProjectItemGroupRelations');
  }
};
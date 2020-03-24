/*
補充 專案項目

建立專案項目的類別關係
*/

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn('ProjectItems','category',
      {
        type: Sequelize.STRING(30),
        references: {
            model: 'ProjectitemCategories',
            key: 'name'
        },
        allowNull: true
      }

    );
  },

  down: function (queryInterface, Sequelize) {
    //return queryInterface.dropTable('ProjectItems');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*queryInterface.addColumn('CheckCategories','projectitemcategory',
      {
        type: Sequelize.INTEGER,
        references: {
            model: 'ProjectitemCategories',
            key: 'id'
        },
        allowNull: false
      }
    );*/
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

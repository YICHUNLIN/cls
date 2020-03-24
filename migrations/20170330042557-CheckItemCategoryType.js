'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('CheckItems','categoryType',
      {
        type: Sequelize.STRING(30),
        references: {
            model: 'CheckCategoryTypes',
            key: 'name'
        },
        allowNull: false
      }
    );

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

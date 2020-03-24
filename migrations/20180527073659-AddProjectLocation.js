'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Projects','latitude',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    );
    queryInterface.addColumn('Projects','longitude',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
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
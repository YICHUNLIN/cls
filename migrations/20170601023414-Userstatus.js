'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.addColumn('Users','status',
      {
        type: Sequelize.STRING(10),
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

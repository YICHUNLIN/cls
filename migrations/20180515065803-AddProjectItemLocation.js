'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('ProjectItems','CenterX',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    );
    queryInterface.addColumn('ProjectItems','CenterY',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    );
    queryInterface.addColumn('ProjectItems','R',
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

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('ProjectItems','unit',
      {
        type: Sequelize.STRING(10),
        alllowNull: true
      }
    );

    queryInterface.addColumn('ProjectItems','unitPrice',
      {
        type: Sequelize.INTEGER,
        alllowNull: true
      }
    );

    queryInterface.addColumn('ProjectItems','numsofcontract',
      {
        type: Sequelize.INTEGER,
        alllowNull: true
      }
    );

    queryInterface.addColumn('ProjectItems','describe',
      {
        type: Sequelize.STRING,
        alllowNull: true
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

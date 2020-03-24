'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('ProjectItems','belongproject',
      {
        type: Sequelize.STRING(100),
        references: {
            model: 'Projects',
            key: 'identify'
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

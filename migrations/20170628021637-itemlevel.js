'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    //複合式的item
    queryInterface.addColumn('ProjectItems','parentlevel',
      {
        type: Sequelize.INTEGER,
        references: {
            model: 'ProjectItems',
            key: 'id'
        },
        allowNull:true
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

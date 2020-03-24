'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn('UserofGroups','user',
      {
        type: Sequelize.STRING(30),
        references: {
            model: 'Users',
            key: 'account'
        }
      });

    queryInterface.addColumn('UserofGroups','group',
      {
        type: Sequelize.STRING(50),
        references:{
          model:'UGroups',
          key:'name'
        }
      });
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

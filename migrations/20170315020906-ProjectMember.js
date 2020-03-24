/*
補充檔。建立專案與會員還有權限的關聯

*/

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn('ProjectMembers','ptype',
      {
        type: Sequelize.STRING(30),
        references: {
            model: 'Permissions',
            key: 'permlevel'
        },
        allowNull: true
      }

    );
  
    queryInterface.addColumn('ProjectMembers','project',
      {
        type: Sequelize.STRING(100),
        references: {
            model: 'Projects',
            key: 'identify'
        },
        allowNull: true

      }
    );

    queryInterface.addColumn('ProjectMembers','member',
      {
        type: Sequelize.STRING(30),
        references: {
            model: 'Users',
            key: 'account'
        },
        allowNull: true
      }
    );

  },

  down: function (queryInterface, Sequelize) {
    //return queryInterface.dropTable('ProjectMembers');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

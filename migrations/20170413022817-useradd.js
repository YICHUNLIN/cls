'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.addColumn('Users','lastlogintime',
      {
        type: Sequelize.DATE,
        allowNull: true, 
        defaultValue:Sequelize.NOW
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    
  }
};

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {

    queryInterface.dropTable('CheckitemCommands');
    console.log('drop CheckitemCommands');

    queryInterface.dropTable('CheckItems');
    console.log('drop CheckItems');

    queryInterface.dropTable('ProjectItemGroupRelations');
    console.log('drop ProjectItemGroupRelations');

    queryInterface.dropTable('ProjectMembers');
    console.log('drop ProjectMembers');

    queryInterface.dropTable('CheckCategoryTypes');
    console.log('drop CheckCategoryTypes');
  
    queryInterface.dropTable('Checks');
    console.log('drop Checks');
 
    queryInterface.dropTable('ProjectItemGroups');
    console.log('drop ProjectItemGroups');

    queryInterface.dropTable('ProjectItems');
    console.log('drop ProjectItems');
  
    queryInterface.dropTable('ChangeDesignLogs');
    console.log('drop ChangeDesignLogs');

    queryInterface.dropTable('CheckCategories');
    console.log('drop CheckCategories');

    queryInterface.dropTable('ProjectitemCategories');
    console.log('drop ProjectitemCategories');
  
    queryInterface.dropTable('Permissions');
    console.log('drop Permissions');
  
    queryInterface.dropTable('Projects');
    console.log('drop Projects');
    
    queryInterface.dropTable('Users');
    console.log('drop Users');
  }
};

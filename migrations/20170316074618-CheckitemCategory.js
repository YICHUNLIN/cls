/*

補充。實際檢查紀錄 與 檢查項目的類別關聯

*/


'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('CheckItems','checkcategory',
      {
        type: Sequelize.STRING(30),
        references: {
            model: 'CheckCategories',
            key: 'name'
        },
        allowNull: false
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    //return queryInterface.dropTable('CheckItems');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

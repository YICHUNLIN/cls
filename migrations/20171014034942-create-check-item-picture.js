'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('CheckItemPictures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      comment:{
        type:Sequelize.STRING,
        allowNull:true
      },
      belongCheckItem:{
        type: Sequelize.STRING(100),
        references: {
            model: 'CheckItems',
            key: 'ciid'
        },
        allowNull: false 
      },
      // 經度
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      //緯度
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      isMark:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('CheckItemPictures');
  }
};
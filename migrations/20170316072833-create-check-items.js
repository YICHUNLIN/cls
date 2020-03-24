/*
活動項目

實際檢查的紀錄
*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('CheckItems', {
      // 編號
      /*id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },*/
      ciid:{
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      // 經度
      latitude: {
        type: Sequelize.DOUBLE
      },
      //緯度
      longitude: {
        type: Sequelize.DOUBLE
      },
      //要檢查的元件
      projectitem:{
        type: Sequelize.INTEGER,
        references: {
            model: 'ProjectItems',
            key: 'id'
        },
        allowNull: false
      },
      bymember:{
        type: Sequelize.STRING(30),
        references:{
          model:'Users',
          key:'account'
        },
        allowNull:true
      },
      // 屬於活動
      belongcheck:{
        type: Sequelize.INTEGER,
        references: {
            model: 'Checks',
            key: 'id'
        },
        allowNull: false 
      },
      //敘述
      description:{
        type: Sequelize.TEXT
      },
      // 是否缺失 是否符合圖說 查驗結果
      /*missing:{
        type:Sequelize.BOOLEAN
      },*/
      resulttype:{
        type:Sequelize.STRING
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
    //return queryInterface.dropTable('CheckItems');
  }
};
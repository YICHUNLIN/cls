/*
  專案
*/

'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Projects', {
      // 工程編號
      identify:
      {
        type: Sequelize.STRING(100), 
        primaryKey: true,
        allowNull: false
      },
      //ifc 模型
      urn:{
        type: Sequelize.STRING,
        allowNull:true
      },
      // 工程名稱
      name:
      {
        type: Sequelize.STRING,
        allowNull:false
      },
      // 工期
      duration:
      {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      // 工程起算日
      startdate:
      {
        type: Sequelize.DATE,
        allowNull:true,
        validate: {
          isDate: true
        }
      },
      // 工程預計完工日
      estimateEndDate:
      {
        type: Sequelize.DATE,
        allowNull:true,
        validate: {
          isDate: true
        }
      },
      // 工程實際完工日
      actualEndDate:
      {
        type: Sequelize.DATE,
        allowNull:true,
        validate: {
          isDate: true
        }
      },
      // 變更設計後預定完工日
      afterchangeDesignDate:
      {
        type: Sequelize.DATE,
        allowNull:true,
        validate: {
          isDate: true
        }
      },
      // 增加累計工期
      increaseDuration:
      {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      description:
      {
        type: Sequelize.TEXT,
        allowNull:false
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
    //return queryInterface.dropTable('Projects');
  }
};
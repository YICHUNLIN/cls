'use strict';
module.exports = function(sequelize, DataTypes) {
  var CheckItemPictures = sequelize.define('CheckItemPictures', {
	 isMark:DataTypes.BOOLEAN,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    url: DataTypes.STRING,
    comment:DataTypes.STRING,
    belongCheckItem:DataTypes.STRING(100)
  }, {
    classMethods: {
      associate: function(models) {
        //一個picture 屬於一個checkitem
        models.CheckItemPictures.belongsTo(models.CheckItems);
      }
    }
  });
  return CheckItemPictures;
};
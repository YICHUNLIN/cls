/**
*	載入這個 ctrls 可以將所有Ctrls 一起載入
*
**/


var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);
var Ctrls = Ctrls || {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var module_name = "";
	extIndex = file.lastIndexOf('.');
	if (extIndex != -1) {
	    module_name = file.substr(0, extIndex);
	}
	Ctrls[module_name] = require('./'+module_name)
  });

module.exports = Ctrls;
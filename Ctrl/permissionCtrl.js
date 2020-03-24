/**
* 對於Permission的操作
* @module PermissionCtrl
*/
var PermissionCtrl = PermissionCtrl || {};

var models = require('../models/index');
var uuid = require('uuid/v4');
var jwt = require('jwt-simple');
var jwtSetting = require('../config/systemConf').jwtSetting;

/**
* 確認 permission 是否存在用(根據 ptype 取得permission)
* 
* @param {string} 	ptype
* @param {callback} cb 	callback function
*/
PermissionCtrl.checkPermissionExist = (ptype,cb)=>{
	models.Permission.findOne({
		where:{
			permlevel:ptype
		}
	}).then(function(permission){
		cb(permission);
	});
};

/**
* 確認 User 在一個 Project裡 是不是擁有 某個Permission (ex是不是ProjectMember)
* 
* @param {string} 	ptype
* @param {string} 	project id
* @param {string} 	permission
* @param {callback} cb callback function
*/
PermissionCtrl.checkPermission = (user, pid , goalPermission, cb)=>{
	models.ProjectMember.findOne({
		where:{
			project:pid,
			member:user
		},
		attributes:['ptype', 'project', 'member']
	}).then(function(pm){
		var ispt = false;
		for(var gp in goalPermission){
			if(goalPermission[gp] == pm.ptype){
				ispt = true;
				break;
			}
		}
		if(ispt){
			cb(true);
		}else{
			cb(false);
		}
	});
};

/**
* 取得Permission
* 
* @param {string} 	level
* @param {function}	cb
*
*/
PermissionCtrl.getPermission = (level, cb)=>{
	models.Permission.findOne({
		where:{
			permlevel:level
		}
	}).then(function(permission){
		cb(permission);
	});
};

module.exports = PermissionCtrl;
/*
功能已被遷移
*/
var express = require('express');
var models = require('../models/index')
var api = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine')

// 確定權限資料是否存在
exports.checkPermissionExist = function (ptype,fn){
	models.Permission.findOne({
		where:{
			permlevel:ptype
		}
	}).then(function(permission){
		fn(permission);
	});
};

// check user by account
exports.UserByAccount = function (account, fn){
	models.User.findOne({
		where:{
			account:account
		}
	}).then(function(user){
		fn(user)
	});
}

// 根據project id 取得 project member
exports.ProjectMemberByPid = function (pid, fn){
	models.ProjectMember.findAll({
		where:{
			project:pid
		}
	}).then(function(ProjectMember){
		fn(ProjectMember);
	});
}

// 根據 project 取得 project
exports.ProjectBypid = function (pid, fn){
	models.Project.findOne({
		where:{
			identify:pid
		}
	}).then(function(project){
		fn(project);

	});
}

// 根據 project id 取得 project checkss
exports.ProjectChecksByPid = function (pid, fn){

}

// 根據 project id 取得 project locations
exports.ProjectLocationsByPid = function (pid, fn){

}

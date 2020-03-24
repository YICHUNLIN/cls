/**
* 對於Project的操作
* @module ProjectCtrl
*/
var ProjectCtrl = ProjectCtrl || {};

var models = require('../models/index');
var uuid = require('uuid/v4');
var codes = require('../codedefine');


/**
* 根據 project id 取得 projectMember
* 
* @param {string} 	pid
* @param {callback} cb 	callback function	
*/
ProjectCtrl.ProjectMemberByPid = (pid, cb)=>{
	models.ProjectMember.findAll({
		where:{
			project:pid
		}
	}).then(function(ProjectMember){
		cb(ProjectMember);
	});
};

/**
* 根據 project id 取得 project
* 
* @param {string} 	pid
* @param {callback} cb 	callback function	
*/
ProjectCtrl.ProjectBypid = (pid, cb)=>{
	models.Project.findOne({
		where:{
			identify:pid
		}
	}).then(function(project){
		cb(project);
	});
}

/**
* 更新Project URN
* 
* @param {string} 	pid
* @param {callback} cb 	callback function	
*/
ProjectCtrl.UploadURNbyId = (pid, urn, cb)=>{
	models.Project.findOne({
		where:{
			identify:pid
		}
	}).then(function(project){
		if(project){
			project.update({urn:urn}).then(function(result){
				cb(result);
			})
		}
	});
}

ProjectCtrl.GetProjectUrn = (pid, cb)=>{
	models.Project.findOne({
		where:{
			identify:pid
		},
		attributes:['urn']
	}).then(function(project){
		cb(project.urn);
	});
}

module.exports = ProjectCtrl;
/**
* 對於Group的操作
* @module GroupCtrl
*/
var GroupCtrl = GroupCtrl || {};

var models = require('../models/index');
var uuid = require('uuid/v4');
var codes = require('../codedefine')
var passwordHash = require('password-hash');


/**
* 確定group 是否存在
* 
* @param {string} gn group name
* @param {callback} funcexist 如果存在
* @param {callback} funcnotexist 如果不存在
*/
GroupCtrl.groupIsExist = (gn, funcexist, funcnotexist)=>{
	models.UGroup.findAll({
		where:{
			name:gn
		}
	}).then(function(result){
		if(result.length > 0){
			funcexist(result);
		}else{
			funcnotexist(result);
		}
	})
};

/**
* 確定某個使用者是不是在某個group裡 方法1
* 
* @param {string} group groupname
* @param {string} account 
* @param {callback} cb call back function
*/
GroupCtrl.checkGroup = (group, account, cb)=>{
	var isOK = false;
	models.UserofGroup.findAll({
		where:{
			user:account
		},
		attributes:['group', 'user'],
		raw:true
	}).then(function(result){
		for(var g in result){
			if(result[g].group == group){
				isOK = true;
				break;
			}
		}
		cb(isOK);
	});
};

/**
* 確定某個使用者是不是在某個group裡 方法2
* 
* @param {string} 	group groupname
* @param {string} 	account 
* @param {function} succ call back function
* @param {function} failed call back function
*/
GroupCtrl.checkUserofGroup = (account, group, succ, failed)=>{
	models.UserofGroup.findOne(
		{
			where:{
				user:account,
				group:group
			}
		}).then(function(result){
			if(result){
				succ(result);
			}else{
				failed(result);
			}
		})
}



/**
*	Middleware test
*
*
*/
GroupCtrl.isAdmin = (req, res, next)=>{


	return next()
}
module.exports = GroupCtrl;

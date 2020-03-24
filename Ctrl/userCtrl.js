/**
* 對於使用者的操作
* @module UserCtrl
*/
var UserCtrl = UserCtrl || {};

var models = require('../models/index');
var uuid = require('uuid/v4');
var codes = require('../codedefine')
var passwordHash = require('password-hash');
var jwt = require('jwt-simple');
var jwtSetting = require('../config/systemConf').jwtSetting;

/**
* 加密密碼
* 
* @param {string} account 	帳號
* @param {string} password 	密碼
* @param {string} salt 		加密用的字串
* @return {string} 			透過 password-hash 加密的字串
*/
UserCtrl._encypt = (account, password, salt)=>{
	return passwordHash.generate(account+password+salt);
};

/**
* 驗證密碼
* 
* @param {string} 	text
* @param {string} 	cyphertext
* @param {callback} callback function	
*/
UserCtrl._authPassword = (text, cyphertext, cb)=>{
	if(!passwordHash.verify(text, cyphertext)){
		cb({"CODE":codes.login.passworderror},null);
	}else{
		cb(null,true)
	}
};

/**
* 確認使用者是否存在
* 
* @param {string} 	account
* @param {callback} cb 	callback function
*/
UserCtrl.checkUser = (account, cb)=>{
	UserCtrl._checkUser(account, (success)=>{
		cb(null, success);
	}, (failed)=>{
		cb({"CODE":codes.login.usernotfound}, null);
	});
};

/**
* 確認使用者是否存在
* 
* @param {string} 	account
* @param {function} success 	callback function
* @param {function} failed	 	callback function
*/
UserCtrl._checkUser = (account, success, failed)=>{
	models.User.findOne({
		where:{
			account:account
		}
	}).then(function(result){
		if(result){
			success(result);
		}else{
			failed(result);
		}
	})
}

/**
* 登入驗證
* 
* @param {string} 	account
* @param {string} 	password
* @param {callback} cb 			callback function
*/
UserCtrl.authLogin = (inputaccount, inputpassword, cb)=>{
	UserCtrl.checkUser(inputaccount,function(err,user){
		if(user){
			UserCtrl._authPassword(inputaccount+inputpassword+user.salt,user.password,function(err,result){
				if(result){
					cb(err, user);
				}else{
					cb(err, result);
				}
			});
		}else{
			cb(err,null);
		}
	})
};

/**
* 執行登入
* 
* @param {json} 	req
* @param {callback} cb 	callback function
*/
UserCtrl.dologin = (req, cb)=>{
	if(req.body.account && req.body.password){
		UserCtrl.authLogin(req.body.account, req.body.password,function(err, result){
			if(result){
				// db 登入狀態
				result.update({
					lastlogintime:Date.now(),
					loginip:req.ip
				}).then(function(user){
					cb({"CODE":codes.login.success,"user":user.account,"loginip":req.ip,"time":user.lastlogintime});
				});
			}else{
				cb({"CODE":codes.login.inputError});
			}
		})
	}else{
		cb({"CODE":codes.login.inputError});
	}
};

/**
* 執行註冊
* 
* @param {json} 	req
* @param {string} 	group
* @param {callback} cb 		callback function
*/
UserCtrl.doSignup = (req, group, cb)=>{
	UserCtrl.checkUser(req.body.account, function(err, user){
		// 產生 salt
		var salt = uuid.v4();
		//密碼加密
		var cypherPwd = UserCtrl._encypt(req.body.account, req.body.password, salt);
		// 如果沒有找到 會回傳 null
		if(user == null){
			models.User.create({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				account:req.body.account,
				password:cypherPwd,				// 加密
				mobile:req.body.mobile,
				tel:req.body.tel,
				email:req.body.email,
				role:req.body.role,
				company_name:req.body.company_name,
				company_address:req.body.company_address,
				company_tel:req.body.company_tel,
				loginip:req.ip,
				salt:salt,						// uuidsalt
				status:"NA"
			}).then(function(user) {
				//add togroup
				models.UserofGroup.create({
					group:group,
					user:user.account
				}).then(function(addResult){
		    		cb({"CODE":codes.signup.success});
				});
		  	});
		}else{
			cb({"CODE":codes.signup.duplicate});
		}
	});
};

/**
* 根據帳號取得使用者
* 
* @param {string} 	account
* @param {callback} cb 	callback function
*/
UserCtrl.UserByAccount = (account, cb)=>{
	models.User.findOne({
		where:{
			account:account
		}
	}).then(function(user){
		cb(user)
	});
}

module.exports = UserCtrl;

